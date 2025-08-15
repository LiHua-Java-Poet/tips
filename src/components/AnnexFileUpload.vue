<template>
  <div class="batch-upload" @dragover.prevent @drop.prevent="handleDrop">
    <div class="file-grid">
      <!-- 文件格子 -->
      <div class="file-cell" v-for="(file, index) in fileList" :key="index">
        <!-- 图片文件 -->
        <el-image v-if="file.isImage" :src="file.filePath" fit="cover" class="thumb"
          :preview-src-list="file.previewList"></el-image>

        <!-- 非图片文件 -->
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

      <!-- 上传按钮格子 -->
      <div class="upload-cell" @click="triggerFileSelect">
        <input type="file" ref="fileInput" multiple @change="handleFilesSelected" style="display:none;" />
        <i class="fas fa-upload"></i>
        <p>上传文件</p>
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
      fileList: [],
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
      this.uploadFiles(files);
      e.target.value = null;
    },
    handleDrop(e) {
      const files = e.dataTransfer.files;
      this.uploadFiles(files);
    },
    uploadFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        post('oss/uploadFile', formData)
          .then(res => {
            const url = res.data.data;
            const suffix = file.name.split('.').pop().toLowerCase();
            const isImage = !!suffix.match(/(png|jpg|jpeg|gif|bmp)/i);

            const fileObj = {
              fileName: file.name,
              filePath: url,
              fileSuffix: suffix,
              isImage: isImage,
              previewList: isImage ? [url] : []
            };

            // this.fileList = [...this.fileList, fileObj];
            // this.fileList.push(fileObj);
            const newFiles = [...this.fileList, fileObj];
            this.$emit('update', newFiles);
          })
          .catch(err => {
            console.error('上传失败', file.name, err);
          });
      }
    },
    removeFile(index) {
      this.fileList.splice(index, 1);
      this.$emit('update', this.fileList); // 同步给父组件
    },
    cleanFileList() {
      this.fileList = []
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
    // 监听父组件传入的值，初始化或更新 fileList
    value: {
      handler(newVal) {
        this.fileList = this.formatFiles(newVal);
      },
      immediate: true, // 组件一创建就执行
      deep: true
    }
  },
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

/* 文件格子样式 */
.file-cell {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* 图片缩略图 */
.thumb {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  z-index: 1;
}

/* 非图片文件图标 */
.file-icon {
  width: 80px;
  height: 80px;
  font-size: 36px;
  color: #666;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
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

.file-type-img {
  width: 60px;
  height: 60px;
  object-fit: contain;
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
</style>
