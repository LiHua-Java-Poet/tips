<template>
    <div>
        <div style="  display: flex;justify-content: space-between; align-items: center; padding: 0px 50px 0px 50px;" >
            <el-card class="box-card plan-status-card">
                <div class="plan-status-title">任务情况</div>
                <div class="plan-status-item">
                    <span class="plan-icon blue">
                        <svg t="1750238290658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2498" width="24" height="24"><path d="M329.142857 512h512c21.942857 0 36.571429 14.628571 36.571429 36.571429s-14.628571 36.571429-36.571429 36.571428h-512c-21.942857 0-36.571429-14.628571-36.571428-36.571428s14.628571-36.571429 36.571428-36.571429z m-292.571428 0c21.942857 0 36.571429 14.628571 36.571428 36.571429S58.514286 585.142857 36.571429 585.142857 0 570.514286 0 548.571429 14.628571 512 36.571429 512z m146.285714 0c21.942857 0 36.571429 14.628571 36.571428 36.571429s-14.628571 36.571429-36.571428 36.571428-36.571429-14.628571-36.571429-36.571428 14.628571-36.571429 36.571429-36.571429z m687.542857 36.571429L533.942857 212.114286c-14.628571-14.628571-14.628571-36.571429 0-51.2 14.628571-14.628571 43.885714-14.628571 58.514286 0L950.857143 519.314286c7.314286 7.314286 7.314286 14.628571 7.314286 29.257143 0 7.314286 0 21.942857-7.314286 29.257142l-358.4 358.4c-14.628571 14.628571-36.571429 14.628571-51.2 0-14.628571-14.628571-14.628571-36.571429 0-51.2l329.142857-336.457142z" p-id="2499" fill="#1296db"></path></svg>
                    </span>
                    <span class="plan-text">进行中: {{ userDataTo.processTask }}</span>
                </div>
                <div class="plan-status-item">
                    <span class="plan-icon green">
                        <svg t="1750238509869" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6540" width="24" height="24"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z" fill="#029b00" p-id="6541"></path><path d="M718.08 329.6l-293.76 294.4-120.96-120.96a32 32 0 0 0-47.36 45.44l143.36 143.36a32 32 0 0 0 45.44 0l316.8-316.8a32 32 0 0 0-45.44-45.44z" fill="#029b00" p-id="6542"></path></svg>
                    </span>
                    <span class="plan-text">已完成: {{ userDataTo.finishTask }}</span>
                </div>
                <div class="plan-status-item">
                    <span class="plan-icon red">
                            <svg t="1750238444907" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4827" width="24" height="24"><path d="M679.936 346.112l-153.6 151.552-153.6-151.552-26.624 26.624 151.552 153.6-151.552 153.6 26.624 26.624 153.6-151.552 153.6 151.552 28.672-26.624-153.6-153.6 153.6-153.6z" fill="#d81e06" p-id="4828"></path><path d="M512 1021.952c116.736 0 223.232-38.912 309.248-104.448 4.096-4.096 6.144-8.192 6.144-14.336 0-12.288-10.24-22.528-22.528-22.528-6.144 0-12.288 2.048-16.384 6.144C710.656 942.08 614.4 976.896 512 976.896c-256 0-462.848-206.848-462.848-460.8C49.152 260.096 256 55.296 512 55.296c256 0 462.848 206.848 462.848 460.8 0 77.824-18.432 151.552-53.248 215.04 0 2.048-2.048 4.096-2.048 6.144 0 12.288 10.24 22.528 22.528 22.528 10.24 0 18.432-6.144 20.48-14.336 40.96-69.632 61.44-149.504 61.44-233.472C1024 231.424 794.624 2.048 512 2.048S0 231.424 0 512s229.376 509.952 512 509.952z" fill="#d81e06" p-id="4829"></path></svg>
                    </span>
                    <span class="plan-text">已取消: {{ userDataTo.cancelTask }}</span>
                </div>
                <div class="plan-status-item">
                    <span class="hint-text">要注意任务的完成情况喔。</span>
                </div>
            </el-card>

            <el-card class="box-card plan-status-card">
                <div class="plan-status-title">计划情况</div>
                <div class="plan-status-item">
                    <span class="plan-icon blue">
                        <svg t="1750238290658" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2498" width="24" height="24"><path d="M329.142857 512h512c21.942857 0 36.571429 14.628571 36.571429 36.571429s-14.628571 36.571429-36.571429 36.571428h-512c-21.942857 0-36.571429-14.628571-36.571428-36.571428s14.628571-36.571429 36.571428-36.571429z m-292.571428 0c21.942857 0 36.571429 14.628571 36.571428 36.571429S58.514286 585.142857 36.571429 585.142857 0 570.514286 0 548.571429 14.628571 512 36.571429 512z m146.285714 0c21.942857 0 36.571429 14.628571 36.571428 36.571429s-14.628571 36.571429-36.571428 36.571428-36.571429-14.628571-36.571429-36.571428 14.628571-36.571429 36.571429-36.571429z m687.542857 36.571429L533.942857 212.114286c-14.628571-14.628571-14.628571-36.571429 0-51.2 14.628571-14.628571 43.885714-14.628571 58.514286 0L950.857143 519.314286c7.314286 7.314286 7.314286 14.628571 7.314286 29.257143 0 7.314286 0 21.942857-7.314286 29.257142l-358.4 358.4c-14.628571 14.628571-36.571429 14.628571-51.2 0-14.628571-14.628571-14.628571-36.571429 0-51.2l329.142857-336.457142z" p-id="2499" fill="#1296db"></path></svg>
                    </span>
                    <span class="plan-text">进行中: {{ userDataTo.processPlan }}</span>
                </div>
                <div class="plan-status-item">
                    <span class="plan-icon green">
                        <svg t="1750238509869" class="icon" viewBox="0 0 1026 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6540" width="24" height="24"><path d="M512 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448z" fill="#029b00" p-id="6541"></path><path d="M718.08 329.6l-293.76 294.4-120.96-120.96a32 32 0 0 0-47.36 45.44l143.36 143.36a32 32 0 0 0 45.44 0l316.8-316.8a32 32 0 0 0-45.44-45.44z" fill="#029b00" p-id="6542"></path></svg>
                    </span>
                    <span class="plan-text">已完成: {{ userDataTo.finishPlan }}</span>
                </div>
                <div class="plan-status-item">
                    <span class="plan-icon red">
                            <svg t="1750238444907" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4827" width="24" height="24"><path d="M679.936 346.112l-153.6 151.552-153.6-151.552-26.624 26.624 151.552 153.6-151.552 153.6 26.624 26.624 153.6-151.552 153.6 151.552 28.672-26.624-153.6-153.6 153.6-153.6z" fill="#d81e06" p-id="4828"></path><path d="M512 1021.952c116.736 0 223.232-38.912 309.248-104.448 4.096-4.096 6.144-8.192 6.144-14.336 0-12.288-10.24-22.528-22.528-22.528-6.144 0-12.288 2.048-16.384 6.144C710.656 942.08 614.4 976.896 512 976.896c-256 0-462.848-206.848-462.848-460.8C49.152 260.096 256 55.296 512 55.296c256 0 462.848 206.848 462.848 460.8 0 77.824-18.432 151.552-53.248 215.04 0 2.048-2.048 4.096-2.048 6.144 0 12.288 10.24 22.528 22.528 22.528 10.24 0 18.432-6.144 20.48-14.336 40.96-69.632 61.44-149.504 61.44-233.472C1024 231.424 794.624 2.048 512 2.048S0 231.424 0 512s229.376 509.952 512 509.952z" fill="#d81e06" p-id="4829"></path></svg>
                    </span>
                    <span class="plan-text">已取消: {{ userDataTo.cancelPlan }}</span>
                </div>
                <div class="plan-status-item">
                    <span class="hint-text">取消的计划很多，注意保持喔。</span>
                </div>
            </el-card>

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
.box-card {
    background-color: rgb(255, 255, 255);
    height: 30vh;
    width: 45%;
}
.plan-status-card {
  padding: 20px;
}

.plan-status-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

.plan-status-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.plan-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.plan-icon svg {
  width: 20px;
  height: 20px;
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

.plan-text {
  font-size: 16px;
  color: #333;
}
.hint-text{
    color: #8b8b8b;
}

</style>