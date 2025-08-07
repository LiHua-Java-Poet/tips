// src/config/editorConfig.js
import {baseURL} from '@/api/index'

const serverUrl=baseURL+'/oss/uploadFile'
console.info(serverUrl)

export const toolbarConfig = {
  excludeKeys: ['fullScreen']
};

export const editorConfig = {
  placeholder: '请输入...',
  MENU_CONF: {
    uploadImage: {
      // 上传图片地址（你自己的后端接口）
      server: serverUrl,  // 这里写你的图片上传接口地址

      // 文件字段名（后端接收的名称）
      fieldName: 'file',

      // 上传时附带的其他参数（如果需要）
      meta: {},

      // 跨域是否带 cookie
      withCredentials: true,

      // 自定义上传成功后的图片 URL 映射（可选）
      customInsert(res, insertFn) {
        // 假设后端返回格式为：
        // { code: 200, data: { url: 'http://xxx.com/image.jpg' } }
        if (res.code === 200 && res.data) {
          insertFn(res.data);
        } else {
          console.error('图片上传失败：', res);
        }
      },

      // 上传超时时间（可选）
      timeout: 10 * 1000,
    },
  }
};

export const editorMode = 'default'; // 你如果有模式需求
