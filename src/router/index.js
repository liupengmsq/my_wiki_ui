import { createRouter, createWebHistory } from 'vue-router'
import * as nav_util from '../utils/nav';
import { defineAsyncComponent } from "vue"

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/wiki/WikiMainView.vue')
  },
  {
    path: '/wiki',
    name: 'wikiMainView',
    component: () => import('../views/wiki/WikiMainView.vue')
  },
  {
    path: '/markdownEditorPlugin',
    name: 'markdownEditorPlugin',
    component: () => import('../views/wiki/MarkdownPluginEditorView.vue')
  },
  {
    path: '/wikiManage',
    name: 'wikiManage',
    component: () => import('../views/wiki/WikiManageView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  // 当/wiki后面没有id这个query string的时候，默认从后端获取根节点的wiki page ID
  if((to.name === "wikiMainView" || to.name === "home") && !Object.hasOwn(to.query, "id")){
    try {
      const response = await nav_util.getNavTreeRootNode(3);
      console.log('Got root node', response);
      to.query.id = response.Result.target;
    } catch(error) {
      console.error('获取根节点失败！！！', error);
    }
    console.log('to', to);
    console.log('from', from);
  }
})

export default router
