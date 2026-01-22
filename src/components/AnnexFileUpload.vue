<template>
  <div class="batch-upload" @dragover.prevent @drop.prevent="handleDrop" @paste.prevent="handlePaste">
    <div class="file-grid">
      <!-- 上传中的文件（加载状态） -->
      <div class="file-cell" v-for="(loadingFile, index) in loadingFileList" :key="`loading-${index}`">
        <div class="loading-container">
          <!-- Element UI 加载图标 -->
          <i class="el-icon-loading loading-icon"></i>
          <p class="loading-text">上传中...</p>
        </div>
        <span class="file-name" :title="loadingFile.name">{{ loadingFile.name }}</span>
      </div>

      <!-- 已上传完成的文件 -->
      <div class="file-cell" v-for="(file, index) in fileList" :key="index">
        <!-- 图片文件：显示原图 -->
        <el-image v-if="file.isImage" :src="file.filePath" fit="cover" class="thumb"
          :preview-src-list="file.previewList" lazy></el-image>

        <!-- 非图片文件：显示对应类型封面 -->
        <div v-else class="file-icon">
          <img :src="fileTypeIcons[file.fileSuffix] || fileTypeIcons.default" alt="file icon" class="file-type-img" />
        </div>

        <!-- 悬停删除图标 -->
        <div class="hover-overlay" @click.stop>
          <span @click.stop="removeFile(index)">✖</span>
        </div>

        <!-- 文件名 -->
        <span class="file-name" :title="file.fileName">{{ file.fileName }}</span>
      </div>

      <!-- 上传按钮格子（Element UI 图标） -->
      <div class="upload-cell" @click="triggerFileSelect">
        <input type="file" ref="fileInput" multiple @change="handleFilesSelected" style="display:none;" />
        <i class="el-icon-upload"></i>
        <p>上传文件</p>
        <p style="font-size:10px;margin-top:2px;">支持粘贴上传</p>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '@/api/index';

export default {
  name: "AnnexFileUpload",
  data() {
    return {
      fileList: [], // 已上传完成的文件列表
      loadingFileList: [], // 上传中的文件列表（用于显示加载状态）
      fileTypeIcons: {
        pdf: '/ioc/index/pdf.png',
        doc: '/ioc/index/doc.png',
        docx: '/ioc/index/doc.png',
        xls: '/ioc/index/xls.png',
        xlsx: '/ioc/index/xls.png',
        txt: 'https://guliwangpan.oss-cn-guangzhou.aliyuncs.com/2025-08-14/1755183395395.png',
        zip: '/ioc/index/zip.png',
        mp3: '/ioc/index/mp3.png',
        mp4: '/ioc/index/mp4.png',
        default: 'https://guliwangpan.oss-cn-guangzhou.aliyuncs.com/2025-08-14/1755183460029.png'
      }
    };
  },
  props: ['value'],
  methods: {
    triggerFileSelect() {
      this.$refs.fileInput.click();
    },
    handleFilesSelected(e) {
      const files = e.target.files;
      this.handleUploadFiles(files); // 统一处理文件上传
      e.target.value = null;
    },
    handleDrop(e) {
      const files = e.dataTransfer.files;
      this.handleUploadFiles(files);
    },
    handlePaste(e) {
      const clipboardData = e.clipboardData || window.clipboardData;
      if (!clipboardData) return;

      // 获取粘贴板中的文件列表
      let files = clipboardData.files;
      if (files && files.length > 0) {
        this.handleUploadFiles(files);
      } else {
        // 处理网页复制的图片
        const items = clipboardData.items;
        const pasteFiles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.kind === 'file' && item.type.indexOf('image/') !== -1) {
            const file = item.getAsFile();
            file.name = `paste-image-${new Date().getTime()}.${file.type.split('/')[1]}`; // 给粘贴的图片命名
            pasteFiles.push(file);
          }
        }
        if (pasteFiles.length > 0) {
          this.handleUploadFiles(pasteFiles);
        }
      }
    },
    // 统一处理文件上传（新增加载状态管理）
    handleUploadFiles(files) {
      if (!files || files.length === 0) return;

      // 1. 将待上传文件加入加载列表，显示"上传中"状态
      const newLoadingFiles = Array.from(files).map(file => ({ name: file.name }));
      this.loadingFileList = [...this.loadingFileList, ...newLoadingFiles];

      // 2. 逐个上传文件
      Array.from(files).forEach((file, fileIndex) => {
        const formData = new FormData();
        formData.append('file', file);

        post('oss/uploadFile', formData)
          .then(res => {
            // 接口返回200且有文件地址时，才添加到已完成列表
            if (res.code === 200 && res.data) {
              const url = res.data;
              const suffix = file.name.split('.').pop().toLowerCase();
              const isImage = !!suffix.match(/(png|jpg|jpeg|gif|bmp)/i);

              const fileObj = {
                fileName: file.name,
                filePath: url,
                fileSuffix: suffix,
                isImage: isImage,
                previewList: isImage ? [url] : []
              };

              // 新增到已完成列表
              this.fileList = [...this.fileList, fileObj];
              this.$emit('update', this.fileList);
            } else {
              this.$message.error(`文件 ${file.name} 上传失败：接口返回异常`);
            }
          })
          .catch(err => {
            console.error('上传失败', file.name, err);
            this.$message.error(`文件 ${file.name} 上传失败，请重试`);
          })
          .finally(() => {
            // 3. 上传完成（成功/失败）后，移除加载状态
            this.loadingFileList = this.loadingFileList.filter(
              (item, idx) => !(idx === fileIndex && item.name === file.name)
            );
          });
      });
    },
    removeFile(index) {
      this.fileList.splice(index, 1);
      this.$emit('update', this.fileList);
    },
    cleanFileList() {
      this.fileList = [];
      this.loadingFileList = []; // 清空加载列表
      this.$emit('update', []);
    },
    formatFiles(files) {
      return (files || []).map(file => {
        const suffix = (file.fileSuffix || file.suffix || file.name?.split('.').pop() || '').toLowerCase();
        const filePath = file.filePath || file.url || '';
        const fileName = file.fileName || file.name || '';
        const isImage = /(png|jpg|jpeg|gif|bmp)/i.test(suffix);

        return {
          fileName,
          filePath,
          fileSuffix: suffix,
          isImage,
          previewList: isImage ? [filePath] : []
        };
      });
    },
  },
  watch: {
    value: {
      handler(newVal) {
        this.fileList = this.formatFiles(newVal);
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    // 可选：全局粘贴监听（如需页面任意位置粘贴上传，取消注释）
    // document.addEventListener('paste', this.handlePaste);
  },
  beforeDestroy() {
    // document.removeEventListener('paste', this.handlePaste);
  }
};
</script>

<style scoped>
.batch-upload {
  width: 100%;
  padding: 10px;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  min-height: 140px;
  position: relative;
}

.file-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}

/* 上传格子样式 */
.upload-cell {
  width: 80px;
  height: 80px;
  border: 2px dashed #1890ff;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: #f0f5ff;
  line-height:20px
}

.upload-cell i {
  font-size: 24px;
  color: #1890ff;
}

.upload-cell p {
  font-size: 12px;
  color: #1890ff;
  margin: 4px 0 0 0;
}

/* 文件格子样式（通用） */
.file-cell {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* 上传中状态容器 */
.loading-container {
  width: 80px;
  height: 80px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loading-icon {
  font-size: 28px;
  color: #1890ff;
  animation: spin 1.5s linear infinite;
}

.loading-text {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

/* 图片缩略图（上传完成后显示） */
.thumb {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  z-index: 1;
}

/* 非图片文件图标（上传完成后显示对应封面） */
.file-icon {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
}

.file-type-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
}

/* 文件名 */
.file-name {
  display: block;
  font-size: 12px;
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 4px;
}

/* 删除图标 */
.hover-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}

.file-cell:hover .hover-overlay {
  opacity: 1;
}

.hover-overlay span {
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}

/* 加载动画 */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>