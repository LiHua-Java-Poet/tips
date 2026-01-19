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
    // ✅ 文件流 / blob 放行
    if (
      response.config.responseType === 'blob' ||
      response.config.responseType === 'arraybuffer'
    ) {
      return response
    }

    const res = response.data || {}

    // ✅ 成功
    if (res.code === 200 || res.success === true) {
      return res
    }

    // ✅ 未登录
    if (res.code === -406) {
      Message.warning('登录已过期，请重新登录')
      store.dispatch('logout')
      navigator(router, '/login')
      return Promise.resolve(null) // ⭐ 不 reject
    }

    // ✅ 业务错误
    Message.warning(res.msg || '请求失败')
    return Promise.resolve(null) // ⭐ 核心：吞掉异常
  },

  error => {
    // ✅ 网络 / 服务器错误统一兜底
    let msg = '系统错误，请联系管理员'

    if (error.response) {
      const status = error.response.status
      if (status === 401) msg = '未授权，请重新登录'
      else if (status === 403) msg = '没有访问权限'
      else if (status === 404) msg = '接口不存在'
      else if (status >= 500) msg = '服务器异常'
    } else if (error.message.includes('timeout')) {
      msg = '请求超时，请稍后再试'
    } else if (error.message.includes('Network')) {
      msg = '网络异常，请检查网络'
    }

    Message.warning(msg)

    // ⭐⭐ 关键：不 reject
    return Promise.resolve(null)
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