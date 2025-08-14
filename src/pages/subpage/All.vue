<template>
     <div id="app">
        <div class="layout-container">
            <div class="main-content">
                <div class="robot-board">
                    <div class="robot-avatar">
                        <img src="@/assets/ioc/index/robot.png"/>
                        <div style="font-size: small;color: rgb(114, 114, 114);">Tips提示您</div>
                    </div>
                    <!-- <div class="robot-message">
                        回顾近期的任务管理状况，我们发现存在一些值得关注并亟待改进的问题。首先，在最近创建的一批六个任务中，执行结果并不理想：其中一个被取消，仅有一个顺利完成，尚有一个正在进行中。更令人担忧的是，从更广泛的统计来看，截至目前已完成的任务总数仅为二十三个，但被取消的任务数量却高达十二个。这种高比例的取消率非常值得警惕，我们必须坚决避免随意取消任务的行为。 频繁取消不仅直接导致计划目标无法达成，浪费了前期投入的资源和精力，更会严重损害整体计划的连贯性和最终效果，甚至影响团队的执行信心。
                    </div> -->
                    <div class="robot-message">
                        你目前没有任何的计划或者排期
                    </div>
                </div>
                <el-divider content-position="left">从这里开始</el-divider>
                <div class="action-buttons">
                    <button class="action-button" @click="addTask('创建任务')" >
                        <i class="fas"></i> 创建任务
                    </button>
                    <button class="action-button"  @click="addPlan('创建计划')">
                        <i class="fas"></i> 创建计划
                    </button>
                    <button class="action-button">
                        <i class="fas"></i> 快捷小计
                    </button>
                </div>
                <el-divider content-position="left">最近的小记</el-divider>
                <div class="recent-notes">
                    <div 
                        v-for="(item, index) in messageList" 
                        :key="index"
                        class="note-item"
                    >
                        <div class="note-title">{{ item.sessionTitle }}</div>
                        <div class="note-content">{{ item.content }}</div>
                    </div>
                </div>
            </div>
                
            <div class="status-cards">
                <el-card class="box-card plan-status-card task-card">
                    <div class="plan-status-title">任务情况</div>
                    <div class="plan-status-item">
                        <span class="plan-icon blue">
                            <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" class="icon-img">
                        </span>
                        <span class="plan-text">进行中: <span class="plan-value">{{ userDataTo.processTask }}</span></span>
                    </div>
                    <div class="plan-status-item">
                        <span class="plan-icon green">
                            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" class="icon-img">
                        </span>
                        <span class="plan-text">已完成: <span class="plan-value">{{ userDataTo.finishTask }}</span></span>
                    </div>
                    <div class="plan-status-item">
                        <span class="plan-icon red">
                            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png" class="icon-img">
                        </span>
                        <span class="plan-text">已取消: <span class="plan-value">{{ userDataTo.cancelTask }}</span></span>
                    </div>
                    <span class="hint-text">要注意任务的完成情况喔。</span>
                </el-card>

                <el-card class="box-card plan-status-card plan-card">
                    <div class="plan-status-title">计划情况</div>
                    <div class="plan-status-item">
                        <span class="plan-icon blue">
                            <img src="https://cdn-icons-png.flaticon.com/512/3132/3132693.png" class="icon-img">
                        </span>
                        <span class="plan-text">进行中: <span class="plan-value">{{ userDataTo.processPlan }}</span></span>
                    </div>
                    <div class="plan-status-item">
                        <span class="plan-icon green">
                            <img src="https://cdn-icons-png.flaticon.com/512/190/190411.png" class="icon-img">
                        </span>
                        <span class="plan-text">已完成: <span class="plan-value">{{ userDataTo.finishPlan }}</span></span>
                    </div>
                    <div class="plan-status-item">
                        <span class="plan-icon red">
                            <img src="https://cdn-icons-png.flaticon.com/512/1828/1828665.png" class="icon-img">
                        </span>
                        <span class="plan-text">已取消: <span class="plan-value">{{ userDataTo.cancelPlan }}</span></span>
                    </div>
                    <span class="hint-text">取消的计划很多，注意保持喔。</span>
                </el-card>
            </div>
        </div>
        <!-- 侧边栏 -->
        <el-drawer
            :title="title"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose"
            size="600px"
        >
            <!-- 表单 -->
            <el-form ref="taskForm" :model="taskForm" :rules="rules" label-width="100px" style="padding-right: 30px;">

            <el-form-item label="任务名" prop="taskName">
                <el-input maxlength="20" v-model="taskForm.taskName" placeholder="请输入任务名" />
            </el-form-item>

            <el-form-item label="任务时间" prop="taskTime">
                <el-date-picker
                    v-model="taskForm.taskTime"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="备注内容" prop="itemToList">
                <div v-for="(item, index) in taskForm.itemToList" :key="index" style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span
                    style="
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
                    "
                    >
                    {{ item.no }}
                    </span>

                    <!-- 序号内容 -->
                    <el-input
                    v-model="item.itemContext"
                    placeholder="请输入内容"
                    style="flex: 1; margin-right: 10px;"
                    ></el-input>

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
                <AnnexFileUpload 
                :value="taskForm.annexFiles"
                @update="taskForm.annexFiles = $event"
                ref="AnnexFileUpload"/>
            </el-form-item>
            </el-form>

            <!-- 底部按钮 -->
            <div style="text-align:right; margin-top:20px;padding-right: 30px;">
                <el-button @click="handleClose()">取消</el-button>
                <el-button type="primary" @click="submitFormTask">保存</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script>
import { getUserDataTo } from '@/api/public';
import {getMessageList} from '@/api/collect'
import AnnexFileUpload from '@/components/AnnexFileUpload.vue';
import { getUniqueCode } from '@/api/public';
import { saveTask } from '@/api/task';

export default{
    name:'allPage',
    components:{
        AnnexFileUpload
    },
    data(){
        return{
            userDataTo:{
                cancelPlan: 0,
                cancelTask: 0,
                finishPlan: 0,
                finishTask: 0,
                processPlan: 0,
                processTask: 0,
                totalPlan: 0,
                totalTask: 0
            },
            drawer: false,
            direction: 'rtl',
            title:'',
            messageList:[], //记录的列表
            uniqueCode:null,
            taskForm: {
                taskName: "",
                taskTime: null,
                itemToList: [],
                taskType: 1,
                annexFiles:[]
            },
            rules: {
                task_name: [{ required: true, message: "请输入任务名", trigger: "blur" }],
                status: [{ required: true, message: "请选择状态", trigger: "change" }]
            }
        }
    },
    created(){
        getUserDataTo().then(res=>{
            this.userDataTo=res.data.data
        }).catch(err=>{
            console.info(err)
        })
        getMessageList({
            page:1,
            limit:5
        }).then(res=>{
            this.messageList=res.data.data.list
        }).catch(err=>{
            console.info(err)
        })
    },
    methods:{
        handleClose(){
            this.$confirm('确认关闭？')
            .then(() => {
                Object.assign(this.taskForm, {
                    taskName: "",
                    taskTime: null,
                    itemToList: [],
                    taskType: 1,
                    annexFiles:[]
                });
                this.drawer=false
                    //清空一遍子组件的上传内容
                this.$refs.AnnexFileUpload.cleanFileList();
            })
            .catch(() => {return});
        },
        async addTask(name){
            //获取到唯一码作为上传使用的
            await getUniqueCode().then(res=>{
                this.uniqueCode=res.data.data
            })
            this.taskForm.taskTime = new Date(); 
            this.title=name
            this.drawer=true
            //初始化一遍时间
        },
        submitFormTask(){
            const payload = {
                ...this.taskForm,
                uniqueCode: this.uniqueCode  // 这里加新属性
            }
            payload.taskTime=Math.floor(payload.taskTime.getTime() / 1000);
            saveTask(payload).then(res=>{
                if(res.data.code==200){
                    this.$message.success('新增成功')
                    Object.assign(this.taskForm, {
                        taskName: "",
                        taskTime: null,
                        itemToList: [],
                        taskType: 1,
                        annexFiles:[]
                    });
                    this.drawer=false
                        //清空一遍子组件的上传内容
                    this.$refs.AnnexFileUpload.cleanFileList();
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
    }
}
</script>

<style>
        .layout-container {
            display: flex;
            gap: 15px;
            /* min-height: 65vh; */
            align-items: flex-start;
        }
        
        .main-content {
            flex: 1;
            background: white;
            border-radius: 6px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            padding: 15px 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background: linear-gradient(145deg, #ffffff, #f9fbfd);
            border: 1px solid #e1e8ed;
            position: relative;
            overflow: hidden;
        }
        
        .status-cards {
            width: 300px;
            display: flex;
            flex-direction: column;
            gap: 15px;
            height: auto; /* ✅ 高度由内容决定 */
        }
        
        .box-card {
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            border: none;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .box-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
        }
        
        .plan-status-card {
            padding: 5px;
        }
        
        .plan-status-title {
            font-size: 18px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 15px;
            padding-bottom: 7px;
            border-bottom: 1px solid #eee;
            display: flex;
            align-items: center;
            position: relative;
        }
        
        .plan-status-title::before {
            content: "";
            display: inline-block;
            width: 5px;
            height: 20px;
            background: #3498db;
            border-radius: 10px;
            margin-right: 10px;
        }
        
        .plan-card .plan-status-title::before {
            background: #9b59b6;
        }
        
        .plan-status-item {
            display: flex;
            align-items: center;
            margin-bottom: 7px;
        }
        
        .plan-icon {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            transition: transform 0.3s ease;
        }
        
        .plan-status-item:hover .plan-icon {
            transform: scale(1.1);
        }
        
        .plan-icon.blue {
            background-color: #e6f7ff;
        }
        
        .plan-icon.green {
            background-color: #e6ffed;
        }
        
        .plan-icon.red {
            background-color: #fff1f0;
        }
        
        .icon-img {
            width: 20px;
            height: 20px;
        }
        
        .red .icon-img {
            width: 18px;
            height: 18px;
        }
        
        .plan-text {
            font-size: 16px;
            color: #34495e;
            flex: 1;
        }
        
        .plan-value {
            font-weight: bold;
            font-size: 17px;
            margin-left: 5px;
        }
        
        .blue .plan-value {
            color: #3498db;
        }
        
        .green .plan-value {
            color: #2ecc71;
        }
        
        .red .plan-value {
            color: #e74c3c;
        }
        
        .hint-text {
            color: #95a5a6;
            font-style: italic;
            font-size: 14px;
            display: block;
            padding: 15px 0 5px;
            border-top: 1px dashed #eee;
            margin-top: 10px;
        }
        
        /* 响应式设计 */
        @media (max-width: 992px) {
            .layout-container {
                flex-direction: column;
            }
            
            .status-cards {
                width: 100%;
                flex-direction: row;
                flex-wrap: wrap;
            }
            
            .status-cards .box-card {
                width: calc(50% - 12px);
            }
            
            .dashboard-header h1 {
                font-size: 1.8rem;
            }
            
            .placeholder-stats {
                flex-wrap: wrap;
            }
        }
        
        @media (max-width: 768px) {
            .status-cards .box-card {
                width: 100%;
            }
            
            .dashboard-header h1 {
                font-size: 1.6rem;
            }
            
            .dashboard-header p {
                font-size: 1rem;
            }
            
            .main-content {
                padding: 25px 20px;
            }
            
            .main-content-placeholder h2 {
                font-size: 1.5rem;
            }
            
            .stat-circle {
                width: 100px;
                height: 100px;
            }
            
            .stat-value {
                font-size: 22px;
            }
        }
        .robot-board {
            display: flex;
            align-items: flex-start; /* 保证头像在顶部对齐 */
            gap: 25px;
        }

        .robot-avatar {
            flex-shrink: 0; /* 防止被压缩 */
            align-self: flex-start; /* 保证一直在最上方 */
            text-align: center; /* Tips 提示文字居中 */
        }

        .robot-avatar img {
            width: 90px;             /* 图片宽度 */
            height: auto;            /* 高度自动按比例 */
        }

        .robot-message {
            background-color: #f0f0f0;   /* 气泡背景色 */
            padding: 10px 14px;
            border-radius: 12px;
            line-height: 1.4;
            max-width: 80%;           /* 防止太宽 */
            position: relative;
            text-align: left;  /* 文字左对齐 */
        }

        /* 气泡小三角 */
        .robot-message::before {
            content: '';
            position: absolute;
            left: -8px;
            top: 14px;
            width: 0;
            height: 0;
            border-top: 8px solid transparent;
            border-right: 8px solid #f0f0f0;
            border-bottom: 8px solid transparent;
        }

        /* 按钮区域调整为左对齐 */
        .action-buttons {
            display: flex;
            gap: 20px;
            margin-top: 10px;
            width: 100%;
            justify-content: flex-start; /* ✅ 左对齐 */
        }
        
    .action-button {
        background: rgba(64, 158, 255); /* 固定按钮背景色（蓝色） */
        color: white;
        border: none;
        padding: 6px 14px;
        border-radius: 4px; /* 方圆角效果 */
        font-size: 16px;
        font-weight: 400;
        cursor: pointer;
        transition: background 0.3s ease;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: none; /* 去掉阴影 */
    }
        
        .action-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(114, 114, 114, 0.4);
        }
        
        .action-button i {
            font-size: 18px;
        }

    .recent-notes {
        width: 100%;
        margin-top: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .note-item {
        background: #ffffff;
        padding: 12px 16px;
        border-radius: 8px;
        text-align: left; /* 确保所有文本靠左 */
        border: 1px solid #e6e6e6;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        transition: all 0.2s ease;
    }

    .note-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        border-color: #d0d0d0;
    }

    /* 标题样式 */
    .note-title {
        font-size: 15px;
        font-weight: bold;
        color: #2c3e50;
        margin-bottom: 4px;
    }

    /* 内容样式 */
    .note-content {
        font-size: 14px;
        color: #555;
        line-height: 1.5;
    }

</style>