<template>
  <div class="top-nav-container">
    <nav class="top-nav">
      <router-link to="/">主页</router-link> |
      <router-link to="/markdownEditorPlugin">Markdown编辑器</router-link>
      <div class="top-nav-right"><theme-switcher ref="themeSwitcher" /></div>
    </nav>
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
  padding-top: .1rem;
  padding-bottom: .1rem;
  /* background-color: #0593d3; */
}
.top-nav {
  display: flex;
  max-width: 1760px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  /* color: #fff; */
}

.top-nav-right {
  margin-left: auto;
}

</style>
