<template>
  <el-container style="height: 100%;">
    <el-header style="height: 50px;">
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
    <el-container style="height: calc(100vh - 120px);">
      <el-aside width="330px" class="aside-custom">
        <div class="popover-wrapper" style="flex-shrink: 0;">
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
        <!-- 滚动区域（任务卡片 + 加载更多） -->
        <div class="card-scroll-area">
          <el-card class="task-card" :class="{ selected: selectedTaskId === item.id }" v-for="(item, index) in taskList"
            :key="index" shadow="hover" @click.native="selectedTask(item.id)">
            <div>{{ item.taskName }}</div>
            <div>{{ formatDate(item.taskTime) }}</div>
          </el-card>
          <div class="load-label">
            <i v-if="listLoadStatus" class="el-icon-loading"></i>
            <span v-if="!listLoadStatus && loadLabelStatus" @click="loadMove()">加载更多</span>
            <span v-if="!loadLabelStatus">已经到底了</span>
          </div>
        </div>
      </el-aside>
      <el-container style="overflow-y: auto;">
        <el-main style="background-color: rgb(255, 255, 255); border-radius: 10px; padding: 20px;">
          <!-- 骨架屏 loading 效果 -->
          <div v-if="loadingTaskDetail" class="skeleton-container">
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
          <div v-else-if="selectedTaskInfo">
            <!-- 计划信息块 -->
            <div v-if="selectedTaskInfo.planInfoTo" style="margin-bottom: 30px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <el-image :src="selectedTaskInfo.planInfoTo.icon"
                  style="width: 60px; height: 60px; border-radius: 8px; margin-right: 20px; cursor: pointer;"
                  fit="cover" :preview-src-list="[selectedTaskInfo.planInfoTo.icon]" preview-teleported
                  :initial-index="0" />
                <div>
                  <div style="font-size: 20px; font-weight: bold;">
                    {{ selectedTaskInfo.planInfoTo.planName || '未关联计划' }}
                  </div>
                  <div style="color: #999; font-size: 14px;">
                    {{ selectedTaskInfo.planInfoTo.description || '无描述信息' }}
                  </div>
                </div>
              </div>
              <div style="margin-bottom: 6px;"><strong>计划说明：</strong>{{ selectedTaskInfo.planInfoTo.planInfo || '无' }}
              </div>
            </div>

            <!-- 任务信息块 -->
            <div>
              <div
                style="font-size: 18px; font-weight: bold; margin-bottom: 10px;display: flex;justify-content: space-between;align-items: center;">
                <span>任务信息</span>
                <el-tooltip content="编辑任务信息" placement="top">
                  <img style="width: 30px;height: 30px; margin-right: 10px;cursor: pointer;"
                    src="@/assets/ioc/task/edit.png" @click="editTaskOpen()">
                </el-tooltip>
              </div>
              <div style="margin-bottom: 10px;"><strong>任务名称：</strong>{{ selectedTaskInfo.taskName }}</div>
              <div style="margin-bottom: 10px;"><strong>任务时间：</strong>{{ formatDate(selectedTaskInfo.taskTime) }}</div>

              <div style="margin-bottom: 10px;"><strong>任务类型：</strong>
                <span v-if="selectedTaskInfo.taskType == 1">学习</span>
                <span v-if="selectedTaskInfo.taskType == 2">锻炼</span>
                <span v-if="selectedTaskInfo.taskType == 3">写作</span>
                <span v-if="selectedTaskInfo.taskType == 4">阅读</span>
                <span v-if="selectedTaskInfo.taskType == 5">影视</span>
              </div>

              <!-- itemToLists 渲染为列表 -->
              <div v-if="selectedTaskInfo.itemToList?.length > 0" style="margin-bottom: 10px;">
                <strong>备注内容：</strong>
                <ul style="padding-left: 20px; margin-top: 10px;">
                  <li v-for="(item, index) in selectedTaskInfo.itemToList" :key="index" style="margin-bottom: 6px;">
                    <span style="font-weight: 500; color: #408af4;">{{ item.no }}.</span>
                    <span style="margin-left: 6px;">{{ item.itemContext }}</span>
                  </li>
                </ul>
              </div>
              <div v-if="selectedTaskInfo.annexFiles != null && selectedTaskInfo.annexFiles.length > 0">
                <strong>附件内容:</strong>
                <AnnexFileView :fileList="selectedTaskInfo.annexFiles" />
              </div>
              <!-- 操作按钮 -->
              <div class="icon-row" v-if="selectedTaskInfo.status == 1">
                <el-tooltip effect="dark" content="完成任务" placement="top">
                  <span class="icon-wrapper" style="margin-right: 10px;" @click="selectAction(selectedTaskInfo.id, 1)">
                    <svg t="1753254753676" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="880" width="25" height="25">
                      <path
                        d="M460.8 694.044444L312.888889 546.133333c-2.844444-2.844444-2.844444-11.377778 0-14.222222l28.444444-28.444444c2.844444-2.844444 8.533333-2.844444 11.377778 0l108.088889 108.088889 247.466667-219.022223c5.688889-5.688889 11.377778-2.844444 17.066666 0l22.755556 25.6c5.688889 5.688889 5.688889 14.222222 0 19.911111l-287.288889 256z"
                        fill="#5C5C5C"></path>
                      <path
                        d="M512 56.888889c250.311111 0 455.111111 204.8 455.111111 455.111111s-204.8 455.111111-455.111111 455.111111S56.888889 762.311111 56.888889 512 261.688889 56.888889 512 56.888889m0-56.888889C230.4 0 0 230.4 0 512s230.4 512 512 512 512-230.4 512-512S793.6 0 512 0z"
                        fill="#5C5C5C"></path>
                    </svg>
                  </span>
                </el-tooltip>
                <el-tooltip effect="dark" content="取消任务" placement="top">
                  <span class="icon-wrapper" style="margin-right: 10px;" @click="selectAction(selectedTaskInfo.id, 2)">
                    <svg t="1753328803437" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="6930" width="25" height="25">
                      <path
                        d="M509.44 935.424c-233.984 0-424.448-190.464-424.448-424.448s190.464-424.448 424.448-424.448 424.448 190.464 424.448 424.448-190.464 424.448-424.448 424.448z m0-797.696c-205.824 0-373.248 167.424-373.248 373.248s167.424 373.248 373.248 373.248 373.248-167.424 373.248-373.248-167.424-373.248-373.248-373.248z"
                        fill="#000000" p-id="6931"></path>
                      <path
                        d="M338.944 681.472c-10.24-10.24-10.24-26.112 0-36.352l304.128-304.128c10.24-10.24 26.112-10.24 36.352 0s10.24 26.112 0 36.352l-304.128 304.128c-9.728 9.728-26.112 9.728-36.352 0z"
                        fill="#000000" p-id="6932"></path>
                      <path
                        d="M679.424 681.472c-10.24 10.24-26.112 10.24-36.352 0L338.944 376.832c-10.24-10.24-10.24-26.112 0-36.352s26.112-10.24 36.352 0l304.128 304.128c10.24 10.24 10.24 26.624 0 36.864z"
                        fill="#000000" p-id="6933"></path>
                    </svg>
                  </span>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除任务" placement="top">
                  <span class="icon-wrapper" @click="selectAction(selectedTaskInfo.id, 3)">
                    <svg t="1753254801877" class="icon" viewBox="0 0 1024 1024" version="1.1"
                      xmlns="http://www.w3.org/2000/svg" p-id="1043" width="25" height="25">
                      <path
                        d="M745.6 928H294.4c-51.2 0-96-44.8-96-102.4V390.4c0-19.2 16-32 32-32s32 16 32 32v438.4c0 19.2 12.8 35.2 28.8 35.2h451.2c16 0 28.8-16 28.8-35.2V390.4c0-19.2 16-32 32-32s32 16 32 32v438.4c6.4 54.4-35.2 99.2-89.6 99.2zM905.6 291.2h-768c-19.2 0-35.2-16-35.2-35.2s16-35.2 35.2-35.2h768c19.2 0 35.2 16 35.2 35.2s-16 35.2-35.2 35.2zM649.6 163.2h-256c-19.2 0-35.2-16-35.2-35.2s16-35.2 35.2-35.2h256c19.2 0 35.2 16 35.2 35.2s-16 35.2-35.2 35.2z"
                        fill="#333333"></path>
                      <path
                        d="M409.6 739.2c-19.2 0-35.2-16-35.2-35.2v-288c0-19.2 16-35.2 35.2-35.2s35.2 16 35.2 35.2v288c0 19.2-16 35.2-35.2 35.2zM633.6 739.2c-19.2 0-35.2-16-35.2-35.2v-288c0-19.2 16-35.2 35.2-35.2s35.2 16 35.2 35.2v288c0 19.2-16 35.2-35.2 35.2z"
                        fill="#333333"></path>
                    </svg>
                  </span>
                </el-tooltip>
              </div>
            </div>
          </div>
          <div v-else>
            <el-empty description="无任务信息" />
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 侧边栏 -->
    <el-drawer title="编辑任务" :visible.sync="drawer" :direction="direction" :before-close="handleClose" size="600px">
      <!-- 表单 -->
      <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="100px" style="padding-right: 30px;">

        <el-form-item label="任务名" prop="taskName">
          <el-input maxlength="20" v-model="taskForm.taskName" placeholder="请输入任务名" />
        </el-form-item>

        <el-form-item label="任务时间" prop="taskTime">
          <el-date-picker v-model="taskForm.taskTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注内容" prop="itemToList">
          <div v-for="(item, index) in taskForm.itemToList" :key="index"
            style="display: flex; align-items: center; margin-bottom: 8px;">
            <span style="
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        width: 24px;
                        height: 24px;
                        background-color: #e0e0e0;
                        border-radius: 50%;
                        font-size: 12px;
                        color: #333;
                        margin-right: 15px;
                    ">
              {{ item.no }}
            </span>

            <!-- 序号内容 -->
            <el-input v-model="item.itemContext" placeholder="请输入内容" style="flex: 1; margin-right: 10px;"></el-input>

            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeItem(index)" circle></el-button>
          </div>

          <!-- 添加按钮 -->
          <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addItem"></el-button>
        </el-form-item>


        <el-form-item label="任务类型" prop="taskType">
          <el-select v-model="taskForm.taskType" placeholder="请选择类型">
            <el-option label="学习" :value="1" />
            <el-option label="锻炼" :value="2" />
            <el-option label="写作" :value="3" />
            <el-option label="阅读" :value="4" />
            <el-option label="影视" :value="5" />
          </el-select>
        </el-form-item>

        <el-form-item label="附件内容">
          <AnnexFileUpload :value="taskForm.annexFiles" @update="taskForm.annexFiles = $event" ref="AnnexFileUpload" />
        </el-form-item>
      </el-form>

      <!-- 底部按钮 -->
      <div style="text-align:right; margin-top:20px;padding-right: 30px;">
        <el-button @click="handleClose()">取消</el-button>
        <el-button type="primary" @click="submitFormTask">保存</el-button>
      </div>
    </el-drawer>
  </el-container>
</template>

<script>
import { getTaskList, getTaskInfo, cancelTask, completeTask, deleteTask, updateTask } from '@/api/task';
import AnnexFileView from '@/components/AnnexFileView.vue';
import { formatDate } from '@/utils/navigator'
import { getUniqueCode } from '@/api/public';
import AnnexFileUpload from '@/components/AnnexFileUpload.vue';

export default {
  name: "taskPage",
  components: {
    AnnexFileView,
    AnnexFileUpload
  },
  data() {
    return {
      showStatus: 1,
      page: 1,
      limit: 10,
      pageCount: 0,
      dateRange: [], // 存储起止日期，[startDate, endDate]
      searchText: '',
      taskList: [],
      selectedTaskId: null, //  选中任务卡的索引
      selectedTaskInfo: null,
      loadingTaskDetail: false,
      listLoadStatus: false,
      //编辑拉框
      drawer: false,
      uniqueCode: null,
      taskForm: {
        taskName: "",
        taskTime: null,
        itemToList: [],
        taskType: 1,
        annexFiles: []
      },
    };
  },
  methods: {
    formatDate,
    setStatus(status) {
      if (status == this.showStatus) return
      this.selectedTaskInfo = null
      this.showStatus = status;
    },
    getTaskList(params) {
      return getTaskList(params).then(res => {
        const data = res.data
        this.taskList.push(...data.data.list)
        this.pageCount = data.data.pageCount
        this.page = data.data.page
      }).catch(error => {
        console.info(error)
      })
    },
    selectedTask(id) {
      this.loadingTaskDetail = true
      this.selectedTaskId = id
      //当选中了任务id之后需要查询对应的数据
      getTaskInfo({ id: id }).then(res => {
        const data = res.data;
        this.selectedTaskInfo = data.data; // 设置详情数据
        this.loadingTaskDetail = false
      })
    },
    async selectAction(id, actionType) {
      const messages = {
        1: { tip: '是否确定完成该任务?', finish: '任务已完成.', api: completeTask },
        2: { tip: '是否确定取消该任务?', finish: '任务已取消.', api: cancelTask },
        3: { tip: '是否确定删除该任务?', finish: '任务已删除.', api: deleteTask }
      };

      const array = [id];
      const { tip, finish, api } = messages[actionType] || messages[3]; // 默认是删除

      try {
        await this.$confirm(tip, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        const response = await api(array); // 调用对应接口
        // 如果是删除接口需要额外获取 .data，也可以单独处理：
        // const result = actionType === 3 ? response.data : response;
        if (response.data.code == 200) {
          this.$message({
            type: 'success',
            message: finish
          });
          //修改切换任务,这里改为前端去除掉对应的任务
          const index = this.taskList.findIndex(item => item.id === id);
          if (index !== -1) {
            this.taskList.splice(index, 1);
          }
          this.selectedTaskId = null
          if (this.taskList.length == 0) return
          this.selectedTask(this.taskList[0].id)
        }
      } catch (err) {
        // 用户取消或请求失败都可以忽略或提示
        if (err !== 'cancel') {
          console.error('操作失败:', err);
        }
      }
    },
    async loadMove() {
      this.listLoadStatus = true
      if (this.page < this.pageCount) {
        //只有当前页数小于总页数才需要更新页
        await this.getTaskList({ page: this.page + 1, limit: this.limit, status: this.showStatus })
      }
      this.listLoadStatus = false
    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(() => {
          Object.assign(this.taskForm, {
            taskName: "",
            taskTime: null,
            itemToList: [],
            taskType: 1,
            annexFiles: []
          });
          this.drawer = false
          //清空一遍子组件的上传内容
          this.$refs.AnnexFileUpload.cleanFileList();
        })
        .catch(() => { return });
    },
    async editTaskOpen() {
      //获取到唯一码作为上传使用的
      await getUniqueCode().then(res => {
        this.uniqueCode = res.data.data
      })
      //将当前选择的任务样式给到选中任务表单
      this.taskForm.taskName = this.selectedTaskInfo.taskName
      this.taskForm.taskTime = new Date(this.selectedTaskInfo.taskTime * 1000)
      this.taskForm.itemToList = this.selectedTaskInfo.itemToList
      this.taskForm.taskType = this.selectedTaskInfo.taskType
      this.taskForm.annexFiles = this.selectedTaskInfo.annexFiles
      this.drawer = true
    },
    submitFormTask() {
      const payload = {
        ...this.taskForm,
        uniqueCode: this.uniqueCode,  // 这里加新属性
        id: this.selectedTaskId
      }
      payload.taskTime = Math.floor(payload.taskTime.getTime() / 1000);
      console.info(payload)
      updateTask(payload).then(res => {
        if (res.data.code == 200) {
          this.$message.success('修改成功')
          Object.assign(this.taskForm, {
            taskName: "",
            taskTime: null,
            itemToList: [],
            taskType: 1,
            annexFiles: []
          });
          this.drawer = false
          //清空一遍子组件的上传内容
          this.$refs.AnnexFileUpload.cleanFileList();
          //重新刷新一下
          this.selectedTask(this.selectedTaskId)
        }
      })
    },
    addItem() {
      this.taskForm.itemToList.push({
        no: this.taskForm.itemToList.length + 1,
        itemContext: ''
      });
    },
    removeItem(index) {
      this.taskForm.itemToList.splice(index, 1);
      // 删除后重排序号
      this.taskForm.itemToList.forEach((item, i) => {
        item.no = i + 1;
      });
    },
  },
  async created() {
    await this.getTaskList({ page: 1, limit: 10, status: 1 })
    //当加初次加载完成后，默认选中第一个任务
    if (this.taskList.length == 0) return
    this.selectedTask(this.taskList[0].id)
  },
  watch: {
    async showStatus(newValue) {
      this.taskList = []
      await this.getTaskList({ page: 1, limit: 10, status: newValue })
      this.selectedTaskId = null
      if (this.taskList.length == 0) return
      this.selectedTask(this.taskList[0].id)
    },
  },
  computed: {
    loadLabelStatus() {
      return this.page < this.pageCount
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

/* 输入+筛选图标整体布局优化 */
.popover-wrapper {
  display: flex;
  align-items: center;
  height: 40px;
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
.task-card {
  width: 85%;
  height: 50px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* 内容靠左 */
  justify-content: center;
  font-weight: 500;
  padding: 16px;
  /* 加一点内边距 */
}

.task-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 时间样式单独处理 */
.task-card div:last-child {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.load-label {
  width: 85%;
  font-size: 15px;
  color: #999;
  display: flex;
  justify-content: center;
  cursor: pointer;
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

.task-card.selected {
  background-color: rgb(234, 234, 234);
  /* 深色 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

ul {
  list-style-type: none;
}

li::before {
  color: #408af4;
}

.icon-wrapper {
  background-color: rgb(240, 240, 240);
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  transition: background-color 0.3s;
  cursor: pointer;
}

.icon-wrapper:hover {
  background-color: rgb(207, 207, 207);
  /* hover 时变灰一点 */
}

.icon-row {
  margin-top: 20px;
  display: flex;
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

/* shimmer 动画 */
.shimmer {
  position: relative;
  overflow: hidden;
}

.shimmer::after {
  content: '';
  position: absolute;
  top: 0;
  left: -150px;
  height: 100%;
  width: 150px;
  background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%);
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  100% {
    transform: translateX(300%);
  }
}

/* 滚动条整体 */
::-webkit-scrollbar {
  width: 6px;
  /* 垂直滚动条宽度 */
  height: 6px;
  /* 水平滚动条高度 */
}

/* 滚动条轨道（背景） */
::-webkit-scrollbar-track {
  background: transparent;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.5);
  /* 滑块颜色 */
  border-radius: 3px;
  /* 圆角 */
}

/* 鼠标悬停时滑块颜色变化 */
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(144, 147, 153, 0.7);
}

.card-scroll-area {
  overflow-y: auto;
  flex: 1;
  padding-right: 4px;
}
</style>
