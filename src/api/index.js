// api.js  
import axios from 'axios';  
import store from '@/store';
import router from '@/router';
  
// 创建axios实例  
const instance = axios.create({  
  baseURL: 'http://localhost:8901', // 设置基础URL  
  timeout: 5000, // 请求超时时间  
  // 你可以在这里设置更多的请求配置选项，如headers等  
});  

// 添加请求拦截器：在发送请求之前统一处理 token
instance.interceptors.request.use(
  config => {
    // 从 Vuex 中获取 token
    const user = store.state.user;
    if (user != null) {
      config.headers['token'] = `${user.token}`; // 加入请求头
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);


// 响应拦截器：统一处理响应
instance.interceptors.response.use(
  response => {
    const res = response.data;
    // 你可以自定义成功判断逻辑，比如 code === 200
    if (res.code === 200 || res.success === true) {
      return  response; // 优先返回 data 字段
    } else if(res.code === -406){
      router.push('/login')
      store.dispatch('logout')
    }else{
      console.error(res.message || '请求错误');
      return Promise.reject(new Error(res.message || '请求错误'));
    }
  },
  error => {
    return Promise.reject(error);
  }
);
  
// 封装get请求  
export function get(url, params = {}) {  
  return instance.get(url, { params });  
}  
  
// 封装post请求  
export function post(url, data = {}) {  
  return instance.post(url, data);  
}  