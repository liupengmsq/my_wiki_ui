import { createStore } from 'vuex';
import { getNavTree } from '../utils/nav';

export default createStore({
  state: {
    // 代表节点的树根
    rootNode: null,
    // 代表递归调用的当前节点
    currentNode: null,
    // 代表以上面的rootNode为根的树的html字符串
    finalRawHtml: '',

    currentCategoryId: null,

    //hardSelectNode为true代表需要将currentWikiId所对应的nodeId置为选中状态
    hardSelectNode: null,
    currentWikiId: null
  },
  getters: {
    getFinalRawHTML (state) {
      return state.finalRawHtml;
    },
    getCurrentCategoryId (state) {
      return state.currentCategoryId;
    }
  },
  mutations: {
    // 递归调用此方法，打印以当前state.currentNode为根节点的树
    generateHTMLTree(state, payload) {
      const { manageMode } = payload;
      console.log("manageMode: ", manageMode);
      if (manageMode) {
        console.log('In manage mode!!!!');
      }
      console.log('generateHTMLTree', state.currentNode);

      // 当前节点是空，说明当前节点是叶子节点，不用继续处理了。
      if(!state.currentNode) {
        return;
      }

      // 递归调用当前方法，拼出整个树对应的HTML： 每个树节点的开始HTML tag + 中间是递归的子节点的HTML tag + 结束HTML tag
      console.log(state.currentNode);
      console.log(state.currentNode.getStartTag());
      state.finalRawHtml += state.currentNode.getStartTag();
      state.finalRawHtml += state.currentNode.content;
      if (manageMode) {
        state.finalRawHtml += state.currentNode.getManageButttons();
      }
      for(const child of state.currentNode.childNodes) {
        state.currentNode = child;
        this.commit('generateHTMLTree', payload) //递归调用当前的generateHTMLTree(state)方法，打印以当前child为根节点的子树
      }
      state.finalRawHtml += state.currentNode.endTag;
    },
  },
  actions: {
    // 生成新的节点树（从后端API读取树的信息，然后在前端构造出一棵树）
    async generateNavTree({ commit, state }) {
      let manageMode = false;
      if (localStorage.manageMode) {
        manageMode = JSON.parse(localStorage.manageMode);
      } else {
        localStorage.manageMode = false;
      }
      console.warn("当前的管理模式为：", manageMode);

      let root = null;
      // alert(state.hardSelectNode);
      // alert(state.currentWikiId);
      if(state.hardSelectNode === 'true') {
        root = await getNavTree(state.currentCategoryId, manageMode, state.currentWikiId);
      } else {
        root = await getNavTree(state.currentCategoryId, manageMode);
      }
      console.log('root from getNavTree()', root);

      // 用state全局对象保存树的根节点
      state.rootNode = root;
      // 将当前节点设置为树的根节点，以此为开始轮询整个树
      state.currentNode = root;
      // 轮询整个树，使用finalRawHtml将树的HMTL构造出来
      state.finalRawHtml = '';

      console.log('state.rootNode', state.rootNode);
      commit('generateHTMLTree', { manageMode });
    },
    setCurrentCategoryId({ state }, payload) {
      const { categoryId } = payload;
      console.log('setting current category id: ', categoryId);
      state.currentCategoryId = categoryId;
    },
    setHardSelectNode({ state }, payload) {
      const { hardSelectNode } = payload;
      console.log('setting hardSelectNode: ', hardSelectNode);
      state.hardSelectNode = hardSelectNode;
    },
    setCurrentWikiId({ state }, payload) {
      const { currentWikiId } = payload;
      console.log('setting currentWikiId: ', currentWikiId);
      state.currentWikiId = currentWikiId;
    }
  },
  modules: {
  }
})
