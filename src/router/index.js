// router/index.js
import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../pages/LoginPage.vue'
import Main from '../pages/Main.vue'
import Index from '../pages/Index.vue'
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
        component:Index
    }
  ]
})


export default router;

