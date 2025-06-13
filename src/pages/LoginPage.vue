<template>
    <div class="login-container">
        <div class="login-background-image">
            <img src="../assets/管理会议.png" style="width: 700px;height: 770px;">
        </div>
        <UserLogin v-if="isLoginState" :callback="changeState"></UserLogin>
        <UserReg v-if="!isLoginState" :callback="changeState"></UserReg>
    </div>
</template>
<script>
    import UserLogin from '@/components/UserLogin.vue';
    import UserReg from '@/components/UserReg.vue';
  export default {
    data() {
      return {
        isLoginState:true
      };
    },
    mounted(){
        
    },
    components:{
      UserLogin,
      UserReg
    },
    methods: {
      changeState(flag){
            this.isLoginState=flag
      }
    }
  }
</script>
<style>
    /* 重置全局样式影响 */
    html, body {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
    }
    
    /* 主容器设置 */
    .login-container {
        background-image: url('../assets/login_bg-6b1edf8c.jpg');
        background-size: cover;       /* 确保背景图覆盖整个容器 */
        background-position: center;  /* 背景图居中 */
        min-height: 100vh;           /* 最小高度为视口高度 */
        width: 100vw;                /* 宽度为视口宽度 */
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;          /* 为子元素定位提供参考 */
        overflow: hidden;            /* 隐藏可能的内容溢出 */
    }
    
    .login-background-image {
        margin-left: 200px;
        z-index: 1;                 /* 确保图片在背景之上 */
    }
    
    .login-from {
        width: 50vh;
        background-color: rgb(255, 255, 255);
        padding: 50px;
        border-radius: 20px;
        margin-right: 200px;
        z-index: 1;                 /* 确保表单在背景之上 */
    }
</style>