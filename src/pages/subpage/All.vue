<template>
     <div id="app">
        <div class="layout-container">
            <div class="main-content">
                <div class="robot-board">
                    <div class="robot-avatar">
                        <img src="@/assets/ioc/index/robot.png"/>
                        <div style="font-size: small;color: rgb(114, 114, 114);">Tips提示您</div>
                    </div>
                    <div class="robot-message">
                        回顾近期的任务管理状况，我们发现存在一些值得关注并亟待改进的问题。首先，在最近创建的一批六个任务中，执行结果并不理想：其中一个被取消，仅有一个顺利完成，尚有一个正在进行中。更令人担忧的是，从更广泛的统计来看，截至目前已完成的任务总数仅为二十三个，但被取消的任务数量却高达十二个。这种高比例的取消率非常值得警惕，我们必须坚决避免随意取消任务的行为。 频繁取消不仅直接导致计划目标无法达成，浪费了前期投入的资源和精力，更会严重损害整体计划的连贯性和最终效果，甚至影响团队的执行信心。
                    </div>
                </div>
                <el-divider content-position="left">从这里开始</el-divider>
                <div class="action-buttons">
                    <button class="action-button task">
                        <i class="fas fa-plus"></i> 创建任务
                    </button>
                    <button class="action-button">
                        <i class="fas fa-project-diagram"></i> 创建计划
                    </button>
                </div>
                <el-divider content-position="left">最近的小记</el-divider>
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
    </div>
</template>

<script>
import { getUserDataTo } from '@/api/public';
export default{
    name:'allPage',
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
            }
        }
    },
    created(){
        getUserDataTo().then(res=>{
            this.userDataTo=res.data.data
        }).catch(err=>{
            console.info(err)
        })
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
        
        .task-card .plan-status-title::before {
            background: #3498db;
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
            display: flex;           /* 左右布局 */
            align-items: flex-start;     /* 垂直居中 */
            gap: 25px;               /* 图片与文字间距 */
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

            /* 按钮区域 */
        .action-buttons {
            display: flex;
            gap: 20px;
            margin-top: 10px;
            width: 100%;
            justify-content: center;
        }
        
        .action-button {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            box-shadow: 0 5px 15px rgba(67, 97, 238, 0.3);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .action-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 20px rgba(67, 97, 238, 0.4);
        }
        
        .action-button i {
            font-size: 18px;
        }
        
        .action-button.task {
            background: linear-gradient(135deg, var(--success-color), #27ae60);
            box-shadow: 0 5px 15px rgba(46, 204, 113, 0.3);
        }
        
        .action-button.task:hover {
            box-shadow: 0 8px 20px rgba(46, 204, 113, 0.4);
        }

</style>