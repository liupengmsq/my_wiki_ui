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
          <th>Name</th>
          <th class="th-operation">Manage</th>
          <tr v-for="item in categoryList.list" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.category }}</td>
            <td>
              <input class="operation" type="button" @click="editCategory(item.id)" value="编辑">
              <input class="operation" type="button" @click="deleteCategory(item.id)" value="删除">
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

export default {
  name: 'WikiManageView',
  components: {
    NavTreeView
  },

  setup() {
    const categoryList = reactive({
      list: []
    });

    const getWikiCategory = () => {
      const temp = [];
      temp.push({
        id: 1,
        category: 'test category 1',
      });
      temp.push({
        id: 2,
        category: 'test category 2',
      });

      return temp;
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
      alert(categoryId);
    }

    const deleteCategory = (categoryId) => {
      alert(categoryId);
    }

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

      categoryList.list = getWikiCategory();
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