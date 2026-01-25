<template>
  <div class="batch-upload">
    <div class="file-grid">
      <div class="file-cell" v-for="(file, index) in fileList" :key="index">
        <!-- 图片文件 -->
        <el-image v-if="isImage(file)" :src="file.filePath" fit="cover" class="thumb"
          :preview-src-list="imagePreviewList"></el-image>

        <!-- 非图片文件 -->
        <div v-else class="file-icon">
          <img :src="getFileIcon(file.fileSuffix)" alt="file icon" class="file-type-img" />
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
import pdfIcon from '@/assets/ioc/annexFile/pdf.png'
import wordIcon from '@/assets/ioc/annexFile/word.png'
import xlsIcon from '@/assets/ioc/annexFile/xlsl.png'
import txtIcon from '@/assets/ioc/annexFile/txt.png'
import zipIcon from '@/assets/ioc/annexFile/zip.png'
import mp3Icon from '@/assets/ioc/annexFile/mp3.png'
import mp4Icon from '@/assets/ioc/annexFile/mp4.png'
import otherIcon from '@/assets/ioc/annexFile/other.png'
export default {
  name: "AnnexFileView",
  props: ['fileList'],
  data() {
    return {
      fileTypeIcons: {
        pdf: pdfIcon,
        doc: wordIcon,
        docx: wordIcon,
        xls: xlsIcon,
        xlsx: xlsIcon,
        txt: txtIcon,
        zip: zipIcon,
        mp3: mp3Icon,
        mp4: mp4Icon,
        default: otherIcon
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
      if (/\.(png|jpg|jpeg|gif|webp)(\?|$)/i.test(url)) {
        // 图片走原生下载
        const a = document.createElement('a');
        a.href = url;
        a.download = name || '';
        a.target = '_blank';
        a.click();
        return;
      }

      // 其他文件用 fetch
      fetch(url)
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = name || 'download';
          link.click();
          URL.revokeObjectURL(blobUrl);
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
