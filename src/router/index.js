// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index' // 👉 导入 Vuex store 实例

import LoginPage from '../pages/LoginPage.vue'
// import Main from '../pages/Personage.vue'
import Personage from '@/pages/Personage.vue'
import Index from '../pages/Index.vue'
import All from '@/pages/subpage/All.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import Task from '@/pages/subpage/Task.vue'
import Plan from '@/pages/subpage/Plan.vue'
import Document from '@/pages/subpage/Document.vue'
import Collect from '@/pages/subpage/Collect.vue'
Vue.use(VueRouter)


const router =new VueRouter({
  routes: [
    {
        path:'/login',
        component:LoginPage
    },
    {
        path:'/personage',
        component:Personage
    },
    {
        path:'/index',
        component:Index,
        children:[
          {
            path:'/index/all',
            component:All
          },
          {
            path:'/index/task',
            component:Task
          },
          {
            path:'/index/plan',
            component:Plan
          },
          {
            path:'/index/document',
            component:Document
          },
          {
            path:'/index/collect',
            component:Collect
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

    // 登录页允许直接访问
  if (to.path === '/login') {
    return next()
  }

  if (userInfo == null) {
    console.warn('未登录，跳转到登录页')
    return next('/login')  // 拦截并跳转回登录页
  }

  // 其他情况放行
  next()
})

export default router;

