<template>
  <div id="content" class="content">
    <input type="button" value="更换主题" @click="switchTheme" />
    <h1>这里是标题 {{ wikiId }}</h1>
    <p v-html="wikiData.markdownContent"></p>
  </div>
</template>
    
<script>
import { useRoute } from 'vue-router';
import { onMounted, reactive } from 'vue';
import { get } from '../../utils/request';
import { marked } from 'marked';
import hljs from 'highlight.js';

export default {
  name: 'WikiContentView',
  setup() {
    const route = useRoute();

    const switchTheme = () => {
      var theme = document.getElementById('theme');
      if (document.documentElement.classList.contains("light")) {
        document.documentElement.classList.remove("light")
        document.documentElement.classList.add("dark")
        theme.setAttribute('href', '../node_modules/highlight.js/styles/dark.css');
      } else if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark")
        document.documentElement.classList.add("light")
        theme.setAttribute('href', '../node_modules/highlight.js/styles/github.css');
      } else {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add("dark")
          theme.setAttribute('href', '../node_modules/highlight.js/styles/dark.css');
        } else {
          document.documentElement.classList.add("light")
          theme.setAttribute('href', '../node_modules/highlight.js/styles/github.css');
        }
      }
    }

    // 当前wiki page的在数据库中的主键id
    const wikiId = route.query.id;
    const wikiData = reactive({
      markdownContent: '',
    });

    onMounted(() => {
      console.log('route.query.id', route.query.id);
      marked.options({
        highlight: (code, lang) => hljs.highlight(code, { language: lang }).value,
      })

      // 从后端API获取当前wiki的内容
      get(`/api/wiki/${route.query.id}`).then(response => {
        console.log(`Response from "/wiki/${route.query.id}"`, response);
        wikiData.markdownContent = marked(response.Result.markdownContent);
      }).catch(error => {
        console.error(`Error from "/wiki/${route.query.id}"`, error);
      });

      var theme = document.getElementById('theme');
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark")
        theme.setAttribute('href', '../node_modules/highlight.js/styles/dark.css');
      } else {
        document.documentElement.classList.add("light")
        theme.setAttribute('href', '../node_modules/highlight.js/styles/github.css');
      }

      // MediaQueryList
      const darkModePreference = window.matchMedia("(prefers-color-scheme: dark)");

      // recommended method for newer browsers: specify event-type as first argument
      darkModePreference.addEventListener("change", e => e.matches && activateDarkMode());

      const lightModePreference = window.matchMedia("(prefers-color-scheme: light)");

      // recommended method for newer browsers: specify event-type as first argument
      lightModePreference.addEventListener("change", e => e.matches && activateLightMode());

    });

    const activateDarkMode = () => {
      console.log('activateDarkMode');
      var theme = document.getElementById('theme');
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
      theme.setAttribute('href', '../node_modules/highlight.js/styles/dark.css');
    }

    const activateLightMode = () => {
      console.log('activateLightMode');
      var theme = document.getElementById('theme');
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
      theme.setAttribute('href', '../node_modules/highlight.js/styles/github.css');
    }


    return {
      wikiId,
      wikiData,
      switchTheme
    }
  }
}
</script>
    
<style lang="scss" scoped>
.content {
  flex: 1;
  background-color: var(--wiki-content-background-color);
  padding: 0 .1rem 0 .1rem;
}
</style>
    