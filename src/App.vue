<template>
  <div class="top-nav-container">
    <ul class="top-nav">
      <div class="top-nav-left-container">
        <a @click="goToMainPage"><li class="top-nav-left" :class="{'router-selected':mainPageSelected}">主页</li></a>
        <template v-for="item in categoryList.list" :key="item.id" >
          <a v-if="item.active" @click="gotoRouter(item.id)"><li class="top-nav-left" :class="{'router-selected':item.id == routerSelected}">{{ item.categoryName }}</li></a>
        </template>
      </div>
      <div class="top-nav-right-container">
        <div class="search-input-wrapper">
          <i class="icon-search"></i>
          <input class="search-input" v-focus tabindex="1" v-model="searchText" type="text" placeholder="输入搜索内容" @keydown.enter="search" required>
        </div>
        <!-- <a @click="goToManagePage"><li class="top-nav-right" :class="{'router-selected':managePageSelected}">后台管理</li></a> -->
        <li class="top-nav-right"><theme-switcher ref="themeSwitcher" /></li>
      </div>
    </ul>
  </div>
  <!-- router-view 设置:key为当前的url，这样每当url有变化的时候，都会重新加载router对应的component -->
  <router-view :key="$route.fullPath"></router-view>

  <div class="footer-nav-container">
    <div class="footer-nav">
      <span class="footer-nav-left"><a class="footer-link" href="/">刘鹏的网络日志</a> Copyright © 2023</span>
      <span class="footer-nav-right">
        <ul>
          <li><a class="footer-link" href="/login">登陆</a></li>
          <li><a class="footer-link" href="/manage">管理</a></li>
        </ul>
      </span>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import light from 'highlight.js/styles/github.css?url'
import dark from 'highlight.js/styles/dark.css?url'
import ThemeSwitcher from './views/header/ThemeSwitcher.vue';
import { useRouter } from 'vue-router';
import { get } from './utils/request';
import * as nav_util from './utils/nav';

export default {
  components: { ThemeSwitcher },

  setup() {
    const themeSwitcher = ref(null);
    const router = useRouter();
    const searchText = ref('');

    // 代表当前顶部导航栏选中的是哪个项目
    const routerSelected = ref(null); //选中的是顶部导航栏除了主页与后台管理以外的项目
    const managePageSelected = ref(false); //true为选中的是后台管理的项目
    const mainPageSelected = ref(false); //true为选中的是主页的项目

    // 代表wiki category表格中的数据，响应式的
    const categoryList = reactive({
      list: []
    });

    const getWikiCategory = async () => {
      const response = await get('/wiki/category/headers');
      console.log(response);
      if (response.Success) {
        categoryList.list = response.Result;
        console.log("categoryList.list is updated", categoryList.list);
      }
    }

    onMounted(() => {
      var theme = document.getElementById('theme');
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark")
        theme.setAttribute('href', dark);
      } else {
        document.documentElement.classList.add("light")
        theme.setAttribute('href', light);
      }
      // MediaQueryList
      const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");
      // recommended method for newer browsers: specify event-type as first argument
      darkModePreference.addEventListener("change", e => e.matches && activateDarkMode());
      const lightModePreference = window.matchMedia("(prefers-color-scheme: light)");
      // recommended method for newer browsers: specify event-type as first argument
      lightModePreference.addEventListener("change", e => e.matches && activateLightMode());


      if (!localStorage.theme) {
        themeSwitcher.value.switchToOSDefaultTheme();
      } else {
        if (localStorage.theme === 'os-default') {
          themeSwitcher.value.switchToOSDefaultTheme();
        }
        if (localStorage.theme === 'light') {
          themeSwitcher.value.switchToLightTheme();
        }
        if (localStorage.theme === 'dark') {
          themeSwitcher.value.switchToDarkTheme();
        }
      }

      // 页面加载时从localStorage读取顶部导航栏已经选中的是哪个项目，并设置上去
      if (sessionStorage.routerSelected) {
        if (sessionStorage.routerSelected === 'main') {
          routerSelected.value = null;
          managePageSelected.value = false;
          mainPageSelected.value = true;
        } else if (sessionStorage.routerSelected === 'manage') {
          routerSelected.value = null;
          mainPageSelected.value = false;
          managePageSelected.value = true;
        } else {
          mainPageSelected.value = false;
          managePageSelected.value = false;
          routerSelected.value = sessionStorage.routerSelected;
        }
      } else {
        routerSelected.value = null;
        managePageSelected.value = false;
        mainPageSelected.value = true;
      }

      getWikiCategory();
    });

    const activateDarkMode = () => {
      console.log('activateDarkMode');
      var theme = document.getElementById('theme');
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
      theme.setAttribute('href', dark);
    }

    const activateLightMode = () => {
      console.log('activateLightMode');
      var theme = document.getElementById('theme');
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      theme.setAttribute('href', light);
    }

    const gotoRouter = async (id) => {
      let wikiId = null;
      let hardSelect = false;

      // 先从localStorage中获取当前选中的节点id
      const currentSelectedNodeIdInLocalStorage = nav_util.getCurrentSelectedNodeId(id);
      if (currentSelectedNodeIdInLocalStorage) {
        // 使用节点id获取wiki的id
        const currentNodeInfo = await nav_util.getNavTreeNodeById(currentSelectedNodeIdInLocalStorage);
        wikiId = currentNodeInfo.Result.target;
        hardSelect = false;
      } else {
        // 如果localStorage中没有选中的节点id，获取节点树中的根节点
        const response = await nav_util.getNavTreeRootNode(id);
        wikiId = 1;
        hardSelect = true;
        if (response.Success) {
          wikiId = response.Result.target;
        } else {
          console.error(`Error when getting root node for category id ${id}`);
        }
      }

      mainPageSelected.value = false;
      managePageSelected.value = false;
      routerSelected.value = id;
      sessionStorage.routerSelected = id;
      router.push({ path: `/wiki/${id}/${wikiId}`, query: { hardSelect: hardSelect } });
    }

    const unSelecteAllCategories = () => {
      routerSelected.value = null;
    }

    const goToMainPage = () => {
      routerSelected.value = null;
      managePageSelected.value = false;
      mainPageSelected.value = true;
      sessionStorage.routerSelected = 'main';
      router.push('/');
    }

    const search = () => {
      router.push(`/search/${searchText.value}`);''
    }

    // const goToManagePage = () => {
    //   routerSelected.value = null;
    //   mainPageSelected.value = false;
    //   managePageSelected.value = true;
    //   sessionStorage.routerSelected = 'manage';
    //   router.push('/wikiManage');
    // }

    return {
      themeSwitcher,
      categoryList,
      gotoRouter,
      routerSelected,
      unSelecteAllCategories,
      mainPageSelected,
      managePageSelected,
      goToMainPage,
      searchText,
      search
    }
  }
}
</script>

<style scoped>
a:hover {
  background-color: rgba(0, 0, 0, 0);
}
.top-nav-container {
  width: 100%;
  padding-left: auto;
  padding-right: auto;
  padding-top: .05rem;
  padding-bottom: .05rem;
}
.top-nav {
  display: flex;
  align-items: center;
  max-width: 12rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.top-nav-left-container {
  display: flex;
}

.top-nav-left {
  margin-right: .1rem;
  background-color: var(--body-background-color);
  color: var(--button-color);
  padding: .05rem;
  font-size: .15rem;
  font-weight: 500;
  border: none;
  border-radius: 0.05rem;
  height: .26rem;
  text-align: center;
  user-select: none;
}
.top-nav-left:hover {
  background-color: var(--theme-dropdown-hover-background-color); 
}

.router-selected {
  background-color: var(--theme-dropdown-hover-background-color) !important; 
}

.top-nav-right-container {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.top-nav-right {
  margin-right: .1rem;
  background-color: var(--body-background-color);
  color: var(--button-color);
  padding: .05rem;
  font-size: .15rem;
  font-weight: 500;
  border: none;
  border-radius: 0.05rem;
  height: .26rem;
}

.top-nav-right:hover {
  background-color: var(--theme-dropdown-hover-background-color); 
}
.search-input-wrapper {
  position: relative;
}

.search-input {
  width: 80%;
  margin-right: .1rem;
  padding-left: .3rem !important;
  height: .18rem;
  max-width: 100%;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: .15rem;
  background-color: var(--input-background-color);
  color: var(--input-color);
}

.footer-nav-container {
  width: 100%;
  padding-left: auto;
  padding-right: auto;
  padding-top: .15rem;
  padding-bottom: .15rem;
}

.footer-nav {
  display: flex;
  align-items: center;
  max-width: 12rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
}

.footer-nav-left {
  margin-left: auto;
  margin-right: auto;
  font-size: small;
}

 .footer-link {
  color: var(--nav-selected-background-color);
  font-weight: 800;
  font-size: small;
}

.footer-nav-right {
  margin-left: auto;
}

ul li{
  display: inline;
  margin-right: .2rem;
}


</style>
