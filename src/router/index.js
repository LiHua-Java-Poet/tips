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
import Other from '@/pages/subpage/Other.vue'
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
        component:Personage,
        meta: { requiresAuth: true }
    },
    {
        path:'/index',
        component:Index,
        children:[
          {
            path:'/index/all',
            component:All,
            meta: { requiresAuth: true }
          },
          {
            path:'/index/task',
            component:Task,
            meta: { requiresAuth: true }
          },
          {
            path:'/index/plan',
            component:Plan,
            meta: { requiresAuth: true }
          },
          {
            path:'/index/document',
            component:Document,
            meta: { requiresAuth: true }
          },
          {
            path:'/index/collect',
            component:Collect,
            meta: { requiresAuth: true }
          },
          {
            path:'/index/other',
            component:Other,
            meta: { requiresAuth: true }
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
  const userInfo = store.getters.userInfo;

  // 如果目标路由需要登录
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (userInfo == null) {
      console.warn('未登录，跳转到登录页');
      return next('/login');
    }
  }

  // 否则直接放行
  next();
});


export default router;

