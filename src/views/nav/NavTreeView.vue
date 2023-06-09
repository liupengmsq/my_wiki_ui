<template>
  <div class="nav_container">
    <div v-if="showManageButtons">
      <input type="button" value="管理" @click="onClickManageNavTreeButton">
      <input type="button" value="返回" @click="onClickDisableManageNavTreeButton">
      <input type="button" value="新建根节点" @click="onClickCreateNavTreeRootNodeButton">
    </div>
    <div id="nav" class="nav" v-html="finalHtml" @click="onNodeClicked"></div>
  </div>

  <confirm-dialog ref="confirmDialog"></confirm-dialog>
  <message-dialog ref="messageDialog"></message-dialog>
  <nav-node-create-edit-dialog ref="nodeCreateEditDialog"></nav-node-create-edit-dialog>
</template>

<script>
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import * as nav_util from '../../utils/nav';

import ConfirmDialog from '../../components/ConfirmDialog.vue'
import MessageDialog from '../../components/MessageDialog.vue'
import NavNodeCreateEditDialog from './NavNodeCreateEditDialog.vue'

export default {
  name: 'AboutView',
  props: ['showManageButtons'],
  components: {
    ConfirmDialog,
    MessageDialog,
    NavNodeCreateEditDialog,
  },

  setup (props) {
    const store = useStore();
    const confirmDialog = ref(null);
    const messageDialog = ref(null);
    const nodeCreateEditDialog = ref(null);

    const onClickLinkOnNavNode = (e) => {
      // 取消掉所有选中的node节点
      console.log('Clear selected item in nav list');
      const linkElements = document.getElementById('nav').getElementsByTagName('A');
      for (const link of linkElements) {
        if (link.classList.contains('nav-selected')) {
          link.classList.remove('nav-selected');
        }
      }

      // 将选中的节点标记为高亮
      console.log('Mark selected item in nav list');
      e.target.classList.add('nav-selected');

      // 状态保存到localStorage中
      nav_util.selectNavTreeNode(e.target.id, store.getters.getCurrentCategoryId);
    }

    const onClickExpandIconOnNavNode = (e) => {
      const currentNode = e.target.parentElement;
      
      // 轮询被点击节点的儿子节点，将其显示或隐藏
      for (const child of currentNode.children) {
        if(child.tagName === 'DIV') {
          if (child.style.display === "none") {
            child.style.display = "block";
            nav_util.show_nav_tree_node(child.id, store.getters.getCurrentCategoryId);
          } else {
            child.style.display = "none";
            nav_util.unshow_nav_tree_node(child.id, store.getters.getCurrentCategoryId);
          }
        }
      }

      // 将选中的节点的展开或者折叠的图标更换
      if (e.target.classList.contains('icon-expanded')) {
        e.target.classList.remove('icon-expanded');
        e.target.classList.add('icon-collapsed');
        nav_util.collapse_nav_tree_node(e.target.id, store.getters.getCurrentCategoryId);

      } else if (e.target.classList.contains('icon-collapsed')) {
        e.target.classList.remove('icon-collapsed');
        e.target.classList.add('icon-expanded');
        nav_util.expand_nav_tree_node(e.target.id, store.getters.getCurrentCategoryId);
      }
    }

    // 节点树的HTML
    const finalHtml = computed(() => store.getters.getFinalRawHTML );

    // 监控当前wiki分类的id
    const currentCategoryId = computed(() => store.getters.getCurrentCategoryId );

    // 初始化左侧导航栏
    onMounted(() => {
      if (!props.showManageButtons) {
        nav_util.disableManageMode();
      }
      const route = useRoute();
      store.dispatch('setCurrentCategoryId', { categoryId: route.params.categoryId })
      store.dispatch('setHardSelectNode', { hardSelectNode: route.query.hardSelect })
      store.dispatch('setCurrentWikiId', { currentWikiId: route.params.id })
      
      // 这里注释掉了在页面加载时就重新刷新tree的功能，因为下面的 "watch(currentCategoryId, (newValue, oldValue)" 方法总是会在页面加载时被触发
      // 原因是currentCategoryId是存储在vuex中的，而vuex中的state的值在重新刷新页面的时候就会被清空，那么currentCategoryId的值就会从一个null值变为一个categoryId的值
      // 这种变化就会被watch方法捕获到，从而刷新tree结构
      // store.dispatch('generateNavTree');
    });

    // 当getCurrentCategoryId的值有变化时，重新刷新nav tree
    watch(currentCategoryId, (newValue, oldValue) => {
      store.dispatch('generateNavTree');
    })

    // 通过在vue的raw html的父节点上监控事件触发，来实现raw html的事件处理
    const onNodeClicked = async (e) => {
      // 处理当用户点击某个节点的文字
      if(e.target.tagName === 'A') {
        onClickLinkOnNavNode(e);
      }
      // 处理当用户点击某个节点文字前的展开或隐藏图标
      if(e.target.tagName === 'I') {
        onClickExpandIconOnNavNode(e);
      }
      // 处理点击新建，编辑与删除的按钮
      if(e.target.tagName === 'INPUT') {
        console.log(e.target.id);
        if (e.target.value === "新建") {
          onClickCreateNavTreeNodeButton(e.target.id);
        }
        if (e.target.value === "编辑") {
          onClickEditNavTreeNodeButton(e.target.id);
        }
        if (e.target.value === "删除") {
          onClickDeleteNavTreeNodeButton(e.target.id);
        }
      }
    }

    // 点击管理按钮
    const onClickManageNavTreeButton = ()=> {
      nav_util.enableManageMode();
      store.dispatch('generateNavTree', { categoryId: store.getters.getCurrentCategoryId });
    }

    // 点击返回按钮
    const onClickDisableManageNavTreeButton = ()=> {
      nav_util.disableManageMode();
      store.dispatch('generateNavTree', { categoryId: store.getters.getCurrentCategoryId });
    }

    // 点击新建根节点按钮
    const onClickCreateNavTreeRootNodeButton = ()=> {
      onClickCreateNavTreeNodeButton(null, true);
    }

    // 处理新建节点的逻辑
    const onClickCreateNavTreeNodeButton = async (parentNodeId, forRootNode=false) => {
      try {
        const confirmResult = await nodeCreateEditDialog.value.show({
          title: '新建节点',
          forRootNode: forRootNode,
          parentNodeId: parentNodeId,
          forEdit: false,
          okButton: '新建',
          onClickOKButton: async function (nodeTitle, nodeURL) {
            if(forRootNode) {
              return nav_util.createNavTreeNode(null, nodeTitle, nodeURL, store.getters.getCurrentCategoryId, true);
            } else {
              return nav_util.createNavTreeNode(parentNodeId, nodeTitle, nodeURL, store.getters.getCurrentCategoryId);
            }
          }
        });
        console.log('confirm dialog result:', confirmResult);
        if (confirmResult.Success) {
          // 创建成功
          await messageDialog.value.show({
            title: '节点创建成功',
            message: `节点 ${confirmResult?.Result?.id} 创建成功！`,
            success: true,
          });
          // 刷新节点树
          store.dispatch('generateNavTree');
        } else {
          // 创建失败
          await messageDialog.value.show({
            title: '节点创建失败',
            message: confirmResult.Errors[0],
            success: false,
          })
        }
      } catch (error) {
        console.error(error);
        // 创建失败
        await messageDialog.value.show({
          title: '节点创建失败',
          message: error,
          success: false,
        })
      }
    }

    // 处理节点编辑的逻辑
    const onClickEditNavTreeNodeButton = async (currentNodeId) => {
      try {
        const currentNodeInfo = await nav_util.getNavTreeNodeById(currentNodeId);
        console.log('currentNodeInfo', currentNodeInfo);

        const confirmResult = await nodeCreateEditDialog.value.show({
          title: '编辑节点',
          currentNodeId: currentNodeId,
          forEdit: true,
          navNodeURL: currentNodeInfo.Result.target,
          navNodeTitle: currentNodeInfo.Result.content,
          okButton: '更新',
          onClickOKButton: async function (nodeTitle, nodeURL) {
            return nav_util.editNavTreeNode(currentNodeId, nodeTitle, nodeURL);
          }
        });
        console.log('confirm dialog result:', confirmResult);
        if (confirmResult.Success) {
          // 创建成功
          await messageDialog.value.show({
            title: '节点更改成功',
            message: `节点 ${currentNodeId} 更改成功！`,
            success: true,
          });
          // 刷新节点树
          store.dispatch('generateNavTree');
        } else {
          // 创建失败
          await messageDialog.value.show({
            title: '节点更改失败',
            message: confirmResult.Errors[0],
            success: false,
          })
        }
      } catch (error) {
        console.error(error);
        // 创建失败
        await messageDialog.value.show({
          title: '节点更改失败',
          message: error,
          success: false,
        })
      }
    }

    // 处理删除节点的逻辑
    const onClickDeleteNavTreeNodeButton = async (nodeId) => {
      try {
        const confirmResult = await confirmDialog.value.show({
          // 确认对话框的标题
          title: '确认删除节点',
          // 确认对话框的消息
          message: `节点 ${nodeId} 将被删除！`,
          // 点击确认按钮后执行的方法
          onClickOKButton: async function () {
            // 调用后端删除节点API
            return await nav_util.deleteNavTreeNode(nodeId);
          }
        })
        console.log('confirm dialog result:', confirmResult);
        if (confirmResult.Success) {
          // 删除成功
          await messageDialog.value.show({
            title: '节点删除成功',
            message: `节点 ${nodeId} 删除成功！`,
            success: true,
          });
          // 刷新节点树
          store.dispatch('generateNavTree');
        } else {
          // 删除失败
          await messageDialog.value.show({
            title: '节点删除失败',
            message: confirmResult.Errors[0],
            success: false,
          })
        }
      } catch (error) {
        // 删除失败
        await messageDialog.value.show({
          title: '节点删除失败',
          message: error?.response?.data?.Errors[0],
          success: false,
        })
      }
    }

    return {
      // 节点树的html
      finalHtml,

      // 点击节点树中任何元素的事件响应函数
      onNodeClicked,

      // 启动与关闭节点管理
      onClickManageNavTreeButton,
      onClickDisableManageNavTreeButton,
      onClickCreateNavTreeRootNodeButton,

      // 对话框
      confirmDialog,
      messageDialog,
      nodeCreateEditDialog,
    }
  }
}
</script>

<style lang="scss">
// 这里的css不能使用scoped局部样式, 因为我们要应用到raw html上
.nav_container {
  background-color: var(--nav-container-background-color);
  border-right: .01rem solid #dddddd;
  border-radius: .05rem 0 0 .05rem;
  padding-top: .1rem;
  padding-bottom: .1rem;
  overflow-x: auto;
  min-width: 2.5rem;
  max-width: 3rem;
}
.nav {
  font-size: .16rem;
  line-height: .26rem;
  padding: 0 .2rem 0 .2rem;
  box-sizing: border-box;
  user-select: none;
}
.nav-selected {
  background: var(--nav-selected-background-color) !important;
  color: var(--nav-selected-color) !important;
}
.manage_button {
  margin: .01rem 0 .01rem .05rem;
  // border-radius: .04rem;
  font-size: .16rem;
  text-align: center;
}
</style>
