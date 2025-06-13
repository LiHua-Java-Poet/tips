<template>
    <el-container style="height: 100vh;">
        <el-header class="custom-header">
            <div class="header-content">
            <!-- 左侧 logo -->
            <div class="block">
                <el-image :src="require('@/assets/logo.png')" style="height: 30px;"></el-image>
            </div>
            <!-- 右侧头像 + 下拉菜单 -->
            <el-dropdown trigger="hover">
                <span class="avatar-wrapper">
                    <el-avatar
                        icon="el-icon-user-solid"
                        :src="user.headImage"
                        class="avatar"
                    />
                    <span class="username">{{user.name}}</span>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人主页</el-dropdown-item>
                    <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </div>
        </el-header>
        <el-container>
            <el-aside width="175px" style="display: flex; flex-direction: column; justify-content: space-between;">
                <el-menu default-active="1" >
                    <el-menu-item index="1" @click="demo()">
                        <div style="display: flex;">
                            <div><svg t="1712771757606" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11131" width="18" height="18"><path d="M192 160a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V192a32 32 0 0 0-32-32H192z m0-64h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96H192a96 96 0 0 1-96-96V192a96 96 0 0 1 96-96zM192 608a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32v-192a32 32 0 0 0-32-32H192z m0-64h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96H192a96 96 0 0 1-96-96v-192a96 96 0 0 1 96-96zM640 608a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32v-192a32 32 0 0 0-32-32h-192z m0-64h192a96 96 0 0 1 96 96v192a96 96 0 0 1-96 96h-192a96 96 0 0 1-96-96v-192a96 96 0 0 1 96-96zM602.272 266.272a32 32 0 0 0 0 45.28l112 112a32 32 0 0 0 45.28 0l112-112a32 32 0 0 0 0-45.28l-112-112a32 32 0 0 0-45.28 0l-112 112z m-45.248-45.248l112-112a96 96 0 0 1 135.776 0l112 112a96 96 0 0 1 0 135.776l-112 112a96 96 0 0 1-135.776 0l-112-112a96 96 0 0 1 0-135.776z" fill="#000000" p-id="11132"></path></svg></div>
                            <div style="margin-left: 10px;">首页</div>
                        </div>
                    </el-menu-item>
                    <el-menu-item index="2" @click="navigator('/main/index/Video')">
                        <div style="display: flex;">
                            <div><svg t="1712771621282" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7725" width="18" height="18"><path d="M868.032 287.808a64 64 0 0 1 101.056 51.648l2.624 302.592a64 64 0 0 1-102.752 51.456l-206.912-157.536a64 64 0 0 1 1.728-103.104l204.256-145.056z" fill="#000000" p-id="7726"></path><path d="M144 192h456.32a96 96 0 0 1 96 96v417.376a96 96 0 0 1-96 96H144a96 96 0 0 1-96-96V288a96 96 0 0 1 96-96z" fill="#000000" p-id="7727"></path></svg></div>
                            <div style="margin-left: 10px;">视频</div>
                        </div>
                    </el-menu-item>
                    <el-menu-item index="3" @click="navigator('/main/index/Music')">
                        <div style="display: flex;">
                            <div><svg t="1712771729630" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7873" width="18" height="18"><path d="M260.256 356.576l204.288-163.968a32 32 0 0 1 52.032 24.96v610.432a32 32 0 0 1-51.968 24.992l-209.92-167.552H96a32 32 0 0 1-32-32v-264.864a32 32 0 0 1 32-32h164.256zM670.784 720.128a32 32 0 0 1-44.832-45.664 214.08 214.08 0 0 0 64.32-153.312 213.92 213.92 0 0 0-55.776-144.448 32 32 0 1 1 47.36-43.04 277.92 277.92 0 0 1 72.416 187.488 278.08 278.08 0 0 1-83.488 198.976zM822.912 858.88a32 32 0 1 1-45.888-44.608A419.008 419.008 0 0 0 896 521.152c0-108.704-41.376-210.848-114.432-288.384a32 32 0 0 1 46.592-43.872c84.16 89.28 131.84 207.04 131.84 332.256 0 127.84-49.76 247.904-137.088 337.728z" fill="#000000" p-id="7874"></path></svg></div>
                            <div style="margin-left: 10px;">音频</div>
                        </div>
                    </el-menu-item>
                    <el-menu-item index="4" @click="navigator('/main/index/Image')">
                        <div style="display: flex;">
                            <div><svg t="1712771581280" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7574" width="18" height="18"><path d="M896 626.592a16 16 0 0 0-7.68-13.664l-172.448-105.088a16 16 0 0 0-20.704 3.52l-76 92.608-1.024 1.152a16 16 0 0 1-22.624 0.032l-252.832-252.064a16.032 16.032 0 0 0-22.08-0.512l-187.36 170.656a15.936 15.936 0 0 0-5.248 11.84V800h768v-173.408z" p-id="7575"></path><path d="M800 320m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" p-id="7576"></path><path d="M32 128v768h960V128H32z m896 704H96V192h832v640z" p-id="7577"></path></svg></div>
                            <div style="margin-left: 10px;">图片</div>
                        </div>
                    </el-menu-item>
                    <el-menu-item index="5" @click="navigator('/main/index/Doc')">
                        <div style="display: flex;">
                            <div><svg t="1712771795776" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11278" width="18" height="18"><path d="M288 320a32 32 0 1 1 0-64h448a32 32 0 0 1 0 64H288zM288 544a32 32 0 0 1 0-64h448a32 32 0 0 1 0 64H288zM288 768a32 32 0 0 1 0-64h128a32 32 0 0 1 0 64H288z" fill="#000000" p-id="11279"></path><path d="M807.968 802.24a32 32 0 0 1 41.984 48.32l-153.856 133.6a32 32 0 0 1-20.992 7.84H195.04C140.16 992 96 946.624 96 891.072V132.928C96 77.376 140.16 32 195.04 32h633.92C883.84 32 928 77.376 928 132.928v564.32a32 32 0 1 1-64 0V132.928C864 112.32 848.096 96 828.96 96H195.04C175.904 96 160 112.32 160 132.928v758.144C160 911.68 175.904 928 195.04 928h468.096l144.832-125.76z" fill="#000000" p-id="11280"></path><path d="M704 959.136a32 32 0 1 1-64 0v-186.24C640 717.408 684.16 672 739.04 672h157.632a32 32 0 0 1 0 64h-157.632c-19.136 0-35.04 16.32-35.04 36.928v186.24z" fill="#000000" p-id="11281"></path></svg></div>
                            <div style="margin-left: 10px;">文档</div>
                        </div>
                    </el-menu-item>
                    <el-menu-item index="6" @click="navigator('/main/index/Others')">
                        <div style="display: flex;">
                            <div><svg t="1712772330917" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11379" width="20" height="20"><path d="M897.088 298.794667l-512 0c-11.776 0-21.333333-9.557333-21.333333-21.333333s9.557333-21.333333 21.333333-21.333333l512 0c11.797333 0 21.333333 9.557333 21.333333 21.333333S908.885333 298.794667 897.088 298.794667z" fill="#5D646F" p-id="11380"></path><path d="M897.088 533.418667l-512 0c-11.776 0-21.333333-9.557333-21.333333-21.333333s9.557333-21.333333 21.333333-21.333333l512 0c11.797333 0 21.333333 9.557333 21.333333 21.333333S908.885333 533.418667 897.088 533.418667z" fill="#5D646F" p-id="11381"></path><path d="M897.088 768.042667l-512 0c-11.776 0-21.333333-9.536-21.333333-21.333333s9.557333-21.333333 21.333333-21.333333l512 0c11.797333 0 21.333333 9.536 21.333333 21.333333S908.885333 768.042667 897.088 768.042667z" fill="#5D646F" p-id="11382"></path><path d="M193.066667 277.461333m-42.666667 0a2 2 0 1 0 85.333333 0 2 2 0 1 0-85.333333 0Z" fill="#5D646F" p-id="11383"></path><path d="M193.066667 512.085333m-42.666667 0a2 2 0 1 0 85.333333 0 2 2 0 1 0-85.333333 0Z" fill="#5D646F" p-id="11384"></path><path d="M193.066667 746.709333m-42.666667 0a2 2 0 1 0 85.333333 0 2 2 0 1 0-85.333333 0Z" fill="#5D646F" p-id="11385"></path></svg></div>
                            <div style="margin-left: 10px;">其他</div>
                        </div>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default{
        name:'indexPage',
        data(){
            return{
                logoSrc:'../assets/logo.png'
            }
        },
        methods:{
            navigator(path){
                this.$router.push(path)
            },
            logout(){
                this.$router.push('/')
                this.$store.dispatch('logout')
            },
            demo(){
                console.info(this.$store.getters.userInfo)
            }
        },
        computed: {
            user() {
                return this.$store.getters.userInfo
            }
        }
    }
</script>
<style>
.el-header.custom-header {
  background-color: #ffffff;
  padding: 0 40px;
  display: flex;
  align-items: center;
  height: 80px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 底部阴影 */
  z-index: 10; /* 确保浮在页面上方 */
}

.header-content {
  display: flex;
  justify-content: space-between; /* 左右分布 */
  align-items: center;
  width: 100%;
}

.block {
  display: flex;
  align-items: center;
}

.avatar-wrapper {
  display: flex;
  align-items: center; /* 垂直居中 */
  cursor: pointer;
  gap: 10px; /* 控制图片和文字之间的间距 */
  font-size: 18px; /* 放大字体 */
}

.avatar {
  width: 40px;
  height: 40px;
  font-size: 20px; /* 放大默认图标的大小 */
}

.username {
  font-weight: 500;
  color: #333;
}

</style>