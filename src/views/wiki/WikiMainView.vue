<template>
  <div class="wrapper">
    <div class="main theme-a">
      <nav-tree-view :showManageButtons=false />
      <wiki-content-view />
    </div>
  </div>
</template>
  
<script>
import NavTreeView from '../nav/NavTreeView.vue';
import WikiContentView from './WikiContentView.vue';
import * as nav_util from '../../utils/nav';
import { onMounted, reactive } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'WikiMainView',
  components: {
    NavTreeView,
    WikiContentView
  },
  setup() {
    onMounted(async () => {
      const route = useRoute();

      // 当访问的URL里面包含'?self=false'的时候，代表此wiki页面的请求是来自于外界，不是来自于点击wiki页面右侧树的请求，
      // 那么就需要从后端API获取对应的节点ID，并置其为选择状态
      if(route.query.self === 'false') {
        const navNodeId = await nav_util.getNodeIdByCategoryIdAndTarget(route.params.categoryId, route.params.id);
        console.log('navNodeId', navNodeId);
        if (navNodeId) {
          nav_util.selectNavTreeNode(navNodeId, route.params.categoryId);
        }
      }
    });

    return {
      NavTreeView,
      WikiContentView
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
</style>
  