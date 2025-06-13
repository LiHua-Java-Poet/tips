// api.js  
import axios from 'axios';  
  
// 创建axios实例  
const instance = axios.create({  
  baseURL: 'http://localhost:8901', // 设置基础URL  
  timeout: 5000, // 请求超时时间  
  // 你可以在这里设置更多的请求配置选项，如headers等  
});  
  
// 封装get请求  
export function get(url, params = {}) {  
  return instance.get(url, { params });  
}  
  
// 封装post请求  
export function post(url, data = {}) {  
  return instance.post(url, data);  
}  