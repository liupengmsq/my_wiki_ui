<template>
  <div class="container">
    <div class="container__left">
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
    <div class="resizer" data-direction="horizontal"></div>
    <div class="container__right">
      <div class="container__top">
        <h1 class="mk-editor-title">Markdown编辑器</h1>
        <textarea class="mk-editor" v-model="markdown"></textarea>
      </div>
      <div class="resizer" data-direction="vertical"></div>
      <div class="container__bottom">
        <h1 class="mk-preview-title">预览</h1>
        <div class="mk-preview" v-html="markdownToHtml"></div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { computed, ref, onMounted } from 'vue';
import { marked } from 'marked';

export default {
  name: 'MarkdownEditorView',

  setup() {
    // markdown解析
    const markdown = ref("");
    const markdownToHtml = computed(() => marked(markdown.value));

    onMounted(() => {
      const resizable = (resizer) => {
        console.log("current resizer:", resizer);
        const direction = resizer.getAttribute('data-direction') || 'horizontal';
        const prevSibling = resizer.previousElementSibling;
        const nextSibling = resizer.nextElementSibling;

        // The current position of mouse
        let x = 0;
        let y = 0;
        let prevSiblingHeight = 0;
        let prevSiblingWidth = 0;

        // Handle the mousedown event
        // that's triggered when user drags the resizer
        const mouseDownHandler = (e) => {
          console.log('mouse down!!');
          // Get the current mouse position
          x = e.clientX;
          y = e.clientY;
          const rect = prevSibling.getBoundingClientRect();
          prevSiblingHeight = rect.height;
          prevSiblingWidth = rect.width;

          console.log('x =', x);
          console.log('y =', y);
          console.log('prevSiblingHeigh =', prevSiblingHeight);
          console.log('prevSiblingWidth =', prevSiblingWidth);

          // Attach the listeners to `document`
          document.addEventListener('mousemove', mouseMoveHandler);
          document.addEventListener('mouseup', mouseUpHandler);
        };

        const mouseMoveHandler = (e) => {
          // How far the mouse has been moved
          const dx = e.clientX - x;
          const dy = e.clientY - y;

          switch (direction) {
            case 'vertical':
              // Calculate new height percentage when mouse is moving
              console.log('Calculating new height percentage...');
              console.log('prevSiblingHeight + dy =', prevSiblingHeight + dy);
              console.log('resizer.parentNode.getBoundingClientRect().height', resizer.parentNode.getBoundingClientRect().height);
              const h =
                ((prevSiblingHeight + dy) * 100) /
                resizer.parentNode.getBoundingClientRect().height;

              console.log('new height percentage:', `${h}%`)
              prevSibling.style.height = `${h}%`;
              break;
            case 'horizontal':
            default:
              // Calculate new width percentage when mouse is moving
              console.log('Calculating new width percentage...');
              console.log('prevSiblingWidth + dx =', prevSiblingWidth + dx);
              console.log('resizer.parentNode.getBoundingClientRect().width', resizer.parentNode.getBoundingClientRect().width);
              const w =
                ((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;

              console.log('new width percentage:', `${w}%`);
              prevSibling.style.width = `${w}%`;
              break;
          }

          // set mouse curor style
          const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
          resizer.style.cursor = cursor;
          document.body.style.cursor = cursor;

          // prevent the mouse events and text selection in both sides by 
          // setting the values for user-select and pointer-events
          prevSibling.style.userSelect = 'none';
          prevSibling.style.pointerEvents = 'none';

          nextSibling.style.userSelect = 'none';
          nextSibling.style.pointerEvents = 'none';
        };

        const mouseUpHandler = () => {
          console.log('mouse up!!');

          // Remove sytle which is for mouse moving
          resizer.style.removeProperty('cursor');
          document.body.style.removeProperty('cursor');

          prevSibling.style.removeProperty('user-select');
          prevSibling.style.removeProperty('pointer-events');

          nextSibling.style.removeProperty('user-select');
          nextSibling.style.removeProperty('pointer-events');

          // Remove the handlers of `mousemove` and `mouseup`
          document.removeEventListener('mousemove', mouseMoveHandler);
          document.removeEventListener('mouseup', mouseUpHandler);
        };

        // Attach the handler
        resizer.addEventListener('mousedown', mouseDownHandler);
      };

      // Query all resizers
      document.querySelectorAll('.resizer').forEach(function (ele) {
        resizable(ele);
      });
    });

    return {
      markdown,
      markdownToHtml,
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  /* width: 100%; */
  border: 1px solid #cbd5e0;
  height: 95vh;
}

.container__left {
  /* display: flex; */

  /* Initially, the left takes 1/4 width */
  width: 25%;

  align-items: center;
  justify-content: center;

  overflow-x: scroll;
  overflow-y: scroll;
}

.container__right {
  display: flex;
  /* Take the remaining width */
  flex: 1;

  align-items: stretch;
  flex-direction: column;
  justify-content: center;
  overflow-x: scroll;
}

.container__top {
  /* display: flex; */

  /* Initial height */
  /* height: 12rem; */

  align-items: center;
  justify-content: center;
  overflow-y: scroll;
}

.container__bottom {
  /* display: flex; */

  /* Take the remaining height */
  flex: 1;

  align-items: center;
  justify-content: center;
  overflow-y: scroll;
}

.resizer[data-direction='horizontal'] {
  background-color: #cbd5e0;
  cursor: ew-resize;
  height: 100%;
  width: 2px;
}

.resizer[data-direction='vertical'] {
  background-color: #cbd5e0;
  cursor: ns-resize;
  height: 2px;
  width: 100%;
}

.mk-editor-title {
  margin-left: 0.1rem;
  margin-right: auto;
}
.mk-editor {
  width: 12.54rem;
  height: 4.62rem;
  overflow-x: scroll;
  overflow-y: scroll;
  resize: both;
  margin-left: 0.1rem;
  margin-right: auto;
  padding: .2rem;
  line-height: 1.5;
  border-radius: .05rem;
  box-shadow: .01rem .01rem .01rem #999;
}

.mk-preview-title {
  margin-left: 0.1rem;
  margin-right: auto;
}

.mk-preview {
  width: 12.54rem;
  height: 4.62rem;
  overflow-x: scroll;
  overflow-y: scroll;
  resize: both;
  margin-left: 0.1rem;
  margin-right: auto;
  border: 1px solid #cbd5e0;
  padding: .2rem;
  border-radius: .05rem;
  box-shadow: .01rem .01rem .01rem #999;
}
</style>
  