<template>
        <div class="login-from">
            <el-form status-icon  label-width="100px" class="demo-ruleForm">
                <el-form-item label="用户名" prop="pass">
                    <el-input placeholder="用户名" v-model="userName" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="checkPass">
                    <el-input type="password"  placeholder="请输入密码" v-model="password" show-password></el-input>
                </el-form-item>
                <el-form-item label="验证码" prop="age">
                    <div style="display: flex;">
                        <el-input v-model="inputIdentifyCode"></el-input>
                        <div @click="refreshCode">
                            <identify-code
                                :identifyCode="identifyCode"
                                :contentWidth="150"
                                :contentHeight="40"
                                :fontSizeMin="50"
                            />
                        </div>
                    </div>
                </el-form-item>
                <span class="tip" @click="callParentMethod(false)">没有账号?</span>
                <el-form-item>
                    <div style="display: flex; justify-content: center;">
                        <el-button type="primary" @click="login" >登录</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
</template>

<script>
    import {navigator} from '@/utils/navigator';
    import IdentifyCode from './IdentifyCode.vue';
    import {loginUser} from '@/api/user'

    export default{
        props: ['callback'],
        data() {
            return {
                userName:'',
                password:'',
                identifyCodes: "abcdefhijkmnprstwxyz0123456789",
                    //生成的验证码
                identifyCode: "",
                inputIdentifyCode:''
            };
        },
        mounted(){
            const user = this.$store.getters.userInfo
            if(user!=null){
              this.$router.push("/index")
              return
            }
            this.identifyCode = ""
            this.makeCode(this.identifyCodes, 4)
        },
        components:{
            'identify-code': IdentifyCode,
        },
      
        methods:{
            async login(){
                if(this.userName=='' || this.password==''){
                    this.$notify.error({
                        title: '错误',
                        message: '有内容未填写'
                    });
                    return 
                }
                if(this.inputIdentifyCode!==this.identifyCode&&1==2){
                    this.$notify.error({
                        title: '错误',
                        message: '图片验证码输入错误'
                    });
                    return 
                }
                await loginUser({
                    "userName":this.userName,
                    "password":this.password
                })
                .then(res=>{
                    if(res.data.code==200){
                        this.$message({
                            message: '登录成功！',
                            type: 'success'
                        });
                        this.$store.dispatch('login', res.data.data);
                        navigator(this,"/index/all")
                    }else{
                        this.$notify.error({
                            title: '失败',
                            message: '账号或密码错误'
                        });
                    }
                })
                .catch(error=>{
                    console.info(error)
                })
                this.$store.commit('updateLoad', false)
            },
            callParentMethod(flag) {
            // 在子组件中调用父组件传递的方法
                this.callback(flag);
            },
            randomNum(min, max) {
                return Math.floor(Math.random() * (max - min) + min);
            },
            //刷新验证码
            refreshCode() {
                this.identifyCode = "";
                this.makeCode(this.identifyCodes, 4);
            },
            //生成验证码，l为生成验证码的长度
            makeCode(o, l) {
                for (let i = 0; i < l; i++) {
                    this.identifyCode += this.identifyCodes[
                        this.randomNum(0, this.identifyCodes.length)
                    ];
                }
            }
        }
    }
</script>

<style>
.login-from {
  width: 50vh;
  min-width: 400px; /* 添加最小宽度防止在小屏幕上变形 */
  background-color: #ffffff;
  padding: 50px;
  border-radius: 20px;
  margin-right: 200px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  
  .demo-ruleForm {
    .el-form-item {
      margin-bottom: 28px; /* 增加表单项间距 */
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .el-input {
        transition: all 0.3s;
        
        &:hover {
          ::v-deep .el-input__inner {
            border-color: #c0c4cc;
          }
        }
        
        ::v-deep .el-input__inner {
          height: 42px;
          line-height: 42px;
          border-radius: 4px;
        }
      }
    }
    
    .tip {
      display: inline-block;
      margin-bottom: 20px;
      color: #409eff;
      cursor: pointer;
      font-size: 14px;
      transition: color 0.3s;
      
      &:hover {
        color: #66b1ff;
        text-decoration: underline;
      }
    }
    
    .el-button {
      width: 120px;
      height: 42px;
      margin: 0 15px;
      font-size: 16px;
      border-radius: 4px;
      transition: all 0.3s;
      
      &--primary {
        background-color: #409eff;
        border-color: #409eff;
        
        &:hover {
          background-color: #66b1ff;
          border-color: #66b1ff;
        }
        
        &:active {
          background-color: #3a8ee6;
          border-color: #3a8ee6;
        }
      }
    }
  }
}

/* 验证码部分特殊样式 */
.identify-code-container {
  margin-left: 10px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  transition: border-color 0.3s;
  
  &:hover {
    border-color: #c0c4cc;
  }
}

/* 响应式调整 */
@media screen and (max-width: 768px) {
  .login-from {
    width: 90%;
    min-width: unset;
    margin-right: 0;
    padding: 30px;
  }
}
</style>