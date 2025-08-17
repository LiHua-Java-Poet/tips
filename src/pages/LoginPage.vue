<template>
  <div class="login-container">
    <!-- 左侧表单 -->
    <div class="login-form">
      <UserLogin v-if="isLoginState" :callback="changeState" />
      <UserReg v-else :callback="changeState" />
    </div>

    <!-- 右侧图片 -->
    <div class="login-background-image">
      <img src="../assets/管理会议.png" alt="背景图片" />
    </div>
  </div>
</template>

<script>
import UserLogin from '@/components/UserLogin.vue';
import UserReg from '@/components/UserReg.vue';

export default {
  data() {
    return {
      isLoginState: true
    };
  },
  components: {
    UserLogin,
    UserReg
  },
  methods: {
    changeState(flag) {
      this.isLoginState = flag;
    }
  }
};
</script>

<style scoped>
/* 重置全局样式 */

/* 主容器 */
.login-container {
  height: 100vh;
  background-image: url('../assets/login_bg-6b1edf8c.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
  gap: 80px;
  /* 左右间距 */
  padding: 0 50px;
}

/* 左侧表单 */
.login-form {
  width: 400px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  z-index: 1;
}

/* 右侧图片 */
.login-background-image img {
  max-width: 500px;
  width: 100%;
  height: auto;
  display: block;
}
</style>
