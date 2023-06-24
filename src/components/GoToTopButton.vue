<template>
  <div v-if="btnShow" class="bar" @click="backTop">
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" class="Zi Zi--BackToTop" fill="currentColor">
      <path fill-rule="evenodd"
        d="M13.204 3.107a1.75 1.75 0 0 0-2.408 0L3.806 9.73c-1.148 1.088-.378 3.02 1.204 3.02h2.24V20c0 .966.784 1.75 1.75 1.75h6A1.75 1.75 0 0 0 16.75 20v-7.25h2.24c1.582 0 2.353-1.932 1.204-3.02l-6.99-6.623Z"
        clip-rule="evenodd"></path>
    </svg>
  </div>
</template>


<script>
import { onMounted, ref } from 'vue';

export default {
  name: 'GoToTopButton',
  setup() {
    const btnShow = ref(false)
    let timer = null;

    onMounted(() => {
      window.addEventListener('scroll', scrollToTop)
    });

    function backTop() {
      timer = setInterval(function () {
        let backTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        let speedTop = backTop / 2;
        document.documentElement.scrollTop = backTop - speedTop;
        if (backTop === 0) {
          clearInterval(timer)
        }
      }, 30);
    }

    function scrollToTop() {
      let pageLookHeight = document.documentElement.clientHeight || document.body.clientHeight
      let scroll = document.documentElement.scrollTop

      if (scroll >= pageLookHeight) {
        btnShow.value = true
      } else {
        btnShow.value = false
      }
    }

    return {
      btnShow,
      timer,
      backTop,
      scrollToTop
    }
  }
}
</script>
    
<style lang="scss" scoped>
.bar {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  position: fixed;
  right: 262px;
  bottom: 108px;
  height: 43px;
  width: 43px;
  background-color: rgb(255, 255, 255);
  border-radius: 20%;
  overflow: hidden;
  z-index: 2;

  color: rgb(133, 144, 166);
  cursor: pointer;
}
</style>
