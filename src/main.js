import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'normalize.css' // 添加normalize css的功能
import './style/index.scss' // 导入统一的css文件

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import createHljsTheme from '@kangc/v-md-editor/lib/theme/hljs';

// highlightjs
import hljs from 'highlight.js';
const hljsTheme = createHljsTheme({
    Hljs: hljs,
  });

VMdEditor.vMdParser.theme(hljsTheme);

createApp(App).directive('focus', { //加入v-focus指令
    mounted(el) {
        el.focus(); 
    }
}).use(store).use(router).use(VMdEditor).mount('#app');
