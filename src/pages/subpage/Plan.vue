<template>
  <el-container style="height: 100%;">
    <el-header >
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
      <el-aside width="350px" class="aside-custom">
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
            <div class="plan-scroll-wrapper">
              <el-card class="plan-card" 
                v-for="(item, index) in planList"
                :key="index"
              >
                <div class="card-body">
                  <el-image
                    class="card-icon"
                    :src="item.icon"
                    :alt="item.planName"
                    fit="cover"
                    lazy
                    :preview-src-list="[item.icon]"
                  />
                  <div class="card-content">
                    <div class="card-title">{{ item.planName }}</div>
                    <div class="card-description">{{ item.description }}</div>
                    <div class="card-progress">
                      进度：{{ item.taskProgress }} / {{ item.taskTotal }}
                    </div>
                    <div class="card-info">{{ item.planInfo }}</div>
                  </div>
                </div>
              </el-card>
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
import { getPlanList } from '@/api/plan';

export default {
  name: "planPage",
  data() {
    return {
      showStatus: 1,
      dateRange: [], // 存储起止日期，[startDate, endDate]
      searchText:'',
      planList:[],
      selectedPlanId:undefined,
    };
  },
  methods: {
    setStatus(status) {
      this.showStatus = status;
    },
    getPlanList(params){
      return getPlanList(params).then(res=>{
        const data=res.data
        this.planList=data.data.list
      }).catch(error=>{
        console.info(error)
      })
    },
  
  },
  async created(){
    await this.getPlanList({page:1,limit:10,status:1})
    //当加初次加载完成后，默认选中第一个任务
    if(this.planList.length==0)return
  },
  watch:{
      async showStatus(newValue){
        this.planList=[]
        await this.getPlanList({page:1,limit:10,status:newValue})
        this.selectedplanId=null
        if(this.planList.length==0)return
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
  width: 95%;
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
  align-items: flex-start; /* 顶部对齐 */
  height: 72px; /* 卡片内容区域统一高度 */
  overflow: hidden;
}

.card-icon {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  margin-right: 12px;
  object-fit: cover;
  flex-shrink: 0;
}

.card-content {
  flex: 1;
  overflow: hidden; /* 关键：限制内容宽度 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
.card-title {
  font-weight: bold;
  color: #333;
}

.card-progress {
  color: #409eff;
}
.card-info {
  color: #999;
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
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%; /* 填满容器高度 */
}

.plan-scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  padding-right: 6px; /* 预留空间防止遮挡 */
  scrollbar-width: none;           /* Firefox */
  -ms-overflow-style: none;        /* IE */
}

/* Chrome */
.plan-scroll-wrapper::-webkit-scrollbar {
  width: 6px;            /* 始终保留宽度，防止跳动 */
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

</style>
