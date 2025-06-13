import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 引入样式文件
import store from './store'; // 引入你的 store 文件


Vue.config.productionTip = false
Vue.use(ElementUI);

// 定义全局的路由跳转方法
Vue.prototype.$goToPage = function (routeName, params = {}) {
  this.$router.push({ name: routeName, params: params });
};

new Vue({
  router,
  render: h => h(App),
  store 
}).$mount('#app')
