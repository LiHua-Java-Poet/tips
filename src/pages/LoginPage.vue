<template>
    <div class="login-container">
        <div class="login-background-image">
            <img src="../assets/管理会议.png" style="width: 700px;">
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
    height: 100vh; /* 占满整个视口 */
    overflow: hidden; /* 防止滚动条出现 */
    background-image: url('../assets/login_bg-6b1edf8c.jpg');
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
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