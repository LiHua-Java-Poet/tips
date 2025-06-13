<template>
    <el-container>
        <el-container>
            <el-aside width="175px" style="display: flex; flex-direction: column; justify-content: space-between;">
                <el-menu default-active="1" >
                    <el-menu-item index="1">
                        <div style="margin-left: 10px;">分享记录</div>
                    </el-menu-item>
                </el-menu>
                <div style="padding-left: 15PX; margin-bottom: 15px">
                    <div style="font-size: 14px;">空间使用</div>
                    <el-progress :percentage="1"></el-progress>
                    <div style="font-size: 14px;">321.45MB/5TB</div>
                </div>
            </el-aside>
            <el-main>
                <div style="display: flex;">
                    <el-button :disabled="isDisabled" type="primary" style="height: 35px;  padding: 0 20px 0 20px;  display: flex;justify-content: center;align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <svg t="1712828411382" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13728" width="20" height="20"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667zM885.333333 512c0 85.333333-29.866667 164.266667-78.933333 228.266667l-533.333333-514.133334c64-55.466667 149.333333-87.466667 238.933333-87.466666 204.8 0 373.333333 168.533333 373.333333 373.333333z m-746.666666 0c0-91.733333 34.133333-174.933333 87.466666-241.066667l535.466667 516.266667c-66.133333 59.733333-153.6 98.133333-251.733333 98.133333-202.666667 0-371.2-168.533333-371.2-373.333333z" fill="#ffffff" p-id="13729"></path></svg>
                            <span style="margin-left: 5px;">取消分享</span>
                        </div>
                    </el-button>
                </div>
                <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 15px;">
                    <el-breadcrumb-item>全部文件</el-breadcrumb-item>
                </el-breadcrumb>
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
                                <div  @click="handleClick(scope.row)" class="recycle-info">
                                    <div style="display: flex;align-items: center; ">
                                        <img style="height: 35px; width: 35px;" :src=scope.row.file_cover >
                                        <div class="item-name">{{ scope.row.file_name }}</div>
                                    </div>
                                    <div class="recycle-operation">
                                        <div style="display: flex;">
                                            <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;" @click="copyLink(scope.row.share_id)">
                                                <svg t="1712839141268" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14985" width="16" height="16"><path d="M861.866667 164.266667c-87.466667-87.466667-230.4-89.6-320-2.133334l-68.266667 68.266667c-12.8 12.8-12.8 32 0 44.8s32 12.8 44.8 0l68.266667-68.266667c64-61.866667 166.4-61.866667 230.4 2.133334 64 64 64 168.533333 2.133333 232.533333l-117.333333 119.466667c-34.133333 34.133333-81.066667 51.2-128 49.066666-46.933333-4.266667-91.733333-27.733333-119.466667-66.133333-10.666667-14.933333-29.866667-17.066667-44.8-6.4-14.933333 10.666667-17.066667 29.866667-6.4 44.8 40.533333 53.333333 100.266667 87.466667 166.4 91.733333h17.066667c59.733333 0 119.466667-23.466667 162.133333-68.266666l117.333333-119.466667c83.2-89.6 83.2-234.666667-4.266666-322.133333z" fill="#06A7FF" p-id="14986"></path><path d="M505.6 750.933333l-66.133333 68.266667c-64 61.866667-166.4 61.866667-230.4-2.133333-64-64-64-168.533333-2.133334-232.533334l117.333334-119.466666c34.133333-34.133333 81.066667-51.2 128-49.066667 46.933333 4.266667 91.733333 27.733333 119.466666 66.133333 10.666667 14.933333 29.866667 17.066667 44.8 6.4 14.933333-10.666667 17.066667-29.866667 6.4-44.8-40.533333-53.333333-100.266667-87.466667-166.4-91.733333-66.133333-4.266667-130.133333 19.2-177.066666 66.133333l-117.333334 119.466667c-85.333333 89.6-85.333333 234.666667 2.133334 322.133333 44.8 44.8 102.4 66.133333 162.133333 66.133334 57.6 0 115.2-21.333333 160-64l66.133333-68.266667c12.8-12.8 12.8-32 0-44.8-14.933333-10.666667-34.133333-10.666667-46.933333 2.133333z" fill="#06A7FF" p-id="14987"></path></svg>
                                                <div>复制链接</div>
                                            </div>
                                            <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;" @click="clearShare(scope.row.share_id)">
                                                <svg t="1712839182935" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15308" width="16" height="16"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667zM885.333333 512c0 85.333333-29.866667 164.266667-78.933333 228.266667l-533.333333-514.133334c64-55.466667 149.333333-87.466667 238.933333-87.466666 204.8 0 373.333333 168.533333 373.333333 373.333333z m-746.666666 0c0-91.733333 34.133333-174.933333 87.466666-241.066667l535.466667 516.266667c-66.133333 59.733333-153.6 98.133333-251.733333 98.133333-202.666667 0-371.2-168.533333-371.2-373.333333z" fill="#06A7FF" p-id="15309"></path></svg>
                                                <div>取消分享</div>
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
                            label="失效时间"
                            width="200" style="padding-top: 0;">
                            <template slot-scope="scope">{{ scope.row.lose_time }}</template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import apis from '../api/index'
    export default{
        data(){
            return{
                tableData: [],
                multipleSelection: []
            }
        },
        computed:{
            UserInfo(){
                return this.$store.state.UserInfo
            },
            isDisabled(){
                return !this.multipleSelection.length>0
            }
        },
        mounted(){
            this.loadDataList()
        },
        methods:{
            copyLink(share_id){
                apis.copyLink({
                    share_id:share_id
                })
                .then(response=>{
                    console.info(response.data.data)
                    try {  
                        navigator.clipboard.writeText(response.data.data);  
                        this.$message({
                            type: 'success',
                            message: '复制成功!'
                        }); 
                    } catch (err) {  
                        this.$message.error('复制失败,详细信息:'+err)
                    } 
                })
                .catch(error=>{
                    this.$message.error('复制失败,详细信息:'+error)
                })
                
            },
            clearShare(share_id){
                this.$confirm('此操作取消分享该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apis.clearShare({
                        share_id:share_id
                    })
                    .then(response=>{
                        console.info(response)
                        this.$message({
                            type: 'success',
                            message: '取消成功!'
                        });
                        this.loadDataList()
                    })
                    .catch(error=>{
                        console.info(error)
                    })
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消退出！'
                    });          
                });
            },
            handleSelectionChange(val){
                this.multipleSelection=val
            },
            async loadDataList(){
                this.$store.commit('updateLoad',true)
                await apis.getMyShareList({
                    'user_id':this.UserInfo.user_id
                })
                .then(res=>{
                    this.tableData=res.data.data
                })
                .catch(error=>{
                    console.info(error)
                })
                this.$store.commit('updateLoad',false)
            }
        }
    }
</script>

<style>

</style>