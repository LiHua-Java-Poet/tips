<template>
  <div class="batch-upload">
    <div class="file-grid">
      <!-- 文件格子 -->
      <div
        class="file-cell"
        v-for="(file, index) in fileList"
        :key="index"
      >
        <!-- 图片文件 -->
        <el-image
          v-if="file.isImage"
          :src="file.filePath"
          fit="cover"
          class="thumb"
          :preview-src-list="file.previewList"
        ></el-image>

        <!-- 非图片文件 -->
        <div v-else class="file-icon">
          <img
            :src="fileTypeIcons[file.fileSuffix] || fileTypeIcons.default"
            alt="file icon"
            class="file-type-img"
          />
        </div>

        <!-- 悬停下载图标 -->
        <div class="hover-overlay" @click.stop>
          <span @click.stop="downloadFile(file.filePath, file.fileName)">⬇</span>
        </div>

        <!-- 文件名 -->
        <span class="file-name" :title="file.fileName">{{ file.fileName }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AnnexFileView",
  props: {
    fileList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      fileTypeIcons: {
        pdf: '/ioc/index/pdf.png',
        doc: 'https://guliwangpan.oss-cn-guangzhou.aliyuncs.com/2025-08-14/1755156099987.jpg',
        docx: '/ioc/index/pdf.png',
        xls: '/ioc/index/pdf.png',
        xlsx: '/ioc/index/pdf.png',
        txt: '/ioc/index/pdf.png',
        zip: '/ioc/index/pdf.png',
        mp3: '/ioc/index/pdf.png',
        mp4: '/ioc/index/pdf.png',
        default: 'https://guliwangpan.oss-cn-guangzhou.aliyuncs.com/2025-08-14/1755156099987.jpg'
      }
    };
  },
  methods: {
    downloadFile(url, name) {
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
