<template>
  <dev class="progress-bar-container">
    <!-- 进度条背景 -->
    <dev class="progress-bar-background">
      <!-- 已完成进度条填充部分 -->
      <dev class="progress-bar-fill progress-bar-completed" :style="{ width: completedWidth + '%' }"></dev>
      <!-- 进行中进度条填充部分 -->
      <dev class="progress-bar-fill progress-bar-toward"
        :style="{ width: towardWidth + '%', marginLeft: completedWidth + '%' }"></dev>
    </dev>
    <!-- 显示总进度 -->
    <dev class="progress-text">
      总数: {{ total }}, 已完成: {{ completed }} ({{ completedPercent }}%), 进行中: {{ toward }} ({{ towardPercent }}%)
    </dev>
  </dev>
</template>

<script>
export default {
  props: {
    // 总数
    total: {
      type: Number,
      required: true,
      validator: (value) => value > 0, // 确保总数大于 0
    },
    // 已完成数
    completed: {
      type: Number,
      required: true,
      validator: (value) => value >= 0, // 确保已完成数不为负
    },
    // 进行中数
    toward: {
      type: Number,
      required: true,
      validator: (value) => value >= 0, // 确保进行中数不为负
    },
  },
  computed: {
    // 已完成进度百分比
    completedPercent() {
      return ((this.completed / this.total) * 100).toFixed(2);
    },
    // 进行中进度百分比
    towardPercent() {
      return ((this.toward / this.total) * 100).toFixed(2);
    },
    // 计算总进度百分比（不超过 100）
    totalProgress() {
      return Math.min(Number(this.completedPercent) + Number(this.towardPercent), 100);
    },
    // 计算已完成进度的显示宽度（相对于总进度条）
    completedWidth() {
      return Math.min(this.completedPercent, 100);
    },
    // 计算进行中进度的显示宽度（相对于总进度条）
    towardWidth() {
      return Math.min(this.towardPercent, 100);
    },
  },
};
</script>

<style scoped>
.progress-bar-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.progress-bar-background {
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  /* 进度条背景颜色 */
  border-radius: 5px;
  overflow: hidden;
  position: relative;
  /* 用于定位填充部分 */
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.3s ease, margin-left 0.3s ease;
  /* 添加动画效果 */
  position: absolute;
  /* 使填充部分准确定位 */
  top: 0;
}

.progress-bar-completed {
  background-color: #007cff;
  /* 已完成进度颜色 */
  border-radius: 5px 0 0 5px;
  /* 仅已完成进度条左侧圆角 */
}

.progress-bar-toward {
  background-color: #68c23a;
  /* 进行中进度颜色 */
  border-radius: 0 5px 5px 0;
  /* 仅进行中进度条右侧圆角 */
}

.progress-text {
  width: 100%;
  margin-top: 8px;
  font-size: 14px;
  color: #555;
  /* 文字颜色 */
  text-align: center;
}
</style>
