// api.js  
import axios from 'axios';  
import store from '@/store';
import router from '@/router'
import { Message } from 'element-ui';
import { navigator } from '@/utils/navigator';

const baseURL= 'http://localhost:8901'
// const baseURL= 'http://192.168.89.249:8901'
// const baseURL= 'http://36.150.237.20/api'

// 创建axios实例  
const instance = axios.create({  
  baseURL:baseURL,
  timeout: 10000, // 请求超时时间  
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
    // ✅ 1️⃣ blob / 文件流：直接放行，什么都别碰
    if (response.headers.contenttype === 'image') {
      return response
    }

    const res = response.data

    if (res.code === 200 || res.success === true) {
      return response
    }

    if (res.code === -406) {
      navigator(router, "/login")
      store.dispatch('logout')
      return Promise.reject(new Error('未登录'))
    }

    Message({
      message: res.msg || '请求失败',
      type: 'warning'
    })
    return Promise.reject(new Error(res.msg || '请求失败'))
  },
  error => {
    Message({
      message: '系统错误，请联系管理员',
      type: 'warning'
    })
    return Promise.reject(error) // ⭐ 必须 return
  }
)
  
// 封装get请求  
export function get(url, params = {}) {  
  return instance.get(url, { params });  
}  
  
// 封装post请求  
export function post(url, data = {}) {  
  return instance.post(url, data);  
}

export {baseURL,instance}