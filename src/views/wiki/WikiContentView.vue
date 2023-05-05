<template>
  <div id="content" class="content">
    <div class="title">{{ wikiData.title }}</div>
    <div class="info">Last updated: {{ wikiData.updatedTime }} / Reads: {{ wikiData.pageView }}</div>
    <hr>
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
      title: '',
      markdownContent: '',
      updatedTime: '',
      pageView: 0
    });

    onMounted(() => {
      console.log('route.query.id', route.query.id);
      marked.options({
        highlight: (code, lang) => hljs.highlight(code, { language: lang }).value,
      })

      // 从后端API获取当前wiki的内容
      get(`/api/wiki/${route.query.id}?updateAccessInfo=true`).then(response => {
        console.log(`Response from "/wiki/${route.query.id}"`, response);
        wikiData.markdownContent = marked(response.Result.markdownContent);
        wikiData.title = response.Result.title;
        wikiData.updatedTime = new Date(response.Result.updatedDateTime).toLocaleString("en-US", {
          localeMatcher: "best fit",
        });
        wikiData.pageView = response.Result.pageViewedNumber;
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
  overflow: hidden; // 处理图片image撑大父div的情况
}

.title {
  font-size: .18rem;
  margin: 0 0 .15rem 0;
}

</style>
    