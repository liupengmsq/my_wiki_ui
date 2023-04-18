<template>
  <div id="content" class="content">
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
    });

    return {
      wikiId,
      wikiData
    }
  }
}
</script>
    
<style lang="scss" scoped>
.content {
  flex: 1;
  background-color: var(--wiki-content-background-color);
  padding: .1rem .1rem .1rem .1rem;
  border-radius: 0 5px 5px 0;
}
</style>
    