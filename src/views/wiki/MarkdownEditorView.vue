<template>
    <div class="wrapper">
      <div class="main">
        <div class="images">
          <div class="image_item">
            <a href="http://imgs.pengliu.me:8080/123123123.png" target="_blank">
              <img src="http://imgs.pengliu.me:8080/123123123.png" alt="alt 属性文本" title="可选标题" width="50%">
            </a>
          </div>
          <div class="image_item">
            <a href="http://imgs.pengliu.me:8080/123123123.png" target="_blank">
              <img src="http://imgs.pengliu.me:8080/123123123.png" alt="alt 属性文本" title="可选标题" width="50%">
            </a>
          </div>
          <div class="image_item">
            <a href="http://imgs.pengliu.me:8080/123123123.png" target="_blank">
              <img src="http://imgs.pengliu.me:8080/123123123.png" alt="alt 属性文本" title="可选标题" width="50%">
            </a>
          </div>
          <div class="image_item">
            <a href="http://imgs.pengliu.me:8080/123123123.png" target="_blank">
              <img src="http://imgs.pengliu.me:8080/123123123.png" alt="alt 属性文本" title="可选标题" width="50%">
            </a>
          </div>
          <div class="image_item">
            <a href="http://imgs.pengliu.me:8080/123123123.png" target="_blank">
              <img src="http://imgs.pengliu.me:8080/123123123.png" alt="alt 属性文本" title="可选标题" width="50%">
            </a>
          </div>
        </div>
        <div id="content" class="content">
          <h1>Markdown编辑器</h1>
          <textarea class="mk-editor" v-model="markdown"></textarea>

          <h1>预览</h1>
          <div class="mk-preview" v-html="markdownToHtml"></div>

          <div><input type="button" value="输出" @click="outputMarkdown"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { computed, ref } from 'vue';
  import { marked } from 'marked';
  
  export default {
    name: 'MarkdownEditorView',
  
    setup () {
      // markdown解析
      const markdown = ref("");
      const markdownToHtml = computed(() => marked(markdown.value) );
      const outputMarkdown = () => {
        // const imagePath = require('@/assets/images/123.png');
        markdown.value = `![image info](${imagePath})`;
      }
  
      return {
        markdown,
        markdownToHtml,
        outputMarkdown
      }
    }
  }
  </script>

<style scoped>
.main {
  display: flex;
  /* max-width: 1760px; */
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: .2rem;
  padding-bottom: .5rem;
}

.images {
  /* height: 10rem; */
  height: 90vh;
  overflow-y: scroll;
}

.mk-editor {
  width: 15rem;
  height: 5rem;
  padding: .1rem;
  overflow-x: scroll;
  overflow-y: scroll;
  resize: vertical;
}

.mk-preview {
  width: 15rem;
  height: 5rem;
  padding: .1rem;
  margin: .1rem 0 .1rem 0;
  overflow-x: scroll;
  overflow-y: scroll;
  resize: vertical;

}
</style>
  