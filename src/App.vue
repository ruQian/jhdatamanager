<template>
  <div>
    <router-view></router-view>
    <!--Mapper/!-->
  </div>
</template>

<script>
//import Mapper from './components/Mapper.vue'

//export default {
//  name: 'App',
//  components: {
//    Mapper
//  }
//}
</script>

<style>
    @import "./assets/css/main.css";
    @import "./assets/css/color-dark.css";     /*深色主题*/
    /*@import "./assets/css/theme-green/color-green.css";   浅绿色主题*/
    #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      margin-top: 60px;
    }
</style>
