<template>
  <div class="top-nav-container">
    <nav class="top-nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/wiki">Wiki</router-link> |
      <router-link to="/markdown">Markdown</router-link> |
      <router-link to="/markdownEditorPlugin">Markdown Editor</router-link>
      <input type="button" value="更换主题" @click="switchTheme" />
    </nav>
  </div>
  <router-view/>
</template>

<script>
import { onMounted, reactive } from 'vue';
import light from 'highlight.js/styles/github.css?url'
import dark from 'highlight.js/styles/dark.css?url'

export default {
  setup() {
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
    });

    const switchTheme = () => {
      var theme = document.getElementById('theme');
      if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("light")
        document.documentElement.classList.add("dark")
        theme.setAttribute('href', dark);
      } else if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
        theme.setAttribute('href', light);
      } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add("dark")
          theme.setAttribute('href', dark);
        } else {
          document.documentElement.classList.add("light")
          theme.setAttribute('href', light);
        }
      }
    }

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
      switchTheme 
    };
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
  max-width: 1760px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  /* color: #fff; */
}

</style>
