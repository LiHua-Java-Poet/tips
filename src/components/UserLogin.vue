<template>
  <div class="login-from">
    <el-form status-icon label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="pass">
        <el-input placeholder="用户名" v-model="userName" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="checkPass">
        <el-input type="password" placeholder="请输入密码" v-model="password" show-password></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <div style="display:flex;align-items:center;">
          <el-input
            v-model="inputIdentifyCode"
            placeholder="请输入验证码"
            style="width: 150px"
          />
          <img
            :src="captchaImg"
            class="captcha-img"
            @click="refreshCode"
          />
        </div>
      </el-form-item>
      <span class="tip" @click="callParentMethod(false)">没有账号?</span>
      <el-form-item>
        <div style="display: flex; justify-content: center;">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { navigator } from '@/utils/navigator';
import router from '@/router';
import { loginUser, getImageVerifica } from '@/api/user'

export default {
  props: ['callback'],
  data() {
    return {
      userName: '',
      password: '',
      inputIdentifyCode: '',
      captchaImg: '',    // 图片地址
      timeToken: ''    // 本次验证码唯一标识
    };
  },
  mounted() {
    const user = this.$store.getters.userInfo
    if (user != null) {
      this.$router.push("/index")
      return
    }
    //获取到对应的验证码
    this.refreshCode()
  },

  methods: {
    async login() {
      if (this.userName == '' || this.password == '') {
        this.$notify.error({
          title: '错误',
          message: '有内容未填写'
        });
        return
      }
      if (this.inputIdentifyCode !== this.identifyCode && 1 == 2) {
        this.$notify.error({
          title: '错误',
          message: '图片验证码输入错误'
        });
        return
      }
      await loginUser({
        "userName": this.userName,
        "password": this.password,
        "captchaCode": this.inputIdentifyCode,
        "timeToken": this.timeToken

      })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '登录成功！',
              type: 'success'
            });
            this.$store.dispatch('login', res.data.data);
            navigator(router, "/index/all")
          } else {
            this.$notify.error({
              title: '失败',
              message: '账号或密码错误'
            });
          }
        })
        .catch(error => {
          console.info(error)
        })
      this.$store.commit('updateLoad', false)
    },
    randomNum() {
      const timestamp = Date.now(); // 毫秒级时间戳
      const random8 = Math.floor(10000000 + Math.random() * 90000000); // 8位随机数
      return `${timestamp}${random8}`;
    },
    //刷新验证码
    async refreshCode() {
      try {
        this.timeToken = this.randomNum()

        const res = await getImageVerifica({
          timeToken: this.timeToken
        })

        const buffer = res.data

        const blob = new Blob([buffer], { type: 'image/png' })

        this.captchaImg = URL.createObjectURL(blob)
      } catch (e) {
        console.error('验证码加载失败', e)
      }
    }


  }
}
</script>

<style>
.login-from {
  width: 50vh;
  min-width: 400px;
  /* 添加最小宽度防止在小屏幕上变形 */
  background-color: #ffffff;
  padding: 50px;
  border-radius: 20px;
  margin-right: 200px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  /* 添加阴影效果 */

  .demo-ruleForm {
    .el-form-item {
      margin-bottom: 28px;
      /* 增加表单项间距 */

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

.captcha-img {
  margin-left: 10px;
  width: 120px;
  height: 40px;
  cursor: pointer;
  border: 1px solid #dcdfe6;
}

</style>