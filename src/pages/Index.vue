<template>
  <el-container style="height: 100vh;">
    <el-header class="custom-header" :style="{ height: '50px' }">
      <div class="header-content">
        <!-- 左侧 logo -->
        <div class="block">
          <el-image :src="require('@/assets/logo.png')" style="height: 30px;"></el-image>
          <span style="margin-left: 10px;font-size: 20px;font-weight: 650;color: rgb(48, 49, 51);">Tips</span>
        </div>
        <!-- 右侧头像 + 下拉菜单 -->
        <el-dropdown trigger="hover">
          <span class="avatar-wrapper">
            <el-avatar icon="el-icon-user-solid" :src="user.headImage" class="avatar" />
            <span class="username">{{ user.name }}</span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="jumpPersonage()">个人主页</el-dropdown-item>
            <el-dropdown-item @click.native="logout()">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '60px' : '175px'" class="aside"
        style="transition: width 0.5s; display: flex; flex-direction: column; justify-content: space-between; border-right: solid 1px #e6e6e6;">
        <el-menu :default-active="activeMenuIndex" router>
          <el-menu-item :index=item.navigatorPath v-for="(item, index) in menuList" :key="item.id || index">
            <div class="menu-item-content">
              <div>
                <img :src="require(`@/assets/ioc/navator/${item.icon}.png`)" class="nav-icon" />
              </div>
              <div class="menu-text" :class="{ 'collapsed': isCollapse }">{{ item.menuName }}</div>
            </div>
          </el-menu-item>
        </el-menu>
        <div class="collapse-toggle" @click="toggleCollapse">
          <svg v-if="!isCollapse" t="1753091902505" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="7334" width="20" height="20">
            <path
              d="M42.666667 149.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h896a21.333333 21.333333 0 0 1 0 42.666667H64a21.333333 21.333333 0 0 1-21.333333-21.333334z m917.333333 234.666667H362.666667a21.333333 21.333333 0 0 0 0 42.666667h597.333333a21.333333 21.333333 0 0 0 0-42.666667z m0 256H64a21.333333 21.333333 0 0 0 0 42.666667h896a21.333333 21.333333 0 0 0 0-42.666667z m0 256H64a21.333333 21.333333 0 0 0 0 42.666667h896a21.333333 21.333333 0 0 0 0-42.666667zM157.5 300.293333A21.333333 21.333333 0 0 1 170.666667 320v170.666667a21.333333 21.333333 0 0 1-36.42 15.086666l-85.333334-85.333333a21.333333 21.333333 0 0 1 0-30.173333l85.333334-85.333334a21.333333 21.333333 0 0 1 23.253333-4.62zM128 371.5L94.166667 405.333333 128 439.166667z"
              fill="#5C5C66" p-id="7335"></path>
          </svg>
          <svg v-else t="1753091928746" class="icon" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="7544" width="20" height="20">
            <path
              d="M42.666667 149.333333a21.333333 21.333333 0 0 1 21.333333-21.333333h896a21.333333 21.333333 0 0 1 0 42.666667H64a21.333333 21.333333 0 0 1-21.333333-21.333334z m917.333333 234.666667H362.666667a21.333333 21.333333 0 0 0 0 42.666667h597.333333a21.333333 21.333333 0 0 0 0-42.666667z m0 256H64a21.333333 21.333333 0 0 0 0 42.666667h896a21.333333 21.333333 0 0 0 0-42.666667z m0 256H64a21.333333 21.333333 0 0 0 0 42.666667h896a21.333333 21.333333 0 0 0 0-42.666667zM42.666667 490.666667V320a21.333333 21.333333 0 0 1 36.42-15.086667l85.333333 85.333334a21.333333 21.333333 0 0 1 0 30.173333l-85.333333 85.333333A21.333333 21.333333 0 0 1 42.666667 490.666667z m42.666666-51.5L119.166667 405.333333 85.333333 371.5z"
              fill="#5C5C66" p-id="7545"></path>
          </svg>
        </div>
      </el-aside>
      <el-main style="padding: 10px ;background-color: rgb(245, 245, 245);">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
export default {
  name: 'indexPage',
  data() {
    return {

    };
  },
  computed: {
    user() {
      return this.$store.getters.userInfo;
    },
    activeMenuIndex() {
      const path = this.$route.path;
      return path;
    },
    isCollapse() {
      return this.$store.getters.collapse;
    },
    menuList() {
      return this.$store.getters.menuList;
    },
  },
  methods: {
    toggleCollapse() {
      this.$store.dispatch('setCollapse', !this.isCollapse);
    },
    navigator(path) {
      if (this.$route.path !== path) {
        this.$router.push(path);
      }
    },
    logout() {
      this.$router.push('/login');
      this.$store.dispatch('logout');
    },
    jumpPersonage() {
      window.open('/#/personage')
      // this.navigator('/personage')
    }

  },
  created() {
    console.info('刷新了页面')
  },
};
</script>

<style scoped>
.block {
  display: flex;
  align-items: center;
  /* 垂直居中 */
}

.el-header.custom-header {
  background-color: #ffffff;
  padding: 0 50px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  height: 60px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.avatar-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.username {
  font-weight: 500;
  color: #333;
}

.el-container>.el-container {
  height: calc(100vh - 60px);
}

.el-aside {
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-right: 1px solid #e6e6e6;
  background-color: #fff;
  overflow: hidden;
}

.el-main.main-content {
  background-color: #f5f5f5;
  padding: 10px;
  overflow: auto;
}

.menu-item-content {
  display: flex;
  align-items: center;
}

.menu-text {
  margin-left: 10px;
  white-space: nowrap;
  transition: opacity 0.3s, width 0.3s;
  opacity: 1;
  width: auto;
  overflow: hidden;
}

.menu-text.collapsed {
  opacity: 0;
  width: 0;
}

.collapse-toggle {
  padding: 10px;
  border-top: 1px solid #e6e6e6;
  display: flex;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.rotate-icon {
  transition: transform 0.3s ease;
}

.open-icon {
  transform: rotate(0deg);
}

.close-icon {
  transform: rotate(180deg);
}

.nav-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
</style>