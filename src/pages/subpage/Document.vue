<template>
  <el-container style="height: 100%;" class="main-contain">
    <!-- 左侧导航 -->
    <el-aside width="250px" class="aside-custom">
      <!-- 搜索栏 -->
      <div class="search-wrapper">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="searchText"
        />
        <div class="aside-icon-div" @click="openAddFile">
          <img class="aside-icon" src="@/assets/ioc/document/save.png" />
        </div>
      </div>

      <!-- 返回上级 -->
      <div class="item-wrapper" v-if="currentFilePid !== 0">
        <span class="left-icon" @click="backLevel">
          <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M624.79 204.05L585.21 164.46 219.56 530.19 585.21 895.86 624.79 856.28 298.66 530.16Z" />
          </svg>
        </span>
        <div class="item-text">{{ currentFileName }}</div>
      </div>

      <!-- 文件列表 -->
      <div class="scroll-area">
        <div
          class="select-item"
          v-for="(item, index) in catalogueList"
          :key="index"
          :class="{ selected: selectCatalogueId === item.id }"
          @click="handleClickFile(item)"
          @dblclick="handleDoubleClickFile(item)"
        >
          <img
            :src="item.fileType == 2 ? require('@/assets/ioc/document/folder.png') : require('@/assets/ioc/document/file.png')"
          />
          <div>{{ item.name }}</div>
          <el-popover placement="bottom" trigger="click" popper-class="custom-popover" width="100">
            <div class="popover-menu">
              <div class="popover-menu-item">重命名</div>
              <div class="popover-menu-item">删除</div>
              <div class="popover-menu-item">移动到</div>
              <div class="popover-menu-item">分享</div>
            </div>
            <img class="more-icon" slot="reference" src="@/assets/ioc/document/more.png" />
          </el-popover>
        </div>
        <el-skeleton v-if="catalogueLoadStatus"/>
        <div v-if="!catalogueLoadStatus&&catalogueList.length==0">
          <el-empty description="没有文档请创建"></el-empty>
        </div>
      </div>
    </el-aside>

    <!-- 主内容区 -->
    <el-main style="padding: 10px;">
      <div style="margin-bottom: 10px; display: flex; justify-content: space-between;">
        <div class="content-header-title">
          <span v-if="currentDocName">{{ currentDocName }}</span>
        </div>
        <div>
          <el-button type="primary" @click="saveDoc">保存</el-button>
        </div>
      </div>

      <!-- 富文本编辑器区域 -->
      <div class="editor-container">
        <el-empty v-if="currentFile && currentFile.fileType === 2" style="margin-top: 150px;" description=" ">
        <template #image>
          <img src="@/assets/ioc/document/folder-1.png" style="width: 100px" />
        </template>
      </el-empty>
        <template v-else>
          <Toolbar :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc"/>
          <Editor 
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            style="height: 100%; overflow-y: hidden"
          />
        </template>
      </div>
    </el-main>

    <!-- 新增文件对话框 -->
    <el-dialog title="新增文件/文件夹" :visible.sync="dialogVisible" width="400px" @close="cancelAddFile">
      <el-input v-model="newfileTitle" placeholder="请输入标题" maxlength="100" show-word-limit />
      <el-radio-group v-model="fileType" style="margin-top: 20px;">
        <el-radio :label="1">文件</el-radio>
        <el-radio :label="2">文件夹</el-radio>
      </el-radio-group>
      <template #footer>
        <el-button @click="cancelAddFile">取消</el-button>
        <el-button type="primary" @click="addFile">新增</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import { toolbarConfig, editorConfig, editorMode } from "@/utils/editorConfig.js";
import { getFileList, saveFile,getFileInfo,saveDocument } from "@/api/file";
import { getUniqueCode } from "@/api/public";

export default {
  name: "documentPage",
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      html: "",
      toolbarConfig,
      editorConfig,
      mode: editorMode,
      searchText: "",
      currentDocId: null,
      currentDocName: "",
      currentFile:null,
      catalogueList: [],
      newfileTitle: "",
      dialogVisible: false,
      fileType: 1,
      currentFilePid: 0,
      currentFileName: "",
      uniqueCode: "",
      selectCatalogueId: null,
      folderStack: [],
      catalogueLoadStatus:false,
    };
  },
  methods: {
    onCreated(editorInstance) {
      this.editor = editorInstance;
    },
    async addFile() {
      try {
        const res = await saveFile({
          pid: this.currentFilePid,
          name: this.newfileTitle,
          fileType: this.fileType,
          uniqueCode: this.uniqueCode
        });

        if (res.data.code === 200) {
          this.$message.success("新增成功");
          this.loadCatalogue();
        } else {
          this.$message.error("新增失败");
        }
      } catch (err) {
        this.$message.error("新增失败");
      }
      this.cancelAddFile();
    },
    async openAddFile() {
      try {
        const res = await getUniqueCode();
        const code = res?.data?.data;
        if (!code) throw new Error();
        this.uniqueCode = code;
        this.dialogVisible = true;
      } catch (e) {
        this.$message.error("获取会话编号失败");
      }
    },
    cancelAddFile() {
      this.dialogVisible = false;
      this.fileType = 1;
      this.newfileTitle = "";
    },
    async handleClickFile(item) {
      this.selectCatalogueId = item.id;
      this.currentDocName = item.name;
      if (item.fileType === 1) {
        // 文件：加载内容
        this.currentDocId = item.id;
        const res = await getFileInfo({ id: item.id });
        this.currentFile = res.data.data;
        this.html = this.currentFile.content || "";
      } else {
        // 文件夹：清空富文本内容
        this.currentFile = item;
        this.html = "";
      }
    },
    async handleDoubleClickFile(item) {
      this.selectCatalogueId = item.id;
      if (item.fileType === 2) {
        this.folderStack.push({ id: this.currentFilePid, name: this.currentFileName });
        this.currentFileName = item.name;
        this.currentFilePid = item.id;
        //重新加载一次文件列表
        await this.loadCatalogue();
        this.selectFirstFile()
      } else {
        // 文件：仅选中并显示内容（已在点击处理）
      }
    },
    async backLevel() {
      const prev = this.folderStack.pop();
      if (prev) {
        this.currentFilePid = prev.id;
        this.currentFileName = prev.name;
        await this.loadCatalogue();
        this.selectFirstFile()
      }
    },
    async loadCatalogue() {
      this.catalogueLoadStatus=true
      this.catalogueList=[]
      const res = await getFileList({ pid: this.currentFilePid });
      this.catalogueLoadStatus=false
      this.catalogueList = res.data.data;
    },
    selectFirstFile(){
      if(this.catalogueList.length>0){
        const firstFileTypeOne = this.catalogueList.find(item => item.fileType === 1);
        this.handleClickFile(firstFileTypeOne)
      }
    },
    async saveDoc() {
      if (!this.currentFile || this.currentFile.fileType !== 1) {
        this.$message.warning("当前不是一个可保存的文件");
        return;
      }

      const htmlContent = this.html; // 正确用 v-model 的数据
      console.log("保存文档内容：", htmlContent);

      // 调用保存 API
      try {
        const res = await saveDocument({
          id: this.currentFile.id,
          content: htmlContent
        });
        if (res.data.code === 200) {
          this.$message.success("保存成功");
        } else {
          this.$message.error("保存失败");
        }
      } catch (e) {
        this.$message.error("保存异常");
      }
    },
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }
  },
  async created() {
    await this.loadCatalogue();
    this.selectFirstFile()
  }
};
</script>


<style scoped>
.el-main {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
}

.editor-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border-top: 1px solid #ccc;;
}

/* toolbar 高度固定 */
.editor-container .w-e-toolbar {
  flex-shrink: 0;
  border-bottom: 1px solid #ccc;
}

/* 编辑器内容区域占满剩余空间 */
.editor-container .w-e-text-container {
  flex: 1;
  overflow-y: auto;
}

.main-contain{
    background-color: rgb(255, 255, 255);
    border-radius: 8px;
}
.aside-custom {
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-right: 2px solid rgb(240, 240, 240);
  overflow: hidden;
}

.aside-icon-div{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}
.aside-icon{
  height: 30px;
  width: 30px;
  cursor: pointer;
  border-radius: 5px;
  padding: 3px;
}

.aside-icon:hover {
  background-color: #f4f6fa;
}

.select-warpper {
  margin-top: 20px;
}

.select-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 5px;
  border-radius: 6px;
  transition: background-color 0.2s;
  position: relative;
  height: 30px;
}

.select-item:hover {
  background-color: #f5f7fa;
}

.select-item img:first-child {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  cursor: pointer; /* 鼠标变为手势 */
}

.select-item div {
    flex: 1;
    margin: 0 8px;
    white-space: nowrap;        /* 不换行 */
    overflow: hidden;           /* 超出隐藏 */
    text-overflow: ellipsis;    /* 省略号显示 */
    color: rgb(115, 115, 115);
    pointer-events: none;
    font-size: small;
}

.select-item img:last-child {
  width: 18px;
  height: 18px;
  margin-left: 8px;
}
.select-item::after{
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  width: 100%;
  background-color: rgb(230, 230, 230); /* 线的颜色 */
}
.selected{
  background-color: #f5f7fa;
}

.more-icon {
  width: 16px;
  height: 16px;
  margin-left: auto; 
  padding: 4px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.more-icon:hover {
  background-color: rgba(0, 0, 0, 0.05); 
}


/* 默认隐藏 */
.select-item .more-icon {
  display: none;
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* 悬浮时显示 */
.select-item:hover .more-icon {
  display: inline-block;
}


.el-popover .popover-menu {
  display: flex;
  flex-direction: column;
}

.el-popover .popover-menu-item {
  padding: 6px 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
  border-radius: 5px;
}

.el-popover .popover-menu-item:hover {
  background-color: #f5f7fa;
}

.custom-popover {
  min-width: 100px !important;  /* 或者 min-width: 0 !important; 彻底取消 */
  max-width: none !important;   /* 解除最大宽度限制，避免宽度冲突 */
}

/* 搜索栏固定 */
.search-wrapper {
  flex: 0 0 auto;
  margin-bottom: 10px;
  display: flex;
}

/* 滚动区域 */
.scroll-area {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

/* 自定义滚动条样式（细窄） */
.scroll-area::-webkit-scrollbar {
  width: 6px;
}

.scroll-area::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.scroll-area::-webkit-scrollbar-track {
  background-color: transparent;
}

.item-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px; /* 或你想要的高度 */
}

.left-icon {
  flex-shrink: 0;
  width: 20px;
  cursor: pointer;
}

.item-text {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: rgb(115, 115, 115);
  font-weight: bold;
}

.content-header-title{
    font-size: larger;
    color: rgb(115, 115, 115);
    font-weight: bold;
}


</style>
