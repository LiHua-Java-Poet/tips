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
</style>
