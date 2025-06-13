<template>
    <div>
        <div>
        <div style="display: flex;">
            <el-button type="primary" style="height: 35px;  padding: 0 20px 0 20px;  display: flex;justify-content: center;align-items: center;">
                <div style="display: flex; align-items: center;">
                    <svg t="1712821231517" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13084" width="20" height="20"><path d="M896 629.333333c-17.066667 0-32 14.933333-32 32v170.666667c0 6.4-4.266667 10.666667-10.666667 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667v-170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v170.666667c0 40.533333 34.133333 74.666667 74.666667 74.666667h682.666666c40.533333 0 74.666667-34.133333 74.666667-74.666667v-170.666667c0-17.066667-14.933333-32-32-32z" fill="#ffffff" p-id="13085"></path><path d="M322.133333 407.466667l157.866667-157.866667V704c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V247.466667l157.866667 157.866666c6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334c12.8-12.8 12.8-32 0-44.8l-213.333333-213.333333c-12.8-12.8-32-12.8-44.8 0l-213.333334 213.333333c-12.8 12.8-12.8 32 0 44.8 10.666667 12.8 32 12.8 44.8 2.133334z" fill="#ffffff" p-id="13086"></path></svg>
                    <span style="margin-left: 5px;">上传</span>
                </div>
            </el-button>
            <el-button type="danger" :disabled="isDisabled" style="height: 35px; padding: 0 20px 0 20px; display: flex;justify-content: center;align-items: center;">
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
                            <div style="display: flex;align-items: center; " @click="clickItem(scope.row)">
                                <img style="height: 35px; width: 35px;" :src= scope.row.file_cover>
                                <div class="item-name">{{ scope.row.file_name }}</div>
                            </div>
                            <div class="recycle-operation">
                                <div style="display: flex;">
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1712839523973" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15692" width="16" height="16"><path d="M874.666667 544c-17.066667 0-32 14.933333-32 32v256c0 6.4-4.266667 10.666667-10.666667 10.666667H192c-6.4 0-10.666667-4.266667-10.666667-10.666667V192c0-6.4 4.266667-10.666667 10.666667-10.666667h256c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H192C151.466667 117.333333 117.333333 151.466667 117.333333 192v640c0 40.533333 34.133333 74.666667 74.666667 74.666667h640c40.533333 0 74.666667-34.133333 74.666667-74.666667V576c0-17.066667-14.933333-32-32-32z" fill="#06A7FF" p-id="15693"></path><path d="M874.666667 117.333333H640c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h157.866667L509.866667 467.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333l285.866667-285.866667V384c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c0-17.066667-14.933333-32-32-32z" fill="#06A7FF" p-id="15694"></path></svg>
                                        <div>分享</div>
                                    </div>
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1712839558223" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16047" width="16" height="16"><path d="M896 672c-17.066667 0-32 14.933333-32 32v128c0 6.4-4.266667 10.666667-10.666667 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667v-128c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v128c0 40.533333 34.133333 74.666667 74.666667 74.666667h682.666666c40.533333 0 74.666667-34.133333 74.666667-74.666667v-128c0-17.066667-14.933333-32-32-32z" fill="#06A7FF" p-id="16048"></path><path d="M488.533333 727.466667c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l213.333333-213.333334c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-157.866667 157.866667V170.666667c0-17.066667-14.933333-32-32-32s-34.133333 14.933333-34.133333 32v456.533333L322.133333 469.333333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l211.2 213.333334z" fill="#06A7FF" p-id="16049"></path></svg>
                                        <div>下载</div>
                                    </div>
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1712839581608" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16362" width="16" height="16"><path d="M874.666667 241.066667h-202.666667V170.666667c0-40.533333-34.133333-74.666667-74.666667-74.666667h-170.666666c-40.533333 0-74.666667 34.133333-74.666667 74.666667v70.4H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h53.333334V853.333333c0 40.533333 34.133333 74.666667 74.666666 74.666667h469.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V305.066667H874.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM416 170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h170.666666c6.4 0 10.666667 4.266667 10.666667 10.666667v70.4h-192V170.666667z m341.333333 682.666666c0 6.4-4.266667 10.666667-10.666666 10.666667H277.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V309.333333h490.666666V853.333333z" fill="#06A7FF" p-id="16363"></path><path d="M426.666667 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32zM597.333333 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32z" fill="#06A7FF" p-id="16364"></path></svg>
                                        <div>删除</div>
                                    </div>
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1713375938371" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3366" width="16" height="16"><path d="M921.6 307.2a25.6 25.6 0 0 1 51.2 0v588.8a128 128 0 0 1-128 128h-665.6A128 128 0 0 1 51.2 896v-768A128 128 0 0 1 179.2 0H665.6a25.6 25.6 0 0 1 0 51.2H179.2A76.8 76.8 0 0 0 102.4 128v768A76.8 76.8 0 0 0 179.2 972.8h665.6a76.8 76.8 0 0 0 76.8-76.8V307.2zM901.12 35.84a25.6 25.6 0 0 1 40.96 30.72l-460.8 614.4a25.6 25.6 0 0 1-40.96-30.72l460.8-614.4z" fill="#06A7FF" p-id="3367"></path></svg>
                                        <div>重命名</div>
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
                    label="大小"
                    width="200" style="padding-top: 0;">
                    <template slot-scope="scope">{{ scope.row.file_size }}</template>
                </el-table-column>
            </el-table>
        </div>
    </div> 
    <el-dialog :title=showTitle :visible.sync="visibleMp3" :close-on-click-modal="false" center :before-close="closeAudio">
        <div style="width: 100%;display: grid;justify-items: center;">
            <div>
                <svg t="1715445764833" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4670" width="196" height="196"><path d="M238.08 116.736h427.52l181.248 183.808v546.304c0 33.28-27.136 60.928-60.928 60.928h-547.84c-33.28 0-60.928-27.136-60.928-60.928V177.152c0-33.28 27.648-60.416 60.928-60.416z" fill="#AC8CE0" p-id="4671"></path><path d="M664.064 116.736l182.784 182.784h-121.856c-33.28 0-60.928-27.136-60.928-60.928v-121.856z" fill="#CAB7ED" p-id="4672"></path><path d="M638.976 335.872l-168.448 52.224c-18.944 7.68-37.376 26.112-37.376 48.64v176.128s-11.264-7.68-37.376-3.584c-41.472 7.68-71.168 37.376-71.168 67.584 0 33.792 33.792 52.224 71.168 45.056 41.472-7.68 67.584-33.792 67.584-67.584v-168.448c0-14.848 18.944-18.944 18.944-18.944l150.016-45.056s14.848-3.584 14.848 11.264v142.336s-14.848-7.68-41.472-3.584c-41.472-3.584-74.752 26.112-74.752 56.32 0 33.792 33.792 52.224 71.168 48.64 41.472-3.584 71.168-33.792 71.168-67.584v-247.296c-0.512-18.432-15.36-29.696-34.304-26.112z" fill="#FFFFFF" p-id="4673"></path></svg>
            </div>
            <audio controls ref="audioElement" :src=visibleMp3></audio>
        </div>
    </el-dialog>
    </div>
</template>
<script>
    import apis from '../../api/index'
    export default{
        data(){
            return{
                visibleMp3:null,
                showTitle:'',
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
            this.loadDataList({
                "user_id":this.UserInfo.user_id,
                "file_category":2
            })
        },
        methods:{
            clickItem(obj){
                console.info(obj.file_id)
                this.showTitle='音乐播放:'+obj.file_name
                this.visibleMp3='http://localhost:8083/Preview/previewAudio?file_id='+obj.file_id
            },
            closeAudio(){
                console.info('关闭了')
                this.visibleMp3=null
                const audioElement = this.$refs.audioElement;  
                if (audioElement && !audioElement.paused && !audioElement.ended) {  
                    audioElement.pause(); // 停止播放  
                    audioElement.currentTime = 0; // 重置播放位置到开头  
                }  
            },
            deleteClick(){
                this.$confirm('此操作删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    });
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });          
                });
            },
            handleSelectionChange(val){
                this.multipleSelection=val
            },
            async loadDataList(data){
                this.$store.commit('updateLoad',true)
                await apis.getCategoryList(data)
                .then(res=>{
                    this.tableData=res.data.data
                })
                .catch(error=>{
                    this.$message.error('获取目录内容失败，详细信息:'+error);
                })
                this.$store.commit('updateLoad',false)
            }
        }
    }
</script>
<style>

</style>