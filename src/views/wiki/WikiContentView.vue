<template>
  <div id="content" class="content">
    <div class="title">{{ wikiData.title }}</div>
    <div class="info">Last updated: {{ wikiData.updatedTime }} / Reads: {{ wikiData.pageView }}</div>
    <hr>
    <p v-html="wikiData.markdownContent"></p>
  </div>

  <GoToTopButton />
</template>
    
<script>
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';
import { get } from '../../utils/request';
import { marked } from 'marked';
import hljs from 'highlight.js';
import GoToTopButton from '../../components/GoToTopButton.vue';

export default {
  name: 'WikiContentView',
  components: {
    GoToTopButton
  },
  setup() {
    const route = useRoute();

    // 当前wiki page的在数据库中的主键id
    const wikiId = route.params.id;
    const wikiData = reactive({
      title: '',
      markdownContent: '',
      updatedTime: '',
      pageView: 0
    });

    onMounted(() => {

      console.log('route.params.id', route.params.id);
      marked.options({
        highlight: (code, lang) => {
          if (hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
          } else {
            return hljs.highlightAuto(code).value;
          }
        } 
      })

      // 从后端API获取当前wiki的内容
      get(`/wiki/${route.params.id}?updateAccessInfo=true`).then(response => {
        console.log(`Response from "/wiki/${route.params.id}"`, response);
        wikiData.markdownContent = marked(response.Result.markdownContent);
        wikiData.title = response.Result.title;
        wikiData.updatedTime = new Date(response.Result.updatedDateTime).toLocaleString("en-US", {
          localeMatcher: "best fit",
        });
        wikiData.pageView = response.Result.pageViewedNumber;
      }).catch(error => {
        console.error(`Error from "/wiki/${route.params.id}"`, error);
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
  background-color: var(--wiki-content-background-color);
  padding: .1rem .1rem .1rem .1rem;
  border-radius: 0 .05rem .05rem 0;
  overflow: hidden; // 处理图片image撑大父div的情况
  width: 14.23rem;
}

.title {
  font-size: .18rem;
  margin: 0 0 .15rem 0;
}
</style>
    