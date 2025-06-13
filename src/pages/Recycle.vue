<template>
    <el-container>
        <el-container>
            <el-aside width="175px" style="display: flex; flex-direction: column; justify-content: space-between;">
                <el-menu default-active="1" >
                    <el-menu-item index="1">
                        <div style="margin-left: 10px;">删除的文件</div>
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
                    <el-button type="success" @click="updateValue(true)"  style="height: 35px; padding: 0 20px 0 20px; display: flex;justify-content: center;align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <svg t="1712828515687" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13950" width="20" height="20"><path d="M934.4 206.933333c-17.066667-4.266667-34.133333 6.4-38.4 23.466667l-23.466667 87.466667C797.866667 183.466667 654.933333 96 497.066667 96 264.533333 96 74.666667 281.6 74.666667 512s189.866667 416 422.4 416c179.2 0 339.2-110.933333 398.933333-275.2 6.4-17.066667-2.133333-34.133333-19.2-40.533333-17.066667-6.4-34.133333 2.133333-40.533333 19.2-51.2 138.666667-187.733333 232.533333-339.2 232.533333C298.666667 864 138.666667 706.133333 138.666667 512S300.8 160 497.066667 160c145.066667 0 277.333333 87.466667 330.666666 217.6l-128-36.266667c-17.066667-4.266667-34.133333 6.4-38.4 23.466667-4.266667 17.066667 6.4 34.133333 23.466667 38.4l185.6 49.066667c2.133333 0 6.4 2.133333 8.533333 2.133333 6.4 0 10.666667-2.133333 17.066667-4.266667 6.4-4.266667 12.8-10.666667 14.933333-19.2l49.066667-185.6c0-17.066667-8.533333-34.133333-25.6-38.4z" fill="#ffffff" p-id="13951"></path></svg>
                            <span style="margin-left: 5px;">还原</span>
                        </div>
                    </el-button>
                    <el-button type="danger"  :disabled="isDisabled" style="height: 35px; padding: 0 20px 0 20px; display: flex;justify-content: center;align-items: center;">
                        <div style="display: flex; align-items: center;">
                            <svg t="1712822811614" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13509" width="20" height="20"><path d="M874.666667 241.066667h-202.666667V170.666667c0-40.533333-34.133333-74.666667-74.666667-74.666667h-170.666666c-40.533333 0-74.666667 34.133333-74.666667 74.666667v70.4H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h53.333334V853.333333c0 40.533333 34.133333 74.666667 74.666666 74.666667h469.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V305.066667H874.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM416 170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h170.666666c6.4 0 10.666667 4.266667 10.666667 10.666667v70.4h-192V170.666667z m341.333333 682.666666c0 6.4-4.266667 10.666667-10.666666 10.666667H277.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V309.333333h490.666666V853.333333z" fill="#ffffff" p-id="13510"></path><path d="M426.666667 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32zM597.333333 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32z" fill="#ffffff" p-id="13511"></path></svg>
                            <span style="margin-left: 5px;">批量删除</span>
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
                                        <img style="height: 35px; width: 35px;" :src=scope.row.file_cover>
                                        <div class="item-name">{{ scope.row.file_name }}</div>
                                    </div>
                                    <div class="recycle-operation">
                                        <div style="display: flex;">
                                            <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                                <svg t="1712838065667" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14160" width="16" height="16"><path d="M934.4 206.933333c-17.066667-4.266667-34.133333 6.4-38.4 23.466667l-23.466667 87.466667C797.866667 183.466667 654.933333 96 497.066667 96 264.533333 96 74.666667 281.6 74.666667 512s189.866667 416 422.4 416c179.2 0 339.2-110.933333 398.933333-275.2 6.4-17.066667-2.133333-34.133333-19.2-40.533333-17.066667-6.4-34.133333 2.133333-40.533333 19.2-51.2 138.666667-187.733333 232.533333-339.2 232.533333C298.666667 864 138.666667 706.133333 138.666667 512S300.8 160 497.066667 160c145.066667 0 277.333333 87.466667 330.666666 217.6l-128-36.266667c-17.066667-4.266667-34.133333 6.4-38.4 23.466667-4.266667 17.066667 6.4 34.133333 23.466667 38.4l185.6 49.066667c2.133333 0 6.4 2.133333 8.533333 2.133333 6.4 0 10.666667-2.133333 17.066667-4.266667 6.4-4.266667 12.8-10.666667 14.933333-19.2l49.066667-185.6c0-17.066667-8.533333-34.133333-25.6-38.4z" fill="#06A7FF" p-id="14161"></path></svg>
                                                <div @click="restoreFile(scope.row.file_name,scope.row.file_id)">还原</div>
                                            </div>
                                            <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                                <svg t="1712838240758" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14610" width="16" height="16"><path d="M874.666667 241.066667h-202.666667V170.666667c0-40.533333-34.133333-74.666667-74.666667-74.666667h-170.666666c-40.533333 0-74.666667 34.133333-74.666667 74.666667v70.4H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h53.333334V853.333333c0 40.533333 34.133333 74.666667 74.666666 74.666667h469.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V305.066667H874.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM416 170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h170.666666c6.4 0 10.666667 4.266667 10.666667 10.666667v70.4h-192V170.666667z m341.333333 682.666666c0 6.4-4.266667 10.666667-10.666666 10.666667H277.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V309.333333h490.666666V853.333333z" fill="#06A7FF" p-id="14611"></path><path d="M426.666667 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32zM597.333333 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32z" fill="#06A7FF" p-id="14612"></path></svg>
                                                <div @click="deleteFile(scope.row.file_name,scope.row.file_id)">删除</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            label="修改时间"
                            width="200" style="padding-top: 0;">
                            <template slot-scope="scope">{{ scope.row.last_update_time }}</template>
                        </el-table-column>
                        <el-table-column
                        prop="fileSize"
                        label="大小"
                        show-overflow-tooltip style="padding-top: 0;">
                        <template slot-scope="scope">{{ scope.row.file_size }}</template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    import api from '../api/index'
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
        },
        mounted(){
            this.getRecycleList()
        },
        methods:{
            restoreFile(file_name,file_id){
                this.$confirm('你确定要还原：'+file_name+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    api.RestoreFile({
                        file_id:file_id
                    })
                    .then(response=>{
                        console.info(response)
                        this.$message({
                            type: 'success',
                            message: '还原成功!'
                        });
                        this.getRecycleList()
                    })
                    .catch(error=>{
                        console.info(error)
                        this.$message.error('还原失败：'+error)
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消还原'
                    });
                });
            },
            deleteFile(file_name,file_id){
                this.$confirm('你确定要彻底删除：'+file_name+'?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                .then(() => {
                    api.DeleteFile({
                        file_id:file_id
                    })
                    .then(resopnse=>{
                        console.info(resopnse)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getRecycleList()
                    })
                    .catch(error=>{
                        console.info(error)
                    })
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            async getRecycleList(){
                this.$store.commit('updateLoad',true)
                await api.getRecycleList({
                    'user_id':this.UserInfo.user_id
                })
                .then(res=>{
                    console.info(res)
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
    .recycle-info{
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .recycle-operation{
        display: none; /* 初始设置 B 不可见 */
    }
    .recycle-info:hover .recycle-operation {
        display: block; /* 鼠标移动到容器上时，B 可见 */
    }
    .item-name{
        cursor: pointer;
    }
    .item-name:hover{
        color: rgb(6, 167, 255);
    }
    .el-table .el-table__cell {
        padding: 4px 0;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;
    }

</style>