<template>
    <div>
        <el-container>
            <el-header style="padding-left: 15%;background-color: rgb(5, 161, 245);display: flex;align-items: center;">
                <div style="font-size: 28px;font-weight: bold;color: rgb(255, 255, 255); display: flex; align-items: center;">
                    <img src="../../assets/favicon2.png" style="height: 50px; width: 50px; margin-right: 10px;">
                    <div>
                        在线网盘
                    </div>
                </div>
            </el-header>
            <el-main style="padding-left: 15%;padding-right: 20%">
                <div style="display: flex;border-bottom: 1px solid rgb(99, 109, 138,0.6);padding-bottom: 15px;">
                    <img style="height: 50px; width: 50px;border-radius: 50%;" :src=pageData.head_portrait>
                    <div style="margin-left: 20px;color: rgb(99, 109, 138);">
                        <div style="display: flex;">
                            <div>
                                {{ pageData.userName }}
                            </div>
                            <div style="margin-left: 30px;font-size: 13px;">
                                分享于：{{ pageData.share_time }}
                            </div>
                        </div>
                        <div style="font-size: 13px;margin-top: 10px;">
                            分享文件：{{ pageData.file_name }}
                        </div>
                    </div>
                </div>
                <div>
                <el-table 
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection"  width="55" style="padding-top: 0;"></el-table-column>
                    <el-table-column label="文件名" style="padding-top: 0;">
                        <template slot-scope="scope" style="padding-top: 0;">  
                            <div class="recycle-info">
                                <div style="display: flex;align-items: center;">
                                    <img style="height: 35px; width: 35px; border-radius: 5px;" :src="scope.row.file_cover">
                                    <div class="item-name">{{ scope.row.file_name }}</div>
                                </div>
                                <div class="recycle-operation">
                                    <div style="display: flex;">
                                        <div v-if="scope.row.folder_type==0||scope.row.folder_type==null" style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                            <svg t="1712839558223" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16047" width="16" height="16"><path d="M896 672c-17.066667 0-32 14.933333-32 32v128c0 6.4-4.266667 10.666667-10.666667 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667v-128c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v128c0 40.533333 34.133333 74.666667 74.666667 74.666667h682.666666c40.533333 0 74.666667-34.133333 74.666667-74.666667v-128c0-17.066667-14.933333-32-32-32z" fill="#06A7FF" p-id="16048"></path><path d="M488.533333 727.466667c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l213.333333-213.333334c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-157.866667 157.866667V170.666667c0-17.066667-14.933333-32-32-32s-34.133333 14.933333-34.133333 32v456.533333L322.133333 469.333333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l211.2 213.333334z" fill="#06A7FF" p-id="16049"></path></svg>
                                            <div @click="downloadFile(scope.row.share_id,scope.row.code)">下载</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="分享时间"
                        width="200" style="padding-top: 0;">
                        <template slot-scope="scope">{{ scope.row.share_time }}</template>
                    </el-table-column>
                    <el-table-column
                        label="大小"
                        width="200" style="padding-top: 0;">
                        <template slot-scope="scope">{{ scope.row.file_size }}</template>
                    </el-table-column>
                </el-table>
            </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
import apis from '../../api';

    export default{
        data(){
            return{
                share_id:'',
                code:'',
                pageData:null,
                tableData:[],
                multipleTable:[]
            }
        },
        mounted(){
            this.loadData(this.$route.query.share_id,this.$route.query.code)
        },
        methods:{
            async loadData(share_id,code){
                this.$store.commit('updateLoad',true)
                await apis.getShareContent({
                    share_id:share_id,
                    code:code
                })
                .then(res=>{
                    this.pageData={
                        userName:res.data.data[0].userName,
                        share_time:res.data.data[0].share_time,
                        head_portrait:res.data.data[0].head_portrait,
                        file_name:res.data.data[0].file_name,
                    }
                    this.tableData=res.data.data
                })
                .catch(error=>{
                    this.$message.error(error)
                })
                this.$store.commit('updateLoad',false)
            },
            downloadFile(share_id,code){
                try {
                    // 发送GET请求到后端下载API  
                    const downloadUrl = `http://localhost:8083/Share/shareFileDownload?share_id=${share_id}&code=${code}`;  
                    // 创建一个新的 a 标签  
                    const a = document.createElement('a');
                    a.href = downloadUrl; // 设置下载链接  
                    a.style.display = 'none'; // 隐藏 a 标签  
            
                    // 添加到 DOM 中  
                    document.body.appendChild(a);  
            
                    // 触发点击事件  
                    a.click();  
            
                    // 然后从 DOM 中移除  
                    document.body.removeChild(a);  
                } catch (error) {  
                    console.error('下载失败:', error);  
                }  
            }
        }
    }
</script>