// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index' // 👉 导入 Vuex store 实例

import LoginPage from '../pages/LoginPage.vue'
import Main from '../pages/Main.vue'
import Index from '../pages/Index.vue'
import All from '@/pages/subpage/All.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
Vue.use(VueRouter)


const router =new VueRouter({
  routes: [
    {
        path:'/',
        component:LoginPage
    },
    {
        path:'/main',
        component:Main
    },
    {
        path:'/index',
        component:Index,
        children:[
          {
          path:'/index/all',
          component:All
        }
        ]
    },
    {
      path: '*',
      component: NotFoundPage
    }
  ]
})

// 👉 添加全局路由守卫
router.beforeEach((to, from, next) => {
  // 模拟一个“登录状态”，比如从 localStorage 获取 token
  const userInfo = store.getters.userInfo

  // 只有访问 /main 时才检查登录状态
  if (to.path === '/index') {

    if (userInfo==null) {
      console.warn('未登录，跳转到登录页')
      return next('/')  // 拦截并跳转回登录页
    }
  }

  // 其他情况放行
  next()
})

export default router;

