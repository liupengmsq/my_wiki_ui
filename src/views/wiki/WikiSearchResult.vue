<template>
    <div class="wrapper">
      <div class="main theme-a">
        <div class="search-wrapper">
        <div class="search-input-wrapper">
          <i class="icon-search"></i>
          <input class="search-input" v-focus tabindex="1" v-model="searchText" type="text" placeholder="输入搜索内容" @keydown.enter="search" required>
          <input type="button" value="search" @click="search">
        </div>
          <div class="search-item" v-for="item in wikiSearchResultList.list" :key="item.id">
            <div class="search-title" v-html="highlightSearchResult(item.search, item.title, true)"></div>
            <div class="search-content" v-html="highlightSearchResult(item.search, item.markdownContentPureText)"></div>
          </div>
        </div>
      </div>
    </div>
  </template>
    
  <script>
import { reactive, toRefs, ref } from 'vue';
import { get, deleteAPI, post, put } from '../../utils/request';
import { marked } from 'marked';

  export default {
    name: 'WikiSearchResult',
    setup() {
      const searchText = ref("");
      const wikiSearchResultList = reactive({
        list: []
      });

      const search = async () => {
        wikiSearchResultList.list = [];
        if (!searchText.value) {
          return;
        }
        const response = await get('/api/wiki/search', {searchText: searchText.value});
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
        search,
        wikiSearchResultList,
        highlightSearchResult
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
    max-width: 17.6rem;
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
    height: .2rem;
    max-width: 100%;
    padding: 4px 6px;
    border: 1px solid #ddd;
    background: #fff;
    color: #444;
    border-radius: 4px;
  }

  .search-item {
    margin-bottom: .4rem;
  }

  .search-title {
    font-weight: 500;
  }

  .search-content {

  }

  </style>
    