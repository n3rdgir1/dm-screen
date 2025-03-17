<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body, html {
  height: 100%;
  width: 100%;
  font-family: Arial, sans-serif;
  overflow-x: hidden;
}

#app {
  height: 100%;
  width: 100%;
}

button {
  cursor: pointer;
}
</style>
