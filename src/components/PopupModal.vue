<template>
  <transition name="fade">
    <div class="popup-modal" v-if="isVisible">
      <div class="window">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'PopupModal',
  setup() {
    const isVisible = ref(false);
    const open = () => {
      isVisible.value = true;
    }

    const close = () => {
      isVisible.value = false;
    }

    return {
      isVisible, 
      open, 
      close
    }
  }
}
</script>

<style scoped>
/* css class for the transition */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.popup-modal {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    z-index: 1;
}

.window {
    background: #fff;
    border-radius: .05rem;
    box-shadow: .02rem .04rem .08rem rgba(0, 0, 0, 0.2);
    max-width: 4.8rem;
    margin-left: auto;
    margin-right: auto;
    padding: 1rem;
}
</style>