<template>
  <div class="wrapper">
    <div class="main theme-a">
      <div class="nav_container">
        <div class="nav">
          <div>
          左侧边栏内容
          </div>
          <div>
          左侧边栏内容
          </div>
        </div>
      </div>

      <div class="content-container">
        <div class="content-wrapper" v-for="item in wikiList.list" :key="item.id">
          <div class="title">{{ item.title }}</div>
          <div class="info">Last updated: {{ item.updatedTime }} / Reads: {{ item.pageView }}</div>
          <hr>
          <div class="content close" ref="explainText">
            <p v-html="item.markdownContent"></p>
          </div>

          <div class="show-all" @click="goToWikiPage(item)">
            <span>阅读全文</span>
          </div>
        </div>
        <div class="page">
          <input v-if="hastPreviousPage" type="button" @click="decreasePageNumber" value="上一页">
          <input v-if="hasNextPage" type="button" @click="increasePageNumber" value="下一页">
        </div>

      </div>
    </div>
  </div>
</template>
    
<script>
import { ref, reactive, onMounted } from 'vue';
import { get } from '../../utils/request';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { useRouter } from 'vue-router';

export default {
  name: 'BlogMainView',
  setup() {
    const currentPageNum = ref(0);
    const pageSize = 5;
    const router = useRouter();
    const hastPreviousPage = ref(false)
    const hasNextPage = ref(false)

    onMounted(() => {
      marked.options({
        highlight: (code, lang) => hljs.highlight(code, { language: lang }).value,
      })
      getWikiList();
      setAllImagesWidth();
    });

    const setAllImagesWidth = () => {
      for (var i= document.images.length; i-->0;) {
        document.images[i].style.width = '30%';
      }
    }

    const increasePageNumber = () => {
      currentPageNum.value = currentPageNum.value + 1;
      getWikiList();
    }

    const decreasePageNumber = () => {
      currentPageNum.value = currentPageNum.value - 1;
      getWikiList();
    }

    const wikiList = reactive({
      list: []
    });

    const getWikiList = async () => {
      const response = await get('/api/wiki/pageable', {pageIndex: currentPageNum.value, size: pageSize});
      console.log(response);
      if (response.Success) {
        hasNextPage.value = !response.Result.last;
        hastPreviousPage.value = !response.Result.first;
        for (const item of response.Result.content) {
          item.updatedTime = new Date(item.updatedDateTime).toLocaleString("en-US", {
            localeMatcher: "best fit",
          });
          item.pageView = item.pageViewedNumber;
          item.target = `/wiki/${item.categoryId}/${item.id}`;
          item.markdownContent = resizeImages(marked(item.markdownContent));
        }
        wikiList.list = response.Result.content;
        console.log("wikiList.list is updated", wikiList.list);
      } 
    }

    const resizeImages = (htmlString) => {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();
      for (var i of div.getElementsByTagName('img')) {
        i.style.width = '20%';
      }
      return div.innerHTML;
    }

    const goToWikiPage = (item) => {
      sessionStorage.routerSelected = item.categoryId;
      const routeData = router.resolve({path: item.target, query: {hardSelect: true} });
      window.open(routeData.href, '_blank');
    }

    return {
      wikiList,
      increasePageNumber,
      decreasePageNumber,
      goToWikiPage,
      hasNextPage,
      hastPreviousPage
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
  max-width: 17.6rem;
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
  width: 4rem;
  min-width: 2rem;
  background-color: var(--nav-container-background-color);
  // border-right: .01rem solid #dddddd;
  border-radius: .1rem .1rem .1rem .1rem;
  padding-top: .1rem;
  padding-bottom: .1rem;
  overflow-x: auto;
}

.nav {
  font-size: .16rem;
  line-height: .26rem;
  padding: 0 .2rem 0 .2rem;
  box-sizing: border-box;
  user-select: none;
}

.content-container {
  width: 14.23rem;
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

.wiki-img {
  width: 10%;
}

.close {
  text-overflow: -o-ellipsis-lastline;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 20;
  line-clamp: 20;
  -webkit-box-orient: vertical;
}

.show-all {
  background-color: var(--theme-dropdown-hover-background-color);
  color: var(--button-color);
  padding: .05rem;
  font-size: .15rem;
  font-weight: 500;
  border: none;
  border-radius: 0.1rem;
  height: .26rem;
  text-align: center;
  user-select: none;
  width: .8rem;
  margin-top: 0.2rem;
  cursor: pointer;
}

.show-all:hover {
  background-color: var(--table-row-hover-background-color);
  color: var(--button-color-hover);
}

.page {
  text-align: center;
}
</style>
    