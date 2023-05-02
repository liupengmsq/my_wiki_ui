<template>
  <div class="container">
    <div class="container__left">
      <div>
        <div>选择图片文件：<input id="fileUpload" type="file" name="filename"></div>
        <div>
          <label>修改上传后的文件名：</label><input type="text" v-model="renamedFileName">
          <input type="button" value="上传图片" @click="uploadImage">
          <input type="button" value="刷新列表" @click="getImageList">
        </div>
      </div>
      <div class="image_item" v-for="imgItem in imageData.list" :key="imgItem.id">
        <div>文件名: {{ imgItem.fileName }}</div>
        <div>上传时间: {{ imgItem.uploadLocalTime }}</div>
        <a :href="'http://imgs.pengliu.me:8080/' + imgItem.fileName" target="_blank">
          <img id="drag1" draggable="true" @dragstart="drag" :src="'http://imgs.pengliu.me:8080/' + imgItem.fileName">
        </a>
        <input type="button" value="删除" @click="deleteImage(imgItem.fileName)">
      </div>
    </div>
    <div class="resizer" data-direction="horizontal"></div>
    <div class="container__right" @drop="drop" @dragover="allowDrop">
      <h1 class="mk-editor-title">Markdown编辑器</h1>
      <div><span class="mk-editor-info">{{ info }}</span></div>
      <v-md-editor ref="editor" class="md-editor" v-model="markdown" mode="editor"
        :toolbar="toolbar" 
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table | link image code | save restore"
      ></v-md-editor>
    </div>
  </div>
  <confirm-dialog ref="confirmDialog"></confirm-dialog>
</template>
  
<script>
import { ref, onMounted, reactive, onBeforeUnmount } from 'vue';
import { get, deleteAPI, postForm } from '../../utils/request';
import ConfirmDialog from '../../components/ConfirmDialog.vue'

export default {
  name: 'MarkdownEditorView',
  components: {
    ConfirmDialog,
  },

  setup() {
    // markdown解析
    const markdown = ref("");

    // 引用编辑器组件的对象
    const editor = ref(null);

    const renamedFileName = ref("");
    const imageData = reactive({
      list: []
    });

    const info = ref("");

    onMounted(() => {
      // 实现横向与纵向可拖动的功能
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

      // 使所有的分割div可拖动
      document.querySelectorAll('.resizer').forEach(function (ele) {
        resizable(ele);
      });

      // 页面初次展示的时候，显示图片列表信息
      getImageList();

      // 开启定时任务功能：每分钟将markdown内容保存到localStorage中
      pollData();
    });

    // 左侧图片拖动到编辑区的功能实现
    const allowDrop = (ev) => {
      ev.preventDefault();
    }

    // 左侧图片拖动到编辑区的功能实现
    const drag = (ev) => {
      console.log('dragging...', ev);
      ev.dataTransfer.setData("text", ev.target.id);
      ev.dataTransfer.setData("image_url", ev.target.src);
    }

    // 左侧图片拖动到编辑区的功能实现
    const drop = (ev) => {
      console.log('dropping...', ev);
      ev.preventDefault();
      const imageUrl = ev.dataTransfer.getData("image_url");
      insertEditor(imageUrl);
    }

    // 左侧图片拖动到编辑区的功能实现
    const insertEditor = (imageURL) => {
      editor.value.insert((selected) => {

        const imageTitle = selected || '';
        const content = `
<a href="${imageURL}" target="_blank"/>
  <img src="${imageURL}" title="${imageTitle}">
</a>
`
        return {
          // 要插入的文本
          text: content,
          // 插入后要选中的文本
          selected: content,
        };
      });
    }

    // 从后端api获取图片列表
    const getImageList = async () => {
      try {
        const response = await get('/api/wiki/image');
        console.log('GET /api/wiki/image', response);
        if (response.Success) {
          // 转换api返回的UTC时间为本地浏览器时间
          const imageList = [];
          for (const imageItemInResponse of response.Result) {
            const imageItem = {};
            imageItem.fileName = imageItemInResponse.fileName;
            imageItem.uploadLocalTime = new Date(imageItemInResponse.uploadTime).toLocaleString("en-US", {
              localeMatcher: "best fit",
              timeZoneName: "short"
            });
            imageList.push(imageItem);
          }
          imageList.sort(
            function (a, b) {
              // Turn your strings into dates, and then subtract them
              // to get a value that is either negative, positive, or zero.
              return new Date(b.uploadLocalTime) - new Date(a.uploadLocalTime);
            }
          );
          imageData.list = imageList;
        } else {
          console.error('Error when GET for /api/wiki/image', response);
        }
      } catch (error) {
        console.error('Error when GET for /api/wiki/image', error);
      }
    }

    // 调用后端api删除图片
    const deleteImage = async (fileName) => {
      console.log('Image file name to be deleted:', fileName);
      try {
        const response = await deleteAPI('/api/wiki/image/' + fileName);
        if (response.Success) {
          // refresh image list after deletion
          getImageList();
        } else {
          console.error('Error when Delete for /api/wiki/image', response);
        }
      } catch (error) {
        console.error('Error when Delete for /api/wiki/image', error);
      }
    }

    // 上传图片到后端
    const uploadImage = async () => {
      let fileUploadEle = document.querySelector('#fileUpload').files[0];
      console.log('fileUpload', fileUploadEle);
      console.log('fileUpload.name', fileUploadEle.name);

      // 修改原上传图片的名字
      if (renamedFileName.value !== '') {
        console.log('Renamed image file name', renamedFileName.value);
        fileUploadEle = renameFile(fileUploadEle, renamedFileName.value)
        console.log('After rename', fileUploadEle);
      }
      try {
        const response = await postForm('/api/wiki/image', fileUploadEle);
        if (response.Success) {
          console.log('Response from upload image', response);
        } else {
          console.error('Error when uploading image', error);
        }
      } catch (error) {
        console.error('Error when uploading image', error);
      }
      getImageList();
      document.querySelector('#fileUpload').value = '';
      renamedFileName.value = '';
    }

    // 重命名图片文件对象
    const renameFile = (originalFile, newName) => {
      return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
      });
    }

    // 定时将markdown中的内容保存到localStorage中
    const polling = ref(null);
    const pollData = () => {
      // 每分钟自动保存markdown内容到localStorage中
      polling.value = setInterval(() => {
        saveToLocalStorage();
      }, 1000 * 60);
    }

    onBeforeUnmount(() => {
      clearInterval(polling.value);
    })

    // 保存当前markdown内容到localStorage中
    const saveToLocalStorage = () => {
      if (markdown.value) {
        console.log('Saving markdown content to local storage...');
        console.log(markdown.value);
        var currentdate = new Date();
        var datetime = (currentdate.getMonth()+1)  + "/" 
          + currentdate.getDate() + "/" 
          + currentdate.getFullYear()  + " "  
          + currentdate.getHours() + ":"  
          + currentdate.getMinutes() + ":" 
          + currentdate.getSeconds();
        info.value = '上次保存时间：' + datetime;
        localStorage.markdown = markdown.value;
      }
    }

    // 从localStorage中将markdown内容恢复到编辑区
    const confirmDialog = ref(null);
    const toolbar = reactive({
      restore: {
        title: '从缓存中恢复',
        icon: 'v-md-icon-tip',
        async action(editor) {
          let restoreFromLocalStorage = ''
          const confirmResult = await confirmDialog.value.show({
            // 确认对话框的标题
            title: '确认从缓存恢复Markdown内容？',
            // 确认对话框的消息
            message: ``,
            // 点击确认按钮后执行的方法
            onClickOKButton: async function () {
              restoreFromLocalStorage = localStorage.markdown;
            }
          });
          editor.insert(() => {
            return {
              text: restoreFromLocalStorage,
            };
          });
        },
      }
    });

    return {
      markdown,
      editor,
      allowDrop,
      drag,
      drop,
      imageData,
      getImageList,
      deleteImage,
      uploadImage,
      renamedFileName,
      saveToLocalStorage,
      info,
      toolbar,
      confirmDialog 
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
  width: 20%;

  align-items: center;
  justify-content: center;

  overflow-x: scroll;
  overflow-y: scroll;
}

.container__right {
  /* display: flex; */
  /* Take the remaining width */
  flex: 1;

  /* align-items: stretch; */
  flex-direction: column;
  justify-content: center;
  overflow-x: scroll;
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
.mk-editor-info {
  margin-left: 0.1rem;
}

.image_item {
  text-align: left;
  margin-bottom: .1rem;
  padding: .1rem;
  border: .01rem solid #aaaaaa;
}

.image_item:hover {
  border: .05rem solid red;
}

.image_item img {
  width: 100%;
}

#div1 {
  width: 350px;
  height: 70px;
  padding: 10px;
  border: 1px solid #aaaaaa;
}
</style>
  