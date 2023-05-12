<template>
  <div class="container">
    <div class="container__left">
      <nav-tree-view :showManageButtons=true />
    </div>
    <div class="resizer" data-direction="horizontal"></div>
    <div class="container__right">
      <div class="wrapper">
        <div class="sub-wrapper">
          <h1>Wiki分类管理</h1>
          <input class="add-button" type="button" value="新增" @click="addCategory">
          <table>
            <th @click="sortForCategory('id')">Id</th>
            <th @click="sortForCategory('categoryName')">名字</th>
            <th>默认分类</th>
            <th class="th-operation">管理</th>
            <tr v-for="item in categoryList.list" :key="item.id" @click="switchCategoryNavTree(item.id)" :class="{'tr-selected':item.id == trSelected}">
              <td>{{ item.id }}</td>
              <td>{{ item.categoryName }}</td>
              <td>{{ item.default ? "是":"否" }}</td>
              <td>
                <input class="operation" type="button" @click="editCategory(item.id, item.categoryName, item.default)"
                  value="编辑">
                <input class="operation" type="button" @click="deleteCategory(item.id)" value="删除">
              </td>
            </tr>
          </table>
        </div>
        <div class="sub-wrapper">
          <h1>Wiki管理</h1>
          <button class="add-button"><router-link to="/markdownEditorPlugin">新增</router-link></button>
          <table>
            <th @click="sortForWiki('id')">Id</th>
            <th @click="sortForWiki('title')">标题</th>
            <th @click="sortForWiki('categoryName')">分类</th>
            <th @click="sortForWiki('createdDateTime')">创建时间</th>
            <th @click="sortForWiki('updatedDateTime')">修改时间</th>
            <th @click="sortForWiki('pageViewedNumber')">阅读次数</th>
            <th class="th-operation">管理</th>
            <tr v-for="item in wikiList.list" :key="item.id" @click="switchNavTreeInWikiTable(item.id, item.categoryId)" :class="{'tr-selected':item.id == trWikiSelected}">
              <td>{{ item.id }}</td>
              <td>{{ item.title }}</td>
              <td>{{ item.categoryName }}</td>
              <td>{{ item.createdDateTime.toLocaleString() }}</td>
              <td>{{ item.updatedDateTime.toLocaleString() }}</td>
              <td>{{ item.pageViewedNumber}}</td>
              <td>
                <button class="operation" ><router-link :to="`/markdownEditorPlugin/${item.id}`">编辑</router-link></button>
                <button class="operation" @click="deleteWiki(item.id)">删除</button>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>

  <confirm-dialog ref="confirmDialog"></confirm-dialog>
  <message-dialog ref="messageDialog"></message-dialog>
  <wiki-category-create-edit-dialog ref="wikiCategoryCreateEditDialog"></wiki-category-create-edit-dialog>
</template>

<script>
import { ref, reactive, onMounted, watchEffect } from 'vue';
import NavTreeView from '../nav/NavTreeView.vue';
import { useStore } from 'vuex';
import { resizable } from '../../utils/resizer.js'
import { get, deleteAPI, post, put } from '../../utils/request';
import WikiCategoryCreateEditDialog from './WikiCategoryCreateEditDialog.vue'
import MessageDialog from '../../components/MessageDialog.vue'
import ConfirmDialog from '../../components/ConfirmDialog.vue';

export default {
  name: 'WikiManageView',
  components: {
    NavTreeView,
    MessageDialog,
    WikiCategoryCreateEditDialog,
    ConfirmDialog
  },

  setup() {
    const store = useStore();

    //对话框dom对象的引用
    const confirmDialog = ref(null);
    const messageDialog = ref(null);
    const wikiCategoryCreateEditDialog = ref(null);

    // 排序相关
    const sortByProperty = (prop, reverse) => {
      return (a, b) => {
        if (typeof a[prop] === 'number') {
          return !!reverse ? (a[prop] - b[prop]) * -1 : (a[prop] - b[prop]);
        }
        if (a[prop] < b[prop]) {
          return reverse ? 1 : -1;
        }
        if (a[prop] > b[prop]) {
          return reverse ? -1 : 1;
        }
        return 0;
      };
    };

    // 代表wiki category表格中的数据，响应式的
    const categoryList = reactive({
      list: []
    });

    // wiki category排序
    let reverseSortForCategory = true;
    const sortForCategory = (coloumn) => {
      if (reverseSortForCategory) {
        categoryList.list.sort(sortByProperty(coloumn, reverseSortForCategory))
        reverseSortForCategory = false;
      } else {
        categoryList.list.sort(sortByProperty(coloumn, reverseSortForCategory))
        reverseSortForCategory = true;
      }
    }

    // 调用此方法会从后端API获取wiki category的数据，并绑定到categoryList这个响应式对象中，同时HTML dom也会自动更新
    const getWikiCategory = async () => {
      const response = await get('/api/wiki/category');
      console.log(response);
      if (response.Success) {
        categoryList.list = response.Result;
        console.log("categoryList.list is updated", categoryList.list);
      }
    }

    // 选中表中行后高亮选中的行，并切换左侧对应此分类的节点树
    const trSelected = ref(null);
    const switchCategoryNavTree = (categoryId) => {
      trSelected.value = categoryId;
      store.dispatch('setCurrentCategoryId', { categoryId: categoryId });
    }

    // 弹出对话框来创建新的wiki cateogry
    const addCategory = async () => {
      try {
        const confirmResult = await wikiCategoryCreateEditDialog.value.show({
          title: '新建Wiki分类',
          forEdit: false,
          categoryName: '',
          isDefault: false,
          onClickOKButton: async function (categoryName, isDefault) {
            const postData = {
              "categoryName": categoryName,
              "default": isDefault
            }
            const response = await post('/api/wiki/category', postData);
            console.log('response from post category', response);
            return response
          }
        });
        if (confirmResult.Success) {
          // 创建成功
          await messageDialog.value.show({
            title: 'Wiki分类创建成功',
            message: `Wiki分类 ${confirmResult?.Result?.categoryName} 创建成功`,
            success: true,
          });
          getWikiCategory();
        } else {
          // 创建失败
          await messageDialog.value.show({
            title: 'Wiki分类创建失败',
            message: confirmResult.Errors[0],
            success: false,
          })
        }
      } catch (error) {
        // 创建失败
        await messageDialog.value.show({
          title: 'Wiki分类创建失败',
          message: error?.response?.data?.Errors[0],
          success: false,
        })
      }
    }

    // 弹出对话框来编辑wiki cateogry
    const editCategory = async (categoryId, categoryName, isDefault) => {
      try {
        const confirmResult = await wikiCategoryCreateEditDialog.value.show({
          title: '编辑Wiki分类',
          forEdit: true,
          categoryName: categoryName,
          isDefault: isDefault,
          onClickOKButton: async function (categoryName, isDefault) {
            const postData = {
              "id": categoryId,
              "categoryName": categoryName,
              "default": isDefault
            }
            const response = await put('/api/wiki/category', postData);
            console.log('response from post category', response);
            return response
          }
        });
        if (confirmResult.Success) {
          // 编辑成功
          await messageDialog.value.show({
            title: 'Wiki分类编辑成功',
            message: `Wiki分类 ${confirmResult?.Result?.categoryName} 编辑成功`,
            success: true,
          });
          getWikiCategory();
        } else {
          // 编辑失败
          await messageDialog.value.show({
            title: 'Wiki分类编辑失败',
            message: confirmResult.Errors[0],
            success: false,
          })
        }
      } catch (error) {
        // 编辑失败
        await messageDialog.value.show({
          title: 'Wiki分类编辑失败',
          message: error?.response?.data?.Errors[0],
          success: false,
        })
      }
    }

    //删除wiki category
    const deleteCategory = async (categoryId) => {
      try {
        const confirmResult = await confirmDialog.value.show({
          // 确认对话框的标题
          title: '确认删除分类',
          // 确认对话框的消息
          message: `Wiki分类 ${categoryId} 将被删除！`,
          // 点击确认按钮后执行的方法
          onClickOKButton: async function () {
            // 调用后端删除节点API
            return await deleteAPI('/api/wiki/category/' + categoryId);
          }
        })
        console.log('confirm dialog result:', confirmResult);
        if (confirmResult.Success) {
          // 删除成功
          await messageDialog.value.show({
            title: '删除成功',
            message: `wiki分类 ${categoryId} 删除成功！`,
            success: true,
          });
          getWikiCategory();
        } else {
          // 删除失败
          await messageDialog.value.show({
            title: '删除失败',
            message: confirmResult.Errors[0],
            success: false,
          })
        }
      } catch (error) {
        // 删除失败
        await messageDialog.value.show({
          title: '删除失败',
          message: error?.response?.data?.Errors[0],
          success: false,
        })
      }
    }


    const wikiList = reactive({
      list: []
    });

    const getWikiList = async () => {
      const response = await get('/api/wiki');
      console.log(response);
      if (response.Success) {
        for (const item of response.Result) {
          item.createdDateTime = new Date(item.createdDateTime);
          item.updatedDateTime = new Date(item.updatedDateTime);
        }
        wikiList.list = response.Result;
        console.log("wikiList.list is updated", wikiList.list);
      } 
    }

     //删除wiki category
     const deleteWiki = async (wikiId) => {
      try {
        const confirmResult = await confirmDialog.value.show({
          // 确认对话框的标题
          title: '确认删除Wiki',
          // 确认对话框的消息
          message: `Wiki ${wikiId} 将被删除！`,
          // 点击确认按钮后执行的方法
          onClickOKButton: async function () {
            // 调用后端删除wiki API
            return await deleteAPI('/api/wiki/' + wikiId);
          }
        })
        console.log('confirm dialog result:', confirmResult);
        if (confirmResult.Success) {
          // 删除成功
          await messageDialog.value.show({
            title: '删除成功',
            message: `wiki ${wikiId} 删除成功！`,
            success: true,
          });
          getWikiList();
        } else {
          // 删除失败
          await messageDialog.value.show({
            title: '删除失败',
            message: confirmResult.Errors[0],
            success: false,
          })
        }
      } catch (error) {
        // 删除失败
        await messageDialog.value.show({
          title: '删除失败',
          message: error?.response?.data?.Errors[0],
          success: false,
        })
      }
    }

    // 选中表中行后高亮选中的行，并切换左侧对应此分类的节点树
    const trWikiSelected = ref(null);
    const switchNavTreeInWikiTable = (id, categoryId) => {
      trWikiSelected.value = id;
      store.dispatch('setCurrentCategoryId', { categoryId: categoryId });
    }

    // wiki排序
    let reverseSortForWiki = true;
    const sortForWiki = (coloumn) => {
      if (reverseSortForWiki) {
        wikiList.list.sort(sortByProperty(coloumn, reverseSortForCategory))
        reverseSortForWiki = false;
      } else {
        wikiList.list.sort(sortByProperty(coloumn, reverseSortForWiki))
        reverseSortForWiki = true;
      }
    }

    onMounted(async () => {
      // 使所有的分割div可拖动
      document.querySelectorAll('.resizer').forEach(function (ele) {
        resizable(ele);
      });

      getWikiCategory();
      getWikiList();
    });

    return {
      NavTreeView,

      // wiki category相关
      categoryList,
      trSelected,
      addCategory,
      editCategory,
      deleteCategory,
      switchCategoryNavTree,

      // wiki相关
      wikiList,
      trWikiSelected,
      deleteWiki,
      switchNavTreeInWikiTable,


      // 对话框
      confirmDialog,
      messageDialog,
      wikiCategoryCreateEditDialog,

      // 表格排序
      sortForCategory,
      sortForWiki,
    }
  }

}

</script>

<style scoped>
.wrapper {
  margin: .1rem;
}
.container {
  display: flex;
  /* width: 100%; */
  border: .01rem solid #cbd5e0;
  height: 95vh;
}

.container__left {
  /* display: flex; */

  /* Initially, the left takes 1/4 width */
  width: 20%;

  align-items: center;
  justify-content: center;

  overflow-x: scroll;
  overflow-y: scroll;
}

.container__right {
  /* display: flex; */
  /* Take the remaining width */
  flex: 1;

  /* align-items: stretch; */
  flex-direction: column;
  justify-content: center;
  overflow-x: scroll;
}

.resizer[data-direction='horizontal'] {
  background-color: #cbd5e0;
  cursor: ew-resize;
  height: 100%;
  width: .02rem;
}

.resizer[data-direction='vertical'] {
  background-color: #cbd5e0;
  cursor: ns-resize;
  height: .02rem;
  width: 100%;
}

.wrapper {
  overflow-x: auto;
}

.add-button {
  margin: .05rem 0;
}

table {
  border-collapse: collapse;
  border: .01rem solid #ccc;
  width: 100%;
}

th,
td {
  text-align: left;
  padding: .08rem;
  cursor: pointer;
}

th {
  background-color: var(--table-header-background-color);
}

tr:nth-child(even) {
  background-color: var(--table-row-nth-event-background-color);
}

tr:hover {
  background-color: var(--table-row-hover-background-color);
}

.tr-selected {
  background-color: var(--table-row-hover-background-color) !important;
  color: #fff;
}

.th-operation {
  width: 10%;
}

.operation {
  margin-right: .05rem;
}
</style>