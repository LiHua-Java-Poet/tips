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
            <el-card class="task-card" v-for="(item, index) in taskList" :key="index">
                <div>
                  {{ item.taskName }}
                </div>
                <div>
                  {{ formatDate(item.taskTime) }}
                </div>
            </el-card>
            <div class="load-label">
              加载更多
            </div>
      </el-aside>
      <el-container>
        <el-main style="background-color: rgb(255, 255, 255);border-radius: 10px;">
            
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
import { getTaskList } from '@/api/task';
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
    };
  },
  methods: {
    formatDate,
    setStatus(status) {
      this.showStatus = status;
    },
    getTaskList(params){
      getTaskList(params).then(res=>{
        const data=res.data
        this.taskList=data.data.list
      }).catch(error=>{
        console.info(error)
      })
    }
  },
  created(){
    this.getTaskList({page:1,limit:10,status:1})
  },
  watch:{
      showStatus(newValue){
        this.taskList=[]
        this.getTaskList({page:1,limit:10,status:newValue})
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

</style>
