<template>
  <div class="wrapper">
    <div class="main theme-a">
      <nav-tree-view :showManageButtons=false :categoryId="categoryId" />
      <wiki-content-view />
    </div>
  </div>
</template>
  
<script>
import NavTreeView from '../nav/NavTreeView.vue';
import WikiContentView from './WikiContentView.vue';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';

export default {
  name: 'WikiMainView',
  components: {
    NavTreeView,
    WikiContentView
  },
  setup() {
    const categoryId = ref(null);
    onMounted(() => {
      const route = useRoute();
      if (route.query.categoryId) {
        categoryId.value = route.query.categoryId;
        localStorage.currentCategoryId = categoryId.value;
      } else {
        categoryId.value = localStorage.currentCategoryId;
      }
    });
    console.log('route.query.categoryId', categoryId.value);
    return {
      categoryId,
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
  max-width: 1760px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-top: .2rem;
  padding-bottom: .5rem;
}
</style>
  