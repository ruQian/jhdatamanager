<template>
  <div>
    <Mapper/>
  </div>
</template>

<script>
import Mapper from './components/Mapper.vue'

export default {
  name: 'App',
  components: {
    Mapper
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
