<template>
  <el-container>
    <el-header style="height: 50px;">
      <el-row>
        <el-col :span="4">
          <div
            class="status-button"
            :class="{ process: showStatus === 1 }"
            @click="setStatus(1)"
          >
            进行中
          </div>
        </el-col>
        <el-col :span="4">
          <div
            class="status-button"
            :class="{ finish: showStatus === 2 }"
            @click="setStatus(2)"
          >
            已完成
          </div>
        </el-col>
        <el-col :span="4">
          <div
            class="status-button"
            :class="{ cancel: showStatus === 3 }"
            @click="setStatus(3)"
          >
            已取消
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="350px" style="background-color: rgb(255, 255, 255);
        padding: 20px;
        border-radius: 10px;
        margin-right: 20px;
        ">
            <div class="popover-wrapper">
                <el-input
                style="width: 90%;"
                    placeholder="请输入搜索内容"
                    prefix-icon="el-icon-search"
                    v-model="searchText">
                </el-input>
                <el-popover
                    style="cursor: pointer;margin-left: 2%;padding-top: 2px;"
                    placement="bottom"
                    width="500"
                    trigger="click"
                    >
                    <svg t="1750918798427"  slot="reference" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8560" width="25" height="25"><path d="M741.248 79.68l-234.112 350.08v551.488l55.296 24.704v-555.776l249.152-372.544c8.064-32.96-10.496-59.712-41.152-59.712h-709.248c-30.464 0-49.28 26.752-41.344 59.712l265.728 372.544v432.256l55.36 24.704v-478.592l-248.896-348.864h649.216z m-68.032 339.648c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-14.016-27.264-30.848z m0 185.216c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.256-27.264-14.016-27.264-30.848z m0 185.28c0-16.832 12.096-30.592 27.264-30.848h277.888c15.232 0 27.712 13.824 27.712 30.848s-12.416 30.848-27.712 30.848h-277.888c-15.168-0.32-27.264-13.952-27.264-30.848z" p-id="8561"></path></svg>
                    <el-form label-width="80px" size="small">
                        <el-form-item label="起止日期">
                            <el-date-picker
                                v-model="dateRange"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                style="width: 100%;"
                            ></el-date-picker>
                        </el-form-item>
                    </el-form>
                </el-popover>
            </div>
            <el-card class="task-card" 
              :class="{ selected: selectedTaskId === item.id }"
              v-for="(item, index) in taskList" 
              :key="index"
              shadow="hover"
              @click.native="selectedTask(item.id)">
                <div>{{ item.taskName }}</div>
                <div>{{ formatDate(item.taskTime) }}</div>
            </el-card>
            <div class="load-label">
              加载更多
            </div>
      </el-aside>
      <el-container>
        <el-main style="background-color: rgb(255, 255, 255); border-radius: 10px; padding: 20px;">
          <div v-if="selectedTaskInfo">

            <!-- 计划信息块 -->
            <div v-if="selectedTaskInfo.planInfoTo" style="margin-bottom: 30px;">
              <div style="display: flex; align-items: center; margin-bottom: 10px;">
                <el-image
                  :src="selectedTaskInfo.planInfoTo.icon"
                  style="width: 60px; height: 60px; border-radius: 8px; margin-right: 20px; cursor: pointer;"
                  fit="cover"
                  :preview-src-list="[selectedTaskInfo.planInfoTo.icon]"
                  preview-teleported
                  :initial-index="0"
                />
                <div>
                  <div style="font-size: 20px; font-weight: bold;">
                    {{ selectedTaskInfo.planInfoTo.planName || '未关联计划' }}
                  </div>
                  <div style="color: #999; font-size: 14px;">
                    {{ selectedTaskInfo.planInfoTo.description || '无描述信息' }}
                  </div>
                </div>
              </div>
              <div style="margin-bottom: 6px;"><strong>计划说明：</strong>{{ selectedTaskInfo.planInfoTo.planInfo || '无' }}</div>
            </div>

            <!-- 任务信息块 -->
            <div>
              <div style="font-size: 18px; font-weight: bold; margin-bottom: 10px;">任务信息</div>
              <div style="margin-bottom: 10px;"><strong>任务名称：</strong>{{ selectedTaskInfo.taskName }}</div>
              <div style="margin-bottom: 10px;"><strong>任务时间：</strong>{{ formatDate(selectedTaskInfo.taskTime) }}</div>

              <!-- itemToLists 渲染为列表 -->
              <div v-if="selectedTaskInfo.itemToList?.length > 0" style="margin-bottom: 10px;">
                <strong>备注项：</strong>
                <ul style="padding-left: 20px; margin-top: 10px;">
                  <li v-for="(item, index) in selectedTaskInfo.itemToList" :key="index" style="margin-bottom: 6px;">
                    <span style="font-weight: 500; color: #408af4;">{{ item.no }}.</span>
                    <span style="margin-left: 6px;">{{ item.itemContext }}</span>
                  </li>
                </ul>
              </div>


              <!-- 操作按钮 -->
              <div style="margin-top: 20px;display: flex;">
                <!-- <el-button type="success" @click="completeTask">完成任务</el-button> -->
                <!-- <el-button type="danger" @click="cancelTask">取消任务</el-button> -->
                <span style="background-color: #029b00;padding: 5px;display: flex;align-items: center;justify-content: center;width: 35px;height: 35px;border-radius: 50%;margin-right: 10px;">
                  <svg t="1753181409383" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3337" width="25" height="25"><path d="M371.153811 680.469289 188.351597 497.667076 127.459823 558.557827 371.153811 802.380751 893.479471 280.055091 832.589744 219.098848Z" p-id="3338" fill="#ffffff"></path></svg>
                </span>
                <span style="background-color: #d81e06;padding: 5px;display: flex;align-items: center;justify-content: center;width: 35px;height: 35px;border-radius: 50%;margin-left: 10px;">
                  <svg t="1753181370311" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2138" width="25" height="25"><path d="M745.6 928H294.4c-51.2 0-96-44.8-96-102.4V390.4c0-19.2 16-32 32-32s32 16 32 32v438.4c0 19.2 12.8 35.2 28.8 35.2h451.2c16 0 28.8-16 28.8-35.2V390.4c0-19.2 16-32 32-32s32 16 32 32v438.4c6.4 54.4-35.2 99.2-89.6 99.2zM905.6 291.2h-768c-19.2 0-35.2-16-35.2-35.2s16-35.2 35.2-35.2h768c19.2 0 35.2 16 35.2 35.2s-16 35.2-35.2 35.2zM649.6 163.2h-256c-19.2 0-35.2-16-35.2-35.2s16-35.2 35.2-35.2h256c19.2 0 35.2 16 35.2 35.2s-16 35.2-35.2 35.2z" fill="#ffffff" p-id="2139"></path><path d="M409.6 739.2c-19.2 0-35.2-16-35.2-35.2v-288c0-19.2 16-35.2 35.2-35.2s35.2 16 35.2 35.2v288c0 19.2-16 35.2-35.2 35.2zM633.6 739.2c-19.2 0-35.2-16-35.2-35.2v-288c0-19.2 16-35.2 35.2-35.2s35.2 16 35.2 35.2v288c0 19.2-16 35.2-35.2 35.2z" fill="#ffffff" p-id="2140"></path></svg>
                </span>
              </div>
            </div>
          </div>

          <div v-else>
            <el-empty description="无任务信息" />
          </div>
        </el-main>

      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getTaskList,getTaskInfo } from '@/api/task';
import {formatDate} from '@/utils/navigator'

export default {
  name: "taskPage",
  data() {
    return {
      showStatus: 1,
      page:1,
      limit:5,
      dateRange: [], // 存储起止日期，[startDate, endDate]
      searchText:'',
      taskList:[],
      selectedTaskId: null, //  选中任务卡的索引
      selectedTaskInfo: null,

    };
  },
  methods: {
    formatDate,
    setStatus(status) {
      this.showStatus = status;
    },
    getTaskList(params){
      return getTaskList(params).then(res=>{
        const data=res.data
        this.taskList=data.data.list
      }).catch(error=>{
        console.info(error)
      })
    },
    selectedTask(id){
      this.selectedTaskId=id
      //当选中了任务id之后需要查询对应的数据
      getTaskInfo({id:id}).then(res=>{
        const data = res.data;
        this.selectedTaskInfo = data.data; // 设置详情数据
      })
    }
  },
  async created(){
    await this.getTaskList({page:1,limit:10,status:1})
    //当加初次加载完成后，默认选中第一个任务
    if(this.taskList.length==0)return
    this.selectedTask(this.taskList[0].id)
  },
  watch:{
      async showStatus(newValue){
        this.taskList=[]
        await this.getTaskList({page:1,limit:10,status:newValue})
        this.selectedTaskId=null
        if(this.taskList.length==0)return
        this.selectedTask(this.taskList[0].id)
      }
  }
};
</script>

<style scoped>
/* 顶部状态按钮优化 */
.status-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  text-align: center;
  border-radius: 20px;
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
  align-items: flex-start; /* 内容靠左 */
  justify-content: center;
  font-weight: 500;
  padding: 16px; /* 加一点内边距 */
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

.load-label{
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
  background-color: rgb(234, 234, 234); /* 深色 */
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

</style>
