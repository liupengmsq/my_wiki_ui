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
        <a @click="goToManagePage"><li class="top-nav-right" :class="{'router-selected':managePageSelected}">后台管理</li></a>
        <li class="top-nav-right"><theme-switcher ref="themeSwitcher" /></li>
      </div>
    </ul>
  </div>
  <!-- router-view 设置:key为当前的url，这样每当url有变化的时候，都会重新加载router对应的component -->
  <router-view :key="$route.fullPath"></router-view>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import light from 'highlight.js/styles/github.css?url'
import dark from 'highlight.js/styles/dark.css?url'
import ThemeSwitcher from './views/header/ThemeSwitcher.vue';
import { useRouter } from 'vue-router';
import { get } from './utils/request';

export default {
  components: { ThemeSwitcher },

  setup() {
    const themeSwitcher = ref(null);
    const router = useRouter();

    // 代表wiki category表格中的数据，响应式的
    const categoryList = reactive({
      list: []
    });

    const getWikiCategory = async () => {
      const response = await get('/api/wiki/category');
      console.log(response);
      if (response.Success) {
        categoryList.list = response.Result;
        console.log("categoryList.list is updated", categoryList.list);
      }
    }

    onMounted(() => {
      console.log('dark', dark);
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

    const routerSelected = ref(null);
    const managePageSelected = ref(false);
    const mainPageSelected = ref(false);

    const gotoRouter = (id) => {
      mainPageSelected.value = false;
      managePageSelected.value = false;
      routerSelected.value = id;
      router.push(`/wiki/${id}/1`);
    }

    const unSelecteAllCategories = () => {
      routerSelected.value = null;
    }

    const goToMainPage = () => {
      routerSelected.value = null;
      managePageSelected.value = false;
      mainPageSelected.value = true;
      router.push('/');
    }

    const goToManagePage = () => {
      routerSelected.value = null;
      mainPageSelected.value = false;
      managePageSelected.value = true;
      router.push('/wikiManage');
    }

    return {
      themeSwitcher,
      categoryList,
      gotoRouter,
      routerSelected,
      unSelecteAllCategories,
      mainPageSelected,
      managePageSelected,
      goToMainPage,
      goToManagePage
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
  max-width: 17.6rem;
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
</style>
