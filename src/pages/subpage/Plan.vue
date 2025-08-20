<template>
  <el-container style="height: 100%;">
    <el-header>
      <el-row>
        <el-col :span="4">
          <div class="status-button" :class="{ process: showStatus === 1 }" @click="setStatus(1)">
            进行中
          </div>
        </el-col>
        <el-col :span="4">
          <div class="status-button" :class="{ finish: showStatus === 2 }" @click="setStatus(2)">
            已完成
          </div>
        </el-col>
        <el-col :span="4">
          <div class="status-button" :class="{ cancel: showStatus === 3 }" @click="setStatus(3)">
            已取消
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="350px" class="aside-custom">
        <div class="popover-wrapper">
          <el-input style="width: 90%;" placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="searchText">
          </el-input>
          <el-popover style="cursor: pointer;margin-left: 2%;padding-top: 2px;" placement="bottom" width="500"
            trigger="click">
            <svg t="1750918798427" slot="reference" class="icon" viewBox="0 0 1024 1024" version="1.1"
              xmlns="http://www.w3.org/2000/svg" p-id="8560" width="25" height="25">
              <path
                d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z"
                p-id="8561"></path>
            </svg>
            <el-form label-width="80px" size="small">
              <el-form-item label="起止日期">
                <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                  end-placeholder="结束日期" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-form>
          </el-popover>
        </div>
        <div class="plan-scroll-wrapper">
          <el-card class="plan-card" v-for="(item, index) in planList" :key="index"
            :class="{ selected: selectedPlanId === item.id }" @click.native="selectedPlan(item.id)">
            <div class="card-body">
              <el-image class="card-icon" :src="item.icon" :alt="item.planName" fit="cover" lazy
                :preview-src-list="[item.icon]" />
              <div class="card-content">
                <div class="card-title">{{ item.planName }}</div>
                <div class="card-description">{{ item.description }}</div>
                <div class="card-progress">
                  进度：{{ item.taskProgress }} / {{ item.taskTotal }}
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </el-aside>
      <el-container>
        <el-main style="background-color: #fff; border-radius: 10px; padding: 20px;">
          <!-- 加载状态 -->
          <div v-if="loadingPlanDetail" class="skeleton-container">
            <div class="skeleton-header">
              <div class="skeleton-avatar shimmer"></div>
              <div class="skeleton-text-group">
                <div class="skeleton-title shimmer"></div>
                <div class="skeleton-subtitle shimmer"></div>
              </div>
            </div>
            <div class="skeleton-line shimmer" style="width: 60%;"></div>
            <div class="skeleton-line shimmer" style="width: 80%;"></div>
            <div class="skeleton-line shimmer" style="width: 50%;"></div>
          </div>

          <!-- 显示计划信息 -->
          <div v-if="selectedPlanInfo && !loadingPlanDetail" class="plan-detail">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <!-- 左侧：图标 + 标题 + 描述 -->
              <div style="display: flex; align-items: center;">
                <!-- 图标 -->
                <el-image :src="selectedPlanInfo.icon" :preview-src-list="[selectedPlanInfo.icon]" preview-teleported
                  style="width: 65px; height: 65px; border-radius: 8px; margin-right: 12px;" fit="cover" />
                <!-- 标题 + 描述 -->
                <div style="display: flex; flex-direction: column;">
                  <span style="font-size: 18px; font-weight: bold;">{{ selectedPlanInfo.planName }}</span>
                  <span style="font-size: 14px; color: rgb(114, 114, 114); margin-top: 4px;">
                    {{ selectedPlanInfo.description || '无描述' }}
                  </span>
                </div>
              </div>


              <!-- 右侧：编辑按钮 -->
              <el-tooltip content="编辑计划信息" placement="top">
                <img style="width: 30px;height: 30px; cursor: pointer;" src="@/assets/ioc/task/edit.png"
                  @click="editPlanOpen()" />
              </el-tooltip>
            </div>

            <!-- 进度条 -->
            <ProgressBar :total="selectedPlanInfo.taskTotal" :completed="selectedPlanInfo.taskProgress"
              :toward="selectedPlanInfo.towardProgress" />

            <!-- 基础信息 -->
            <div style="margin-bottom: 10px;"><strong>计划名称：</strong>{{ selectedPlanInfo.planName }}</div>
            <div style="margin-bottom: 10px;"><strong>计划说明：</strong>{{ selectedPlanInfo.description || '无' }}</div>
            <div style="margin-bottom: 10px;"><strong>计划周期：</strong>{{ getCycleText(selectedPlanInfo.cycleType) }}</div>
            <div style="margin-bottom: 10px;"><strong>计划类型：</strong>{{ getPlanTypeText(selectedPlanInfo.planType) }}
            </div>
            <div style="margin-bottom: 10px;"><strong>开始时间：</strong>{{ formatDate(selectedPlanInfo.startTime) }}</div>
            <!-- <div style="margin-bottom: 10px;"><strong>预期完成时间：</strong>{{ formatDate(selectedPlanInfo.expectedTime) }}</div> -->

            <!-- 备注内容 -->
            <div v-if="selectedPlanInfo.planInfo?.length > 0" style="margin-bottom: 10px;">
              <strong>备注内容：</strong>
              <ul style="padding-left: 20px; margin-top: 10px;">
                <li v-for="(item, index) in selectedPlanInfo.planInfo" :key="index" style="margin-bottom: 6px;">
                  <span style="font-weight: 500; color: #408af4;">{{ item.no }}.</span>
                  <span style="margin-left: 6px;">{{ item.itemContext }}</span>
                </li>
              </ul>
            </div>

            <!-- 附件内容 -->
            <div v-if="selectedPlanInfo.annexFiles?.length > 0" style="margin-bottom: 10px;">
              <strong>附件内容：</strong>
              <AnnexFileView :fileList="selectedPlanInfo.annexFiles" />
            </div>
          </div>

          <!-- 无选中项 -->
          <div  v-if="!selectedPlanInfo">
            <el-empty description="无计划信息" />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getPlanList, getPlanInfo } from '@/api/plan';
import { formatDate } from '@/utils/navigator'
import ProgressBar from '@/components/ProgressBar.vue';
import AnnexFileView from '@/components/AnnexFileView.vue';

export default {
  name: "planPage",
  components: {
    AnnexFileView,
    ProgressBar
  },
  data() {
    return {
      showStatus: 1,
      dateRange: [], // 存储起止日期，[startDate, endDate]
      searchText: '',
      planList: [],
      loadingPlanDetail: false,
      selectedPlanId: null,
      selectedPlanInfo: null,
      totalProgress: 100,
      completProgress: 1,
      towardProgress: 2,
    };
  },
  methods: {
    formatDate,
    setStatus(status) {
      this.showStatus = status;
    },
    getPlanList(params) {
      return getPlanList(params).then(res => {
        const data = res.data
        this.planList = data.data.list
      }).catch(error => {
        console.info(error)
      })
    },
    selectedPlan(id) {
      this.loadingPlanDetail = true;
      this.selectedPlanId = id
      //当选中了任务id之后需要查询对应的数据
      getPlanInfo({ id: id }).then(res => {
        const data = res.data;
        this.selectedPlanInfo = data.data; // 设置详情数据
        this.loadingPlanDetail = false
      })
    },
    getProgressPercentage(plan) {
      if (!plan || !plan.taskTotal) return 0;
      return Math.round((plan.taskProgress / plan.taskTotal) * 100);
    },
    getCycleText(cycleType) {
      switch (cycleType) {
        case 1: return "每天";
        case 2: return "隔天";
        default: return "未知";
      }
    },
    getPlanTypeText(planType) {
      const map = {
        1: '学习',
        2: '锻炼',
        3: '写作',
        4: '阅读',
        5: '影视',
      };
      return map[planType] || '未知';
    },
  },
  async created() {
    await this.getPlanList({ page: 1, limit: 10, status: 1 })
    //当加初次加载完成后，默认选中第一个任务
    if (this.planList.length == 0) return
    //当长度不为0时显示第一个计划
    this.selectedPlan(this.planList[0].id)
  },
  watch: {
    async showStatus(newValue) {
      this.planList = []
      await this.getPlanList({ page: 1, limit: 10, status: newValue })
      this.selectedplanId = null
      if (this.planList.length == 0) return
      //当长度不为0时显示第一个计划
      this.selectedPlan(this.planList[0].id)
    }
  }
};
</script>

<style scoped>
/* 顶部状态按钮优化 */
.status-button {
  padding: 8px 8px;
  background-color: #f5f5f5;
  text-align: center;
  border-radius: 7px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  margin: 0 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #ddd;
}

.status-button:hover {
  background-color: #e0e0e0;
}

.status-button.process {
  background-color: #409eff;
  color: white;
  border: none;
}

.status-button.finish {
  background-color: #67c23a;
  color: white;
  border: none;
}

.status-button.cancel {
  background-color: #f56c6c;
  color: white;
  border: none;
}

/* 输入+筛选图标整体布局优化 */
.popover-wrapper {
  display: flex;
  align-items: center;
  /* height: 40px; */
  height: 3%;
  margin-bottom: 10px;
  padding: 0 5px;
}

/* 图标手型 + hover 提示 */
.icon {
  cursor: pointer;
  fill: #666;
  transition: all 0.2s;
}

.icon:hover {
  fill: #409eff;
  transform: scale(1.1);
}

/* 卡片样式优化 */
.plan-card {
  height: 100px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  font-weight: 500;
}

.plan-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-body {
  display: flex;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  margin-right: 12px;
  object-fit: cover;
  flex-shrink: 0;
  /* ✅ 禁止图片缩放 */
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1 1 auto;
  overflow: hidden;
  min-width: 0;
  /* ✅ 防止flex溢出必须项 */
}

.card-title,
.card-description,
.card-progress,
.card-info {
  font-size: 13px;
  line-height: 18px;
  color: #333;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}


.card-progress {
  color: #409eff;
}

.card-info {
  color: #999;
}

.selected {
  background-color: rgb(234, 234, 234);
  /* 深色 */
}

/* 弹出表单优化（你可放在 style scoped 里） */
.el-popover .el-form {
  padding: 10px;
}

/* 主体与侧栏的布局间距 */
.el-aside {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.el-main {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  min-height: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}


/* 设置 el-aside 外观 */
.aside-custom {
  background-color: #ffffff;
  border-radius: 10px;
  margin-right: 20px;
  padding-top: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
  /* 填满容器高度 */
}

.plan-scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  padding-right: 6px;
  /* 预留空间防止遮挡 */
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE */
}

/* Chrome */
.plan-scroll-wrapper::-webkit-scrollbar {
  width: 6px;
  /* 始终保留宽度，防止跳动 */
  background: transparent;
}

/* 默认不显示滑块 */
.plan-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: transparent;
}

/* hover 时显示滑块，不改变整体宽度 */
.plan-scroll-wrapper:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}


.plan-detail {
  padding: 20px;
}

.plan-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.plan-icon {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  margin-right: 16px;
}

.plan-title h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.plan-desc {
  margin-top: 4px;
  color: #888;
  font-size: 14px;
}

.plan-meta p {
  margin: 6px 0;
  color: #555;
  font-size: 14px;
}

.skeleton-container {
  padding: 20px;
  border-radius: 10px;
  background: #fff;
}

.skeleton-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.skeleton-avatar {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: #eee;
  margin-right: 20px;
}

.skeleton-text-group {
  flex: 1;
}

.skeleton-title {
  height: 16px;
  width: 150px;
  background: #eee;
  margin-bottom: 10px;
  border-radius: 4px;
}

.skeleton-subtitle {
  height: 14px;
  width: 100px;
  background: #eee;
  border-radius: 4px;
}

.skeleton-line {
  height: 14px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 12px;
}
</style>
