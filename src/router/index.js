// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

import LoginPage from '../pages/LoginPage.vue'
import Personage from '@/pages/Personage.vue'
import Index from '../pages/Index.vue'
import All from '@/pages/subpage/All.vue'
import NotFoundPage from '@/pages/NotFoundPage.vue'
import Task from '@/pages/subpage/Task.vue'
import Plan from '@/pages/subpage/Plan.vue'
import Document from '@/pages/subpage/Document.vue'
import Other from '@/pages/subpage/Other.vue'
import Collect from '@/pages/subpage/Collect.vue'
import ReadPage from '@/pages/external/ReadPage.vue'
import UserManager from '@/pages/subpage/UserManager.vue'
import RoleManager from '@/pages/subpage/RoleManager.vue'
import MenuManager from '@/pages/subpage/MenuManager.vue'
import DictManager from '@/pages/subpage/DictManager.vue'
Vue.use(VueRouter)


const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: LoginPage
    },
    {
      path: '/login',
      component: LoginPage
    },
    {
      path: '/personage',
      component: Personage,
      meta: { requiresAuth: true }
    },
    {
      path: '/readPage',
      component: ReadPage,
    },
    {
      path: '/index',
      component: Index,
      redirect: '/index/all',
      children: [
        {
          path: '/index/all',
          component: All,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/task',
          component: Task,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/plan',
          component: Plan,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/document',
          component: Document,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/collect',
          component: Collect,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/other',
          component: Other,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/userManager',
          component: UserManager,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/roleManager',
          component: RoleManager,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/MenuManager',
          component: MenuManager,
          meta: { requiresAuth: true }
        },
        {
          path: '/index/DictManager',
          component: DictManager,
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

