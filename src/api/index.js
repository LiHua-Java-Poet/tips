// api.js  
import axios from 'axios';  
import store from '@/store';
  
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
  
// 封装get请求  
export function get(url, params = {}) {  
  return instance.get(url, { params });  
}  
  
// 封装post请求  
export function post(url, data = {}) {  
  return instance.post(url, data);  
}  