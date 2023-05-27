<template>
  <div class="top-list-wrapper">
    <h4 class="title">{{ title }}</h4>
    <ul class="wiki-top-list">
      <template v-for="(item, index) in wikiList.list" :key="item.id">
        <li><a href="#" @click="goToWikiPage(item)">{{ item.title }}</a> </li>
        <hr v-if="index != wikiList.list.length - 1">
      </template>
    </ul>
  </div>
</template>
      
<script>
import { ref, reactive, onMounted } from 'vue';
import { get } from '../../utils/request';
import { useRouter } from 'vue-router';

export default {
  name: 'BlogLatestCreatedView',
  props: ['title', 'typeOfTop'],
  setup(props) {
    const router = useRouter();
    const title = ref('');

    onMounted(() => {
      title.value = props.title;
      getWikiList();
    });

    const wikiList = reactive({
      list: []
    });

    const getWikiList = async () => {
      const response = await get('/api/wiki/top/' + props.typeOfTop);
      console.log(response);
      if (response.Success) {
        for (const item of response.Result) {
          item.target = `/wiki/${item.categoryId}/${item.id}`;
        }
        wikiList.list = response.Result;
      }
    }

    const goToWikiPage = (item) => {
      sessionStorage.routerSelected = item.categoryId;
      const routeData = router.resolve({ path: item.target, query: { hardSelect: true } });
      window.open(routeData.href, '_blank');
    }

    return {
      title,
      wikiList,
      goToWikiPage,
    }
  }
}
</script>
      
<style lang="scss" scoped>

.top-list-wrapper {
  margin-bottom: .25rem;
}
.title::after {
    content: "";
    background-color: var(--nav-selected-background-color);
    position: absolute;
    width: 1rem;
    display: block;
    height: 4px;
    margin-top: .05rem;
}
.wiki-top-list {
  padding: 0 .1rem;
}

a:hover {
  color: var(--nav-selected-background-color);
}
</style>
      