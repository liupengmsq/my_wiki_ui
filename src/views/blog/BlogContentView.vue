<template>
  <div class="wrapper">
    <div class="main theme-a">
      <div>
        <div class="nav_container">
          <div class="nav">
            <blog-top-view title="最新文章" typeOfTop="created" />
          </div>
        </div>
        <div class="nav_container">
          <div class="nav">
            <blog-top-view title="全站最热" typeOfTop="read" />
          </div>
        </div>
      </div>

      <div class="content-container">
        <div class="content-wrapper">
          <div class="title">{{ wikiData.title }}</div>
          <div class="info">Last updated: {{ wikiData.updatedTime }} / Reads: {{ wikiData.pageView }}</div>
          <hr>
          <div id="content" class="content">
            <p v-html="wikiData.markdownContent"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <GoToTopButton />
</template>
    
<script>
import { ref, reactive, onMounted } from 'vue';
import { get } from '../../utils/request';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import hljs from 'highlight.js';
import BlogTopView from './BlogTopView.vue';
import GoToTopButton from '../../components/GoToTopButton.vue';

export default {
  name: 'BlogContentView',
  components: {
    BlogTopView,
    GoToTopButton
  },
  setup() {
    const route = useRoute();

    const wikiId = route.params.id;
    const wikiData = reactive({
      title: '',
      markdownContent: '',
      updatedTime: '',
      pageView: 0
    });

    onMounted(() => {
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
.wrapper {
  // 背景图片
  background-color: #2d76c8;
  background-image: url('../../assets/shadow_light.png'), url('../../assets/pixels.png');
  background-position: 0 0, 0 0;
  background-repeat: repeat;
}

.main {
  display: flex;
  max-width: 12rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: .2rem;
  padding-bottom: .5rem;
}

.title {
  font-size: .35rem;
  // margin: 0 0 .15rem 0;
  // margin: auto;
}

.info {
  margin-top: .15rem;
}

.nav_container {
  width: 3rem;
  min-width: 2rem;
  background-color: var(--nav-container-background-color);
  // border-right: .01rem solid #dddddd;
  border-radius: .1rem .1rem .1rem .1rem;
  padding-top: .1rem;
  padding-bottom: .1rem;
  overflow-x: auto;
  margin-bottom: .4rem;
}

.nav {
  font-size: .16rem;
  line-height: .26rem;
  padding: 0 .2rem 0 .2rem;
  box-sizing: border-box;
  user-select: none;
}

.content-container {
  width: 8.87rem;
}

.content-wrapper {
  background-color: var(--wiki-content-background-color);
  padding: .2rem .6rem .2rem .6rem;
  border-radius: .1rem .1rem .1rem .1rem;
  margin-bottom: .2rem;
  margin-left: .5rem;
}

.content {
  background-color: var(--wiki-content-background-color);
  overflow: hidden; // 处理图片image撑大父div的情况
}

.content a > img {
    width: 100%;
}

</style>
    