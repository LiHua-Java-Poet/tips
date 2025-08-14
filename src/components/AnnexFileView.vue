<template>
  <div class="batch-upload">
    <div class="file-grid">
      <div
        class="file-cell"
        v-for="(file, index) in fileList"
        :key="index"
      >
        <!-- 图片文件 -->
        <el-image
          v-if="isImage(file)"
          :src="file.filePath"
          fit="cover"
          class="thumb"
          :preview-src-list="imagePreviewList"
        ></el-image>

        <!-- 非图片文件 -->
        <div v-else class="file-icon">
          <img
            :src="getFileIcon(file.fileSuffix)"
            alt="file icon"
            class="file-type-img"
          />
        </div>

        <!-- 下载按钮 -->
        <div class="hover-overlay" @click.stop>
          <span @click.stop="downloadFile(file.filePath, file.fileName)">⬇</span>
        </div>

        <span class="file-name" :title="file.fileName">{{ file.fileName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnnexFileView",
  props: ['fileList'],
  data() {
    return {
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
  computed: {
    /** 生成所有图片的预览列表 */
    imagePreviewList() {
      return this.fileList
        .filter(file => this.isImage(file))
        .map(file => file.filePath);
    }
  },
  methods: {
    /** 判断是否是图片（兼容 fileSuffix 缺失的情况） */
    isImage(file) {
      const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
      let ext = file.fileSuffix?.toLowerCase();
      if (!ext && file.filePath) {
        const match = file.filePath.match(/\.(\w+)(\?.*)?$/);
        ext = match ? match[1].toLowerCase() : '';
      }
      return imageExts.includes(ext);
    },
    /** 获取文件类型图标 */
    getFileIcon(suffix) {
      return this.fileTypeIcons[suffix?.toLowerCase()] || this.fileTypeIcons.default;
    },
    /** 下载文件（跨域 & 本地都支持） */
    downloadFile(url, name) {
      fetch(url, { mode: 'cors' })
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = name || 'download';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(blobUrl); // 释放内存
        })
        .catch(err => {
          console.error('下载失败:', err);
        });
    }

  }
};
</script>


<style scoped>
.batch-upload {
  width: 100%;
  padding: 10px;
  min-height: 140px;
  position: relative;
}
.file-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: flex-start;
}
.file-cell {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.thumb {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  object-fit: cover;
  z-index: 1;
}
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
/* 下载图标 */
.hover-overlay {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  background-color: rgba(0,0,0,0.6);
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
