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

// 响应拦截器：统一处理 code 和错误
// instance.interceptors.response.use(
//   response => {
//     const res = response;
//     if (res.data.code && res.data.code !== 200) {
//       console.warn('接口返回错误:', res.data.message);
//       // ElMessage.error(res.message || '错误');
//       return Promise.reject(res.data);
//     }
//     return res.data;
//   },
//   error => {
//     console.error('响应错误:', error);
//     // ElMessage.error(error.message || '请求失败');
//     return Promise.reject(error);
//   }
// );
  
// 封装get请求  
export function get(url, params = {}) {  
  return instance.get(url, { params });  
}  
  
// 封装post请求  
export function post(url, data = {}) {  
  return instance.post(url, data);  
}  