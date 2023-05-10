<template>
  <base-dialog ref="baseDialog">
    <template v-if="success">
      <div class="iconfont content__icon--success">&#xe663;</div>
    </template>
    <template v-else>
      <div class="iconfont content__icon--fail">&#xe63f;</div>
    </template>
    <div class="content__title">{{ title }}</div>
    <p class="content__desc">{{ message }}</p>
    <div class="content__btns">
      <div class="content__btns__btn content__btns__btn--last" @click="confirm"> {{ okButton }}</div>
    </div>
  </base-dialog>
</template>
  
<script>
import { ref, reactive, toRefs } from 'vue';
import BaseDialog from './BaseDialog.vue'

export default {
  name: 'MessageDialog',
  components: { BaseDialog },

  setup() {
    // Parameters that change depending on the type of dialogue
    const data = reactive({
      title: undefined,
      message: undefined, // Main text content
      success: true,
      okButton: '确认'
    })

    const returnMethods = {
      // Private variables
      resolvePromise: undefined,
      rejectPromise: undefined,
    }

    const baseDialog = ref(null);

    const show = (opts = {}) => {
      console.log('opts', opts);
      data.title = opts.title;
      data.message = opts.message;
      data.success = opts.success;

      // Once we set our config, we tell the popup modal to open
      baseDialog.value.open();
      // Return promise so the caller can get results
      return new Promise((resolve, reject) => {
        returnMethods.resolvePromise = resolve
        returnMethods.rejectPromise = reject
      })
    }

    const confirm = () => {
      baseDialog.value.close()
      returnMethods.resolvePromise(true)
    }

    const { title, message, success, okButton } = toRefs(data);

    return {
      title,
      message,
      success,
      okButton,
      baseDialog,
      show,
      confirm,
    }
  }
}
</script>
  
<style lang="scss" scoped>
.content__icon {
  &--success {
    position: absolute;
    float: left;
    top: .3rem;
    left: .1rem;
    color: var(--dialog-sccess-icon-color);
    font-size: .5rem;
  }

  &--fail {
    position: absolute;
    float: left;
    top: .21rem;
    left: .2rem;
    color: #ff0505;
    font-size: .5rem;
  }
}

.content__title {
  margin: .24rem 0 0 0;
  line-height: .26rem;
  font-size: .18rem;
  color: var(--dialog-title-color);
  text-align: center;
}

.content__desc {
  margin: 0.15rem 0.1rem 0.08rem 0.1rem;
  font-size: .14rem;
  color: var(--dialog-desc-color);
  text-align: center;
  word-break: normal;
  white-space: normal;
  overflow-x: auto;
}
.content__btns {
  display: flex;
  margin: .24rem .58rem;

  &__btn {
    cursor: pointer;
    flex: 1;
    width: .8rem;
    line-height: .32rem;
    // border-radius: .16rem;
    text-align: center;

    &--last {
      background-color: var(--dialog-confirm-button-background-color);
      color: var(--dialog-confirm-button-color);
    }

    &--last:hover {
      background-color: #1c98f7;
    }
  }
}
</style>