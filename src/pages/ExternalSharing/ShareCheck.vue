<template>
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh;background-color: rgb(238, 242, 248);">
        <div style="height: 30%;width: 30%; background-color: rgb(255, 255, 255);border-radius: 10px;">
            <div style="height: 30%; background-color: rgb(64, 158, 255);border-radius: 10px 10px 0 0;padding: 2%;display: flex; align-items: center;">
                <div><img style="width: 75px; height: 75px; border-radius: 50%;" :src=pageData.head_portrait></div>
                <div style="margin-left: 10px; color: rgb(248, 248, 248);">{{ pageData.userName }}  分享于 {{ pageData.share_time }}</div>
            </div>
            <div style="padding: 5%;">
                <div style="font-weight: bold;color: rgb(144, 144, 144);font-size: 14px;margin-bottom: 10px;">请输入提取码:</div>
                <div style="display: flex;">
                    <el-input v-model="inputCode" placeholder="请输入内容"></el-input><el-button style="margin-left: 10px;" type="primary" @click="verifyShareCode()">提取文件</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import apis from '../../api'

    export default{
        data(){
            return{
                inputCode:'',
                pageData:null
            }
        },
        mounted(){
            this.loadData()
        },
        methods:{
            check(){
                this.$message.error('提取码错误！请检查！')
            },
            async loadData(){
                this.$store.commit('updateLoad',true)
                const param1 = this.$route.query.share_id;
                await apis.getShareCheck({
                    share_id:param1
                })
                .then(res=>{
                    this.pageData=res.data.data
                })
                .catch(error=>{
                    console.info(error)
                })
                this.$store.commit('updateLoad',false)
            },
            async verifyShareCode(){
                if(this.inputCode==''){
                    this.$message.error('请填写提取码')
                    return
                }
                const upload=new FormData
                const param1 = this.$route.query.share_id;
                upload.append('code', this.inputCode);
                upload.append('share_id',param1)
                this.$store.commit('updateLoad',true)
                await apis.verifyShareCode(upload)
                .then(res=>{
                    if(res.data.code==-1){
                        this.$message.error('没有该分享文件')
                    }else if(res.data.code==-2){
                        this.$message.error('提取码错误')
                    }else{
                        // this.$router.push({name:'share',params:{
                        //     share_id:param1,
                        //     code:this.inputCode
                        // }})
                        this.$router.push('/share?share_id='+param1+'&code='+this.inputCode)
                    }
                })
                .catch(error=>{
                    console.info(error)
                })
                this.$store.commit('updateLoad',false)
            },
            navigator(path){
                this.$router.push(path)
            },
        }
    }
</script>