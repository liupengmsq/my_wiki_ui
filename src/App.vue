<template>
  <div class="top-nav-container">
    <ul class="top-nav">
      <div class="top-nav-left-container">
        <li class="top-nav-left"><router-link to="/">主页</router-link></li>
      </div>
      <div class="top-nav-right-container">
        <li class="top-nav-right"><router-link to="/wikiManage">后台管理</router-link></li>
        <li class="top-nav-right"><theme-switcher ref="themeSwitcher" /></li>
      </div>
    </ul>
  </div>
  <router-view/>
</template>

<script>
import { onMounted, reactive, ref } from 'vue';
import light from 'highlight.js/styles/github.css?url'
import dark from 'highlight.js/styles/dark.css?url'
import ThemeSwitcher from './views/header/ThemeSwitcher.vue';

export default {
  components: { ThemeSwitcher },

  setup() {
    const themeSwitcher = ref(null);

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

    return {
      themeSwitcher
    }
  }
}
</script>

<style scoped>
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
  max-width: 1760px;
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
}
.top-nav-left:hover {
  background-color: var(--theme-dropdown-hover-background-color); 
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
