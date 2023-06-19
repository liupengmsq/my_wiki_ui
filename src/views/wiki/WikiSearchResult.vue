<template>
  <div class="wrapper">
    <div class="main theme-a">
      <div class="search-wrapper">
        <div class="search-input-wrapper">
          <i class="icon-search"></i>
          <input class="search-input" v-focus tabindex="1" v-model="searchText" type="text" placeholder="输入搜索内容"
            @keydown.enter="search" required>
          <button class="search-button" type="submit" @click="search">Search</button>
        </div>
        <div v-if="showWarning" class="search-warning">
          <p>没有搜索到任何内容！！</p>
        </div>
        <div class="search-item" v-for="item in wikiSearchResultList.list" :key="item.id">
          <div class="search-title" @click="goToWikiPage(item)" v-html="highlightSearchResult(item.search, item.title, true)"></div>
          <!-- <div v-html="highlightSearchResult(item.search, item.markdownContentPureText)"></div> -->
          <div><span @click="goToWikiPage(item)" class="search-result">{{ item.markdownContent }}</span></div>
        </div>
      </div>
    </div>
  </div>
</template>
    
<script>
import { reactive, toRefs, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { get, deleteAPI, post, put } from '../../utils/request';
import { marked } from 'marked';
import { isBlogCategoryId } from '../../utils/common';

export default {
  name: 'WikiSearchResult',
  setup() {
    const searchText = ref("");
    const showWarning = ref(false);
    const router = useRouter();
    const wikiSearchResultList = reactive({
      list: []
    });

    onMounted(() => {
      // 使用router传来的参数searchText来直接触发搜索
      const route = useRoute();
      if (route.params.searchText) {
        searchText.value = route.params.searchText;
        search();
      }
    });

    const search = async () => {
      showWarning.value = false;
      wikiSearchResultList.list = [];
      if (!searchText.value) {
        return;
      }
      const response = await get('/wiki/search', { searchText: searchText.value });
      console.log(response);
      if (response.Success) {
        for (const item of response.Result) {
          item.target = `/wiki/${item.categoryId}/${item.id}`;
          item.markdownContent = marked(item.markdownContent);
          // 去除markdown语法的字符与图片的html字符后的wiki纯文本内容
          item.markdownContentPureText = getPureTextFromHtmlElement(createElementFromHTML(item.markdownContent));
          item.search = searchText.value;

          // 使用toLowerCase来忽略大小写进行搜索
          // 经过后端search接口返回的结果是包含markdown语法字符与图片的html字符的，这里再使用includes方法搜索去除markdown字符与图片的html字符后的wiki内容与标题是否包含searchText
          if (item.title.toLowerCase().includes(searchText.value.toLowerCase()) || item.markdownContentPureText.toLowerCase().includes(searchText.value.toLowerCase())) {
            wikiSearchResultList.list.push(item)
          }
        }
      }

      if (wikiSearchResultList.list.length == 0) {
        showWarning.value = true;
      }
    }

    const goToWikiPage = async (item) => {
      let routeData = null;
      if(await isBlogCategoryId(item.categoryId)) {
        sessionStorage.routerSelected = 'main';
        routeData = router.resolve({path: `/blog/${item.categoryId}/${item.id}`});
      } else {
        sessionStorage.routerSelected = item.categoryId;
        routeData = router.resolve({path: item.target, query: {hardSelect: true} });
      }
      window.open(routeData.href, '_blank');
    }

    const createElementFromHTML = (htmlString) => {
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();
      return div;
    }

    const getPureTextFromHtmlElement = (htmlElement) => {
      var text = htmlElement.innerText || htmlElement.textContent;
      console.log('text', text);
      return text.replace(/(\r\n|\n|\r)/gm, "");
    }

    const highlightSearchResult = (searchText, pureText, forTitle = false) => {
      return pureText.replace(new RegExp(searchText, "gi"), match => {
        const highlightClass = forTitle ? 'highlightTextSearchTitle' : 'highlightTextSearchContent';
        return '<span class="' + highlightClass + '">' + match + '</span>';
      });
    }

    return {
      searchText,
      showWarning,
      search,
      wikiSearchResultList,
      highlightSearchResult,
      goToWikiPage
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
  max-width: 12rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: .2rem;
  padding-bottom: .5rem;
}

.search-wrapper {
  background-color: var(--wiki-content-background-color);
  padding: .1rem;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: .1rem;
}

.search-input {
  width: 80%;
  margin-right: .1rem;
  padding-left: .3rem !important;
  height: .18rem;
  max-width: 100%;
  padding: 4px 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: .15rem;
  background-color: var(--input-background-color);
  color: var(--input-color);
}

.search-button {
  background-color: #00a8e6;
  color: #fff;
  font-size: .15rem;
  text-decoration: none;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, .06);
  border-radius: 4px;
  vertical-align: middle;
  text-decoration: none;
  text-align: center;
  padding: .05rem .15rem;
}

.search-button:hover {
  background-color: #35b3ee;
  color: #fff;
}

.search-button:active {
  background-color: #0091ca;
  color: #fff;
}

.search-warning {
  background: #fffceb;
  color: #e28327;
  border-color: rgba(226, 131, 39, .3);
  margin-bottom: .15rem;
  padding: .05rem;
  border: .01rem solid rgba(45, 112, 145, .3);
  border-radius: .04rem;
  text-shadow: 0 .01rem 0 #fff;
}

.search-item {
  margin-bottom: .4rem;
}

.search-title {
  font-weight: 500;
  cursor: pointer;
}

.search-result {
  cursor: pointer;
  text-overflow: -o-ellipsis-lastline;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 10;
  line-clamp: 10;
  -webkit-box-orient: vertical;
}
</style>
    