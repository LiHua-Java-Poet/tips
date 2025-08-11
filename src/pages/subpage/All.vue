<template>
     <div id="app">
        <div class="layout-container">
            <div class="main-content">
                你的任务完成量
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
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
            padding: 40px;
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
</style>