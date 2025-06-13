<template>
    <div>
        <div style="display: flex;">
            <el-button type="primary" style="height: 35px;  padding: 0 20px 0 20px;  display: flex;justify-content: center;align-items: center;" @click="uploadFile">
                <div style="display: flex; align-items: center;">
                    <svg t="1712821231517" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13084" width="20" height="20"><path d="M896 629.333333c-17.066667 0-32 14.933333-32 32v170.666667c0 6.4-4.266667 10.666667-10.666667 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667v-170.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v170.666667c0 40.533333 34.133333 74.666667 74.666667 74.666667h682.666666c40.533333 0 74.666667-34.133333 74.666667-74.666667v-170.666667c0-17.066667-14.933333-32-32-32z" fill="#ffffff" p-id="13085"></path><path d="M322.133333 407.466667l157.866667-157.866667V704c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V247.466667l157.866667 157.866666c6.4 6.4 14.933333 8.533333 23.466666 8.533334s17.066667-2.133333 23.466667-8.533334c12.8-12.8 12.8-32 0-44.8l-213.333333-213.333333c-12.8-12.8-32-12.8-44.8 0l-213.333334 213.333333c-12.8 12.8-12.8 32 0 44.8 10.666667 12.8 32 12.8 44.8 2.133334z" fill="#ffffff" p-id="13086"></path></svg>
                    <span style="margin-left: 5px;">上传</span>
                </div>
            </el-button>
            <el-button type="success" @click="visibleAddFolder=true"  style="height: 35px; padding: 0 20px 0 20px; display: flex;justify-content: center;align-items: center;">
                <div style="display: flex; align-items: center;">
                    <svg t="1712822249998" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13295" width="20" height="20"><path d="M921.6 450.133333c-6.4-8.533333-14.933333-12.8-25.6-12.8h-10.666667V341.333333c0-40.533333-34.133333-74.666667-74.666666-74.666666H514.133333c-4.266667 0-6.4-2.133333-8.533333-4.266667l-38.4-66.133333c-12.8-21.333333-38.4-36.266667-64-36.266667H170.666667c-40.533333 0-74.666667 34.133333-74.666667 74.666667v597.333333c0 6.4 2.133333 12.8 6.4 19.2 6.4 8.533333 14.933333 12.8 25.6 12.8h640c12.8 0 25.6-8.533333 29.866667-21.333333l128-362.666667c4.266667-10.666667 2.133333-21.333333-4.266667-29.866667zM170.666667 224h232.533333c4.266667 0 6.4 2.133333 8.533333 4.266667l38.4 66.133333c12.8 21.333333 38.4 36.266667 64 36.266667H810.666667c6.4 0 10.666667 4.266667 10.666666 10.666666v96H256c-12.8 0-25.6 8.533333-29.866667 21.333334l-66.133333 185.6V234.666667c0-6.4 4.266667-10.666667 10.666667-10.666667z m573.866666 576H172.8l104.533333-298.666667h571.733334l-104.533334 298.666667z" fill="#ffffff" p-id="13296"></path></svg>
                    <span style="margin-left: 5px;">新建文件夹</span>
                </div>
            </el-button>
            <el-button type="danger"  :disabled="isDisabled" style="height: 35px; padding: 0 20px 0 20px; display: flex;justify-content: center;align-items: center;" @click="batchDelete">
                <div style="display: flex; align-items: center;">
                    <svg t="1712822811614" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13509" width="20" height="20"><path d="M874.666667 241.066667h-202.666667V170.666667c0-40.533333-34.133333-74.666667-74.666667-74.666667h-170.666666c-40.533333 0-74.666667 34.133333-74.666667 74.666667v70.4H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h53.333334V853.333333c0 40.533333 34.133333 74.666667 74.666666 74.666667h469.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V305.066667H874.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM416 170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h170.666666c6.4 0 10.666667 4.266667 10.666667 10.666667v70.4h-192V170.666667z m341.333333 682.666666c0 6.4-4.266667 10.666667-10.666666 10.666667H277.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V309.333333h490.666666V853.333333z" fill="#ffffff" p-id="13510"></path><path d="M426.666667 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32zM597.333333 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32z" fill="#ffffff" p-id="13511"></path></svg>
                    <span style="margin-left: 5px;">批量删除</span>
                </div>
            </el-button>
            <div style="display: flex;place-items: center;margin-left: 20px;cursor: pointer;" @click="refresh">
                <svg t="1715867951564" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3187" width="28" height="28"><path d="M989.86666667 409.6V170.66666667l-77.9264 77.9264a477.55946667 477.55946667 0 0 0-398.50666667-214.49386667C249.51466667 34.0992 35.5328 248.04693333 35.5328 512S249.51466667 989.9008 513.4336 989.9008a477.93493333 477.93493333 0 0 0 442.91413333-298.12053333 40.92586667 40.92586667 0 1 0-75.8784-30.8224 396.11733333 396.11733333 0 0 1-367.03573333 247.02293333c-218.69226667 0-395.9808-177.28853333-395.9808-395.9808S294.74133333 116.0192 513.4336 116.0192c141.27786667 0 268.73173333 74.752 339.21706667 191.82933333L750.93333333 409.6h238.93333334z" fill="#bfbfbf" p-id="3188"></path></svg>
            </div>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top: 15px;">
            <el-breadcrumb-item v-for="(item,index) in crumbsList" :key="index" :to="{ path: item.param }">{{ item.showName }}</el-breadcrumb-item>
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
                        <div class="recycle-info">
                            <div style="display: flex;align-items: center; ">
                                <img style="height: 35px; width: 35px; border-radius: 5px;margin-right: 5px" :src="scope.row.file_cover">
                                <div class="item-name" @click="itemClick(scope.row)">{{ scope.row.file_name }}</div>
                            </div>
                            <div class="recycle-operation">
                                <div style="display: flex;">
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <!-- <svg t="1715504341127" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15422" width="16" height="16"><path d="M934.912 516.096q23.552 26.624 19.456 49.664t-26.624 46.592l-324.608 327.68q-8.192 7.168-19.456 11.264t-23.04 4.608-23.04-2.56-18.432-10.24q-121.856-122.88-218.112-220.16l-80.896-80.896q-39.936-39.936-71.168-71.68t-51.2-51.2-20.992-21.504q-3.072-4.096-10.752-14.848t-6.656-25.088l0-19.456 0-40.96q0-23.552 0.512-52.736t0.512-58.88q1.024-70.656 2.048-156.672 2.048-13.312 6.144-24.064t15.36-22.016q10.24-11.264 22.016-16.384t22.016-5.12l329.728 0q2.048 0 9.216 0.512t10.24 1.536q6.144 2.048 11.264 5.12t10.24 8.192zM217.088 317.44q40.96 0 69.12-28.672t28.16-69.632-28.16-69.632-69.12-28.672q-20.48 0-37.888 7.68t-30.72 20.992-20.992 31.232-7.68 38.4 7.68 38.4 20.992 31.232 30.72 20.992 37.888 7.68z" p-id="15423" fill="#bfbfbf"></path></svg> -->
                                        <!-- <svg t="1715504341127" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15422" width="16" height="16"><path d="M934.912 516.096q23.552 26.624 19.456 49.664t-26.624 46.592l-324.608 327.68q-8.192 7.168-19.456 11.264t-23.04 4.608-23.04-2.56-18.432-10.24q-121.856-122.88-218.112-220.16l-80.896-80.896q-39.936-39.936-71.168-71.68t-51.2-51.2-20.992-21.504q-3.072-4.096-10.752-14.848t-6.656-25.088l0-19.456 0-40.96q0-23.552 0.512-52.736t0.512-58.88q1.024-70.656 2.048-156.672 2.048-13.312 6.144-24.064t15.36-22.016q10.24-11.264 22.016-16.384t22.016-5.12l329.728 0q2.048 0 9.216 0.512t10.24 1.536q6.144 2.048 11.264 5.12t10.24 8.192zM217.088 317.44q40.96 0 69.12-28.672t28.16-69.632-28.16-69.632-69.12-28.672q-20.48 0-37.888 7.68t-30.72 20.992-20.992 31.232-7.68 38.4 7.68 38.4 20.992 31.232 30.72 20.992 37.888 7.68z" p-id="15423" fill="#bfbfbf"></path></svg> -->
                                    </div>
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1712839523973" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15692" width="16" height="16"><path d="M874.666667 544c-17.066667 0-32 14.933333-32 32v256c0 6.4-4.266667 10.666667-10.666667 10.666667H192c-6.4 0-10.666667-4.266667-10.666667-10.666667V192c0-6.4 4.266667-10.666667 10.666667-10.666667h256c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32H192C151.466667 117.333333 117.333333 151.466667 117.333333 192v640c0 40.533333 34.133333 74.666667 74.666667 74.666667h640c40.533333 0 74.666667-34.133333 74.666667-74.666667V576c0-17.066667-14.933333-32-32-32z" fill="#06A7FF" p-id="15693"></path><path d="M874.666667 117.333333H640c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h157.866667L509.866667 467.2c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466666 8.533333s17.066667-2.133333 23.466667-8.533333l285.866667-285.866667V384c0 17.066667 14.933333 32 32 32s32-14.933333 32-32V149.333333c0-17.066667-14.933333-32-32-32z" fill="#06A7FF" p-id="15694"></path></svg>
                                        <div @click="clickShare(scope.row)">分享</div>
                                    </div>
                                    <div v-if="scope.row.folder_type==0" style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1712839558223" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16047" width="16" height="16"><path d="M896 672c-17.066667 0-32 14.933333-32 32v128c0 6.4-4.266667 10.666667-10.666667 10.666667H170.666667c-6.4 0-10.666667-4.266667-10.666667-10.666667v-128c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v128c0 40.533333 34.133333 74.666667 74.666667 74.666667h682.666666c40.533333 0 74.666667-34.133333 74.666667-74.666667v-128c0-17.066667-14.933333-32-32-32z" fill="#06A7FF" p-id="16048"></path><path d="M488.533333 727.466667c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466667-8.533333l213.333333-213.333334c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-157.866667 157.866667V170.666667c0-17.066667-14.933333-32-32-32s-34.133333 14.933333-34.133333 32v456.533333L322.133333 469.333333c-12.8-12.8-32-12.8-44.8 0-12.8 12.8-12.8 32 0 44.8l211.2 213.333334z" fill="#06A7FF" p-id="16049"></path></svg>
                                        <div @click="downloadFile(scope.row.file_id)">下载</div>
                                    </div>
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1712839581608" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16362" width="16" height="16"><path d="M874.666667 241.066667h-202.666667V170.666667c0-40.533333-34.133333-74.666667-74.666667-74.666667h-170.666666c-40.533333 0-74.666667 34.133333-74.666667 74.666667v70.4H149.333333c-17.066667 0-32 14.933333-32 32s14.933333 32 32 32h53.333334V853.333333c0 40.533333 34.133333 74.666667 74.666666 74.666667h469.333334c40.533333 0 74.666667-34.133333 74.666666-74.666667V305.066667H874.666667c17.066667 0 32-14.933333 32-32s-14.933333-32-32-32zM416 170.666667c0-6.4 4.266667-10.666667 10.666667-10.666667h170.666666c6.4 0 10.666667 4.266667 10.666667 10.666667v70.4h-192V170.666667z m341.333333 682.666666c0 6.4-4.266667 10.666667-10.666666 10.666667H277.333333c-6.4 0-10.666667-4.266667-10.666666-10.666667V309.333333h490.666666V853.333333z" fill="#06A7FF" p-id="16363"></path><path d="M426.666667 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32zM597.333333 736c17.066667 0 32-14.933333 32-32V490.666667c0-17.066667-14.933333-32-32-32s-32 14.933333-32 32v213.333333c0 17.066667 14.933333 32 32 32z" fill="#06A7FF" p-id="16364"></path></svg>
                                        <div @click="deleteClick(scope.row.file_id)">删除</div>
                                    </div>
                                    <div style="color: rgb(6, 167, 255); display: flex; align-items: center; margin-right: 10px;cursor: pointer;">
                                        <svg t="1713375938371" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3366" width="16" height="16"><path d="M921.6 307.2a25.6 25.6 0 0 1 51.2 0v588.8a128 128 0 0 1-128 128h-665.6A128 128 0 0 1 51.2 896v-768A128 128 0 0 1 179.2 0H665.6a25.6 25.6 0 0 1 0 51.2H179.2A76.8 76.8 0 0 0 102.4 128v768A76.8 76.8 0 0 0 179.2 972.8h665.6a76.8 76.8 0 0 0 76.8-76.8V307.2zM901.12 35.84a25.6 25.6 0 0 1 40.96 30.72l-460.8 614.4a25.6 25.6 0 0 1-40.96-30.72l460.8-614.4z" fill="#06A7FF" p-id="3367"></path></svg>
                                        <div @click="clickRename(scope.row)">重命名</div>
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
        <el-dialog
            title="提示"
            :visible.sync="visibleAddFolder"
            width="30%"
            center
            :close-on-click-modal="false"
            :show-close="false"
            >
            <span><el-input placeholder="文件夹名字" v-model="newFolderName"></el-input></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleAddFolder = false">取 消</el-button>
                <el-button type="primary" @click="addFolder">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="图片预览" :visible.sync="visibleImage" :close-on-click-modal="false" center>
            <div style="width: 100%;display: flex;justify-content: center;">
                <img style="width: 750px;" :src="visibleImage">
            </div>
        </el-dialog>
        <el-dialog
            title="请输入新名字"
            :visible.sync="rechristen"
            width="30%"
            >
            <el-input v-model="newName"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rechristen = false">取 消</el-button>
                <el-button type="primary" @click="rename()">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="分享"
            :visible.sync="visibleShare"
            width="30%"
            >
            <ShareDialog @closeDialog="closeDialog" ref="ShareDialog" :fileObject="currentItem"></ShareDialog>
        </el-dialog>
    </div>
</template>
<script>
    import apis from '../../api';
    import ShareDialog from '../../components/ShareDialog.vue';
    export default{
        data(){
            return{
                visibleAddFolder:false,
                visibleImage:null,
                rechristen:false,
                newName:'',
                visibleShare:false,
                newFolderName:'',
                crumbsList:[
                    {
                        'showName':'全部文件',
                        'param':'/main/index/All'
                    }
                ],
                tableData: [], 
                multipleSelection: [],
                currentItem:null
            }
        },
        components:{
            ShareDialog
        },
        computed:{
            UserInfo(){
                return this.$store.state.UserInfo
            },
            isDisabled(){
                return !this.multipleSelection.length>0
            },
            file_pid(){
                if(this.$route.query.path==null||this.$route.query.path==''){
                    return 'root'
                }else{
                    return this.$route.query.path
                }
            }
        },
        watch: {
            '$route'(to, from) {  
                // 打印即将进入的路由信息  
                console.log('即将进入的路由信息:');  
                console.log('路径:', to.path);  
                console.log('查询参数:', to.query.path);  
                for (let i = 0; i < this.crumbsList.length; i++) {
                    if(this.crumbsList[i].param=='/main/index/All?path='+to.query.path){
                        console.info(i)
                        this.crumbsList.splice(i+1)
                    }
                }
                if(to.query.path==null){
                    console.info(0)
                    this.crumbsList.splice(1)
                }

                console.info(this.crumbsList)
                // 打印即将离开的路由信息  
                console.log('即将离开的路由信息:');  
                console.log('路径:', from.path);  
                console.log('查询参数:', from.query);

                if(to.query.path==null||to.query.path==''){
                    this.loadData('root')
                }else{
                    this.loadData(to.query.path)
                }
            },
        },
        mounted(){
            if(this.$route.query.path==''||this.$route.query.path==null){
                this.loadData('root')
            }else{
                this.loadData(this.$route.query.path)
            }
        },
        methods:{
            refresh(){
                if(this.$route.query.path==''||this.$route.query.path==null){
                    this.loadData('root')
                }else{
                    this.loadData(this.$route.query.path)
                }
            },
            closeDialog(){
                this.visibleShare = false
            },
            batchDelete(){
                console.info(this.multipleSelection)
            },
            async rename(){
                this.$store.commit('updateLoad',true)
                apis.rename({
                    file_id:this.currentItem.file_id,
                    newName:this.newName
                })
                .then(res=>{
                    console.info(res)
                })
                .catch(error=>{
                    console.info(error)
                    this.$error('重命名失败')
                })
                this.$store.commit('updateLoad',false)
                this.rechristen=false
                this.$message(
                    {type:'success',
                    message: '重命名成功!'}
                )
            },
            clickRename(item){
                this.currentItem=item
                this.rechristen = true
            },
            clickShare(item){
                this.currentItem=item
                this.visibleShare = true
            },
            async downloadFile(file_id) {
                try {  
                    // 发送GET请求到后端下载API  
                    const downloadUrl = `http://localhost:8083/File/downloadFile?file_id=${file_id}`;  
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
            },
            deleteClick(file_id){
                this.$confirm('此操作删除该文件, 在回收站可以找回，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    apis.toRecycle({
                        file_id:file_id
                    })
                    .then(response=>{
                        console.info(response)
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        if(this.$route.query.path==''||this.$route.query.path==null){
                            this.loadData('root')
                        }else{
                            this.loadData(this.$route.query.path)
                        }
                    })
                    .catch(error=>{
                        console.info(error)
                        this.$message.error('删除失败');
                    })
                   
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                    });
                });
            },
            uploadFile(){
                this.$store.commit('actionUpload', 0);
            },
            itemClick(item){
                if(item.file_category==1){
                    console.info('1')
                }else if(item.file_category==2){
                    console.info('1')
                }else if(item.file_category==3){
                    console.info('3')
                    this.visibleImage=item.file_cover
                }else if(item.file_category==4){
                    console.info('1')
                }else if(item.file_category==5){
                    console.info('5')
                }else{
                    this.entryFolder(item)
                }
            },
            entryFolder(folderObj){
                this.crumbsList.push({
                    'showName':folderObj.file_name,
                    'param':'/main/index/All?path='+folderObj.file_id
                })
                this.$router.push('/main/index/All?path='+folderObj.file_id)
            },
            async loadData(file_pid){
                this.$store.commit('updateLoad',true)
                await apis.getAllCatalogue({
                    'user_id':this.UserInfo.user_id,
                    'file_pid':file_pid
                })
                .then(res=>{
                    this.tableData=res.data.data
                    console.info(res.data.data)
                })
                .catch(error=>{
                    this.$message.error('获取目录内容失败，详细信息:'+error);
                })
                this.$store.commit('updateLoad',false)
            },
            addFolder(){
                if(this.newFolderName==''){
                    this.$notify.error({
                        title: '错误',
                        message: '文件夹不能为空'
                    });
                    return
                }
                apis.addFolder({
                    'user_id':this.UserInfo.user_id,
                    'folderName':this.newFolderName,
                    'file_pid':this.file_pid
                })
                .then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.loadData(this.file_pid)
                    }
                })
                .catch(error=>{
                    this.$message.error('添加失败'+error);
                })
                this.visibleAddFolder=false
            },
            handleSelectionChange(val){
                this.multipleSelection=val
            },
            updateValue(flag) {
                this.$store.commit('updateLoad', flag)
                setTimeout(() => {
                    this.$store.commit('updateLoad', false)
                }, 3000);
            }
        }
    }
</script>
<style>
   
</style>