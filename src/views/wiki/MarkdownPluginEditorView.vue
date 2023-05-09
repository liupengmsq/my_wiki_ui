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
      <h1 v-if="isVisibleTitle" @click="showInputTitleTextbox" class="mk-editor-title">{{ wikiTitle }}</h1>
      <input class="mk-editor-title-input" 
        v-if="isVisibleInputTitleTextbox" 
        ref="titleTextbox" 
        tabindex="1" 
        v-model="wikiTitle" 
        @focus="$event.target.select()"  
        @keyup.enter="showWikiTitle" 
        type="text" 
        placeholder="输入标题" 
        name="title" 
        required
      >
      <div class="wiki-category">
        <label>选择Wiki分类：</label>
        <select v-model="selectedWikiCategoryItem">
          <option v-for="categoryName in wikiCategoryList.list" :key="categoryName" :value="categoryName">
            {{categoryName}}
          </option>
        </select>
        <span class="mk-editor-info">{{ info }}</span>
      </div>
      <v-md-editor ref="editor" class="md-editor" v-model="markdown" mode="editor" @save="saveWiki"
        :toolbar="toolbar" 
        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table | link image code | save restore"
      ></v-md-editor>
    </div>
  </div>
  <confirm-dialog ref="confirmDialog"></confirm-dialog>
  <message-dialog ref="messageDialog"></message-dialog>
</template>
  
<script>
import { ref, onMounted, reactive, onBeforeUnmount, nextTick } from 'vue';
import { get, deleteAPI, postForm, post } from '../../utils/request';
import router from "../../router/index.js"; 
import ConfirmDialog from '../../components/ConfirmDialog.vue'
import MessageDialog from '../../components/MessageDialog.vue'
import { resizable } from '../../utils/resizer';

export default {
  name: 'MarkdownEditorView',
  components: {
    ConfirmDialog,
    MessageDialog,
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

    const titleTextbox = ref(null);

    // 显示信息
    const info = ref("");

    // 关于wiki分类
    const wikiCategoryList = reactive({
      list: []
    });
    const selectedWikiCategoryItem = ref(null);
    // 调用后端API获取wiki category信息
    const getWikiCategories = async () => {
      try {
        const response = await get('/api/wiki/category');
        if (response.Success) {
          selectedWikiCategoryItem.value = response.Result[0].categoryName
          for (const c of response.Result) {
            wikiCategoryList.list.push(c.categoryName);
          }
        } else {
          console.error('Error when GET for /api/wiki/category', response);
        }
      } catch (error) {
        console.error('Error when GET for /api/wiki/category', error);
      }
    }

    onMounted(() => {
      // 使所有的分割div可拖动
      document.querySelectorAll('.resizer').forEach(function (ele) {
        resizable(ele);
      });

      // 页面初次展示的时候，显示图片列表信息
      getImageList();

      // 开启定时任务功能：每分钟将markdown内容保存到localStorage中
      pollData();

      // 调用后端API获取wiki category信息
      getWikiCategories();
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

    // wiki标题相关
    const wikiTitle = ref('点击编辑标题');
    const isVisibleTitle = ref(true);
    
    // 显示标题，隐藏标题的textbox
    const showWikiTitle = () => {
      isVisibleTitle.value = true;
      isVisibleInputTitleTextbox.value = false;
    }
    const isVisibleInputTitleTextbox = ref(false);

    // 隐藏标题，显示标题的textbox
    const showInputTitleTextbox = async () => {
      isVisibleTitle.value = false;
      isVisibleInputTitleTextbox.value = true;

      console.log('Before updating dom.');
      await nextTick();
      console.log('After updating dom.');

      // 将焦点放在textobx上
      titleTextbox.value.focus();
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
          + ((currentdate.getHours() < 10) ? "0" : "") + currentdate.getHours() + ":"  
          + ((currentdate.getMinutes() < 10) ? "0" : "") + currentdate.getMinutes() + ":"  
          + ((currentdate.getSeconds() < 10) ? "0" : "") + currentdate.getSeconds(); 
        info.value = '上次保存时间：' + datetime;
        localStorage.markdown = markdown.value;
      }
      if (wikiTitle) {
        console.log('Saving wiki title to local storage...');
        console.log(wikiTitle.value);
        localStorage.wikiTitle = wikiTitle.value;
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
              wikiTitle.value = localStorage.wikiTitle;
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

    // 保存wiki到后端
    const messageDialog = ref(null);
    const saveWiki = async () => {
      console.log('Saving wiki...');
      const postData = {
        title: wikiTitle.value,
        markdownContent: markdown.value,
        categoryName: selectedWikiCategoryItem.value
      };

      if (postData.title === "" || postData.title === "点击编辑标题") {
        await messageDialog.value.show({
          title: '标题为空',
          message: '标题为空，请输入标题！！',
          success: false,
        })
        return;
      }

      if (postData.markdownContent === "") {
        await messageDialog.value.show({
          title: 'Wiki内容为空',
          message: 'Wiki内容为空，请输入内容！！',
          success: false,
        })
        return;
      }

      if (postData.categoryName === "") {
        await messageDialog.value.show({
          title: 'Wiki分类为空',
          message: 'Wiki分类为空，请选择一种分类！！',
          success: false,
        })
        return;
      }

      try {
        const response = await post('/api/wiki', postData);
        // 创建成功
        if (response.Success) {
          await messageDialog.value.show({
            title: '创建成功',
            message: 'Wiki ID: ' + response.Result.id,
            success: true,
          })

          // 返回首页
          router.push({name: 'home'});
        } else {
          // 创建失败
          await messageDialog.value.show({
            title: '创建失败',
            message: error,
            success: false,
          })
        }
      } catch (error) {
        // 创建失败
        await messageDialog.value.show({
          title: '创建失败',
          message: error,
          success: false,
        })
      }
    }

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
      confirmDialog,
      wikiTitle,
      isVisibleTitle,
      showWikiTitle,
      isVisibleInputTitleTextbox,
      showInputTitleTextbox,
      titleTextbox,
      wikiCategoryList,
      selectedWikiCategoryItem,
      saveWiki,
      messageDialog
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

.mk-editor-title-input {
  width: 93%;
  margin: .067rem ;
  padding: .12rem;
  border: 1px solid #ccc;
  border-radius: 3px;
  font-size: .3rem;
  font-weight: 500;
}

.wiki-category {
  margin-left: .1rem;
}

.image_item {
  text-align: left;
  margin-bottom: .1rem;
  padding: .1rem;
  border: .01rem solid #aaaaaa;
  user-select: none;
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
  