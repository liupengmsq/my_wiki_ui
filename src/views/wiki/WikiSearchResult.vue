<template>
    <div class="wrapper">
      <div class="main theme-a">
      </div>
    </div>
  </template>
    
  <script>
  export default {
    name: 'WikiSearchResult',
    setup() {
      return {
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
    