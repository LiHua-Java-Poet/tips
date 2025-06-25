<template>
  <div class="not-found-container">
    <el-card shadow="hover" class="not-found-card">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <p class="error-message">很抱歉，您访问的页面不存在。</p>
        <el-button type="primary" icon="el-icon-back" @click="goHome">
          返回首页
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import navigator from '@/utils/navigator';
export default {
  name: 'NotFoundPage',
  methods: {
    goHome() {
      navigator(this,'/index/all')
    }
  }
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.not-found-card {
  padding: 40px 60px;
  text-align: center;
  border-radius: 12px;
  max-width: 500px;
  background-color: #fff;
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-code {
  font-size: 96px;
  color: #409EFF;
  margin: 0;
}

.error-message {
  font-size: 18px;
  margin: 20px 0;
  color: #606266;
}
</style>
