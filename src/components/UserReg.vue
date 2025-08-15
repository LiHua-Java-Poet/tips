<template>
    <div class="login-from">
        <el-form status-icon label-width="100px" class="demo-ruleForm">
            <el-form-item label="手机号">
                <el-input placeholder="请输手机号" v-model="email" clearable></el-input>
            </el-form-item>
            <el-form-item label="验证码">
                <div style="display: flex;">
                    <el-input placeholder="请输入密码" v-model="emailCode"></el-input>
                    <el-button class="code-button" @click="startCountdown">{{ buttonText }}</el-button>
                </div>
                <el-tooltip placement="top">
                    <div slot="content">
                        1、在垃圾箱中查找邮箱验证码<br />2、在邮箱中头像->设置->反垃圾->白名单->设置邮件地址白名单<br />3、将邮箱【laoluo@wuhancoder.com】添加到白名单不知道怎么设置？"
                    </div>
                    <span class="code-tip">未收到验证码？</span>
                </el-tooltip>
            </el-form-item>
            <el-form-item label="用户名">
                <el-input placeholder="请输用户名" v-model="userName" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input type="password" placeholder="请输入密码" v-model="password" clearable></el-input>
            </el-form-item>
            <span class="tip" @click="callParentMethod(true)">已经有账号?</span>
            <el-form-item>
                <div style="display: flex; justify-content: center;">
                    <el-button type="primary" @click="regAndLogin()">注册并登录</el-button>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    props: ['callback'],
    data() {
        return {
            email: '',
            emailCode: '',
            password: '',
            userName: '',
            inputCode: '',
            identifyCodes: "abcdefhijkmnprstwxyz0123456789",
            identifyCode: "",
            buttonText: '获取验证码',
            disableButton: false,
            countdown: 60,
        };
    },
    mounted() {
        this.identifyCode = ""
        this.makeCode(this.identifyCodes, 4)
    },
    methods: {
        regAndLogin() {
            if (this.email == '' || this.emailCode == '' || this.password == '' || this.userName == '' || this.inputCode == '') {
                this.$notify.error({
                    title: '错误',
                    message: '有内容未填写'
                });
                return
            }
            if (this.inputCode !== this.identifyCode) {
                this.$notify.error({
                    title: '错误',
                    message: '图片验证码输入错误'
                });
                return
            }
            const data = {
                email: this.email,
                emailCode: this.emailCode,
                password: this.password,
                userName: this.userName
            }
            this.$store.commit('updateLoad', true)
            axios.post('http://localhost:8083/User/regNewUser', data)
                .then(response => {
                    // 请求成功时执行的代码  
                    // 你可以将返回的数据存储到组件的data中  
                    console.info(response)
                    // 在这里执行其他你需要的操作  
                    this.$store.commit('updateLoad', false)
                })
                .catch(error => {
                    // 请求失败时执行的代码
                    console.error(error);
                    this.$store.commit('updateLoad', false)
                });
        },
        startCountdown() {
            if (this.disableButton) {
                return
            }
            const regex = /^[0-9]{6,10}@qq.com$/;
            if (!regex.test(this.email)) {
                this.$notify.error({
                    title: '错误',
                    message: '邮箱格式不正确'
                });
                return
            }
            this.$store.commit('updateLoad', true)
            axios.get('http://localhost:8083/User/SendNoteMail?Email=' + this.email)
                .then(response => {
                    // 请求成功时执行的代码  
                    // 你可以将返回的数据存储到组件的data中  
                    console.info(response)
                    // 在这里执行其他你需要的操作  
                    this.$store.commit('updateLoad', false)
                })
                .catch(error => {
                    // 请求失败时执行的代码
                    console.error(error);
                    this.$store.commit('updateLoad', false)
                });
            if (!this.disableButton) {
                this.disableButton = true;
                this.buttonText = `${this.countdown} s`;
                const timer = setInterval(() => {
                    this.countdown--;
                    this.buttonText = `${this.countdown} s`;
                    if (this.countdown === 0) {
                        clearInterval(timer);
                        this.disableButton = false;
                        this.buttonText = '重新获取';
                        this.countdown = 60;
                    }
                }, 1000);
                if (this.receivedValue == null) {
                    return
                }
            }
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
.code-button {
    margin-left: 10px;
}

.code-tip {
    color: rgb(64, 158, 255);
    cursor: pointer;
}
</style>