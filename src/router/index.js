import { createRouter, createWebHistory } from 'vue-router'
import * as nav_util from '../utils/nav';
import { get } from '../utils/request';

const routes = [
  {
    path: '/',
    name: 'BlogListView',
    component: () => import('../views/blog/BlogListView.vue')
  },
  {
    path: '/blog/:categoryId/:id',
    name: 'BlogContentView',
    component: () => import('../views/blog/BlogContentView.vue')
  },
  {
    path: '/wiki/:categoryId/:id',
    name: 'wikiMainView',
    component: () => import('../views/wiki/WikiMainView.vue')
  },
  {
    path: '/markdownEditorPlugin',
    name: 'markdownEditorPluginForCreate',
    component: () => import('../views/wiki/MarkdownPluginEditorView.vue')
  },
  {
    path: '/markdownEditorPlugin/:id',
    name: 'markdownEditorPluginForEdit',
    component: () => import('../views/wiki/MarkdownPluginEditorView.vue')
  },
  {
    path: '/login',
    name: 'LoginView',
    component: () => import('../views/login/LoginView.vue')
  },
  {
    path: '/manage',
    name: 'wikiManage',
    component: () => import('../views/wiki/WikiManageView.vue')
  },
  {
    path: '/search',
    name: 'wikiSearchResultWithoutInputArg',
    component: () => import('../views/wiki/WikiSearchResult.vue')
  },
  {
    path: '/search/:searchText',
    name: 'wikiSearchResult',
    component: () => import('../views/wiki/WikiSearchResult.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from) => {
  if (to.name === "wikiManage") {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (localStorage.jwtToken) {
      headers['Authorization'] = `${localStorage.jwtToken}`
    }
    const resposne = await get('/hasAuthenticated', {}, headers)
    if (!resposne.Success) {
      alert(resposne.Errors);
      return false;
    }
  }
  
  // 当/wiki后面没有id这个query string的时候，默认从后端获取根节点的wiki page ID
  if((to.name === "wikiMainView" || to.name === "wikiManage") && !Object.hasOwn(to.params, "id")){
    try {
      // 获取默认的wiki category的id
      let response = await get('/wiki/category/default');
      if (!response.Success) {
        console.error("Error when calling API '/wiki/category/default'!!", response.Errors);
      }
      const defaultCategoryId = response.Result.id
      console.log('默认的wiki分类的id为: ', defaultCategoryId);

      // 获取默认wiki category对应的node tree根节点对应的wiki
      response = await nav_util.getNavTreeRootNode(defaultCategoryId);
      console.log('Got root node', response);

      // 设置路由的params，以便在组件中使用route.params.id与route.params.categoryId读取
      to.params.id = response.Result.target;
      to.params.categoryId = defaultCategoryId;

      console.log('router.beforEach: to.query.categoryId', to.params.categoryId);
    } catch(error) {
      console.error('获取根节点失败！！！', error);
    }
    console.log('to', to);
    console.log('from', from);
  }
})

export default router
