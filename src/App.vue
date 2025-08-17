<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
      return {
      };
    },
    mounted(){
      console.info('页面启动')
      const isMobile = /android|iphone|ipad|ipod|windows phone|mobile/i.test(navigator.userAgent);
      if (isMobile) {
        this.$message.warning('当前是非PC端浏览器,请使用移动端访问')
      }
    }
}
</script>

<style>

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
