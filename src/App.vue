<template>
  <div class="top-nav-container">
    <nav class="top-nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/wiki">Wiki</router-link> |
      <router-link to="/markdown">Markdown</router-link>
    </nav>
  </div>
  <router-view/>
</template>

<style scoped>
.top-nav-container {
  width: 100%;
  padding-left: auto;
  padding-right: auto;
  padding-top: .1rem;
  padding-bottom: .1rem;
  /* background-color: #0593d3; */
}
.top-nav {
  max-width: 1760px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  /* color: #fff; */
}

</style>
