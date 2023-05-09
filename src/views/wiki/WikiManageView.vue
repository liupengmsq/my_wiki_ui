<template>
  <div class="container">
    <div class="container__left">
      <nav-tree-view :showManageButtons=true />
    </div>
    <div class="resizer" data-direction="horizontal"></div>
    <div class="container__right">
      <div class="wrapper">
        <router-link to="/markdownEditorPlugin">Markdown编辑器</router-link>
        <h1>Wiki Category</h1>
        <input class="add-category" type="button" value="新增" @click="addCategory">
        <table>
          <th>Id</th>
          <th>名字</th>
          <th>是否为默认分类</th>
          <th class="th-operation">管理</th>
          <tr v-for="item in categoryList.list" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.categoryName }}</td>
            <td>{{ item.default }}</td>
            <td>
              <input class="operation" type="button" @click="editCategory(item.id)" value="编辑">
              <input class="operation" type="button" @click="deleteCategory(item.id)" value="删除">
              <input class="operation" type="button" @click="setToDefaultCategory(item.id)" value="设置为默认">
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import NavTreeView from '../nav/NavTreeView.vue';
import { useStore } from 'vuex';
import { resizable } from '../../utils/resizer.js'
import { get, deleteAPI, post } from '../../utils/request';

export default {
  name: 'WikiManageView',
  components: {
    NavTreeView
  },

  setup() {
    const store = useStore();
    const categoryList = reactive({
      list: []
    });

    const getWikiCategory = async () => {
      const response = await get('/api/wiki/category');
      if (response.Success) {
        categoryList.list = response.Result;
      }
    }

    const addCategory = () => {
      categoryList.list.push(
        {
          id: 3,
          category: 'test category 3',
        }
      );
    }

    const editCategory = (categoryId) => {
      store.dispatch('setCurrentCategoryId', { categoryId: categoryId});
    }

    const deleteCategory = (categoryId) => {
      alert(categoryId);
    }

    onMounted(async () => {
      // 使所有的分割div可拖动
      document.querySelectorAll('.resizer').forEach(function (ele) {
        resizable(ele);
      });

      getWikiCategory();
    });

    return {
      NavTreeView,
      categoryList,
      addCategory,
      editCategory,
      deleteCategory
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

.wrapper {
  overflow-x: auto;
}

.add-category {
  margin: 5px 0;
}

table {
  border-collapse: collapse;
  border: 1px solid #ccc;
  width: 100%;
}

th,
td {
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: skyblue;
}


.th-operation {
  width: 10%;
}

.operation {
  margin-right: 5px;
}
</style>