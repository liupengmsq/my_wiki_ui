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

export default {
  name: 'WikiMainView',
  components: {
    NavTreeView,
    WikiContentView
  },
  setup() {
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
  max-width: 12rem;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: .2rem;
  padding-bottom: .5rem;
}
</style>
  