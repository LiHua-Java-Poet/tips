<template>
  <el-container style="height: 100%;" class="main-contain">
    <!-- 左侧导航 -->
    <el-aside width="250px" class="aside-custom">
      <!-- 搜索栏 -->
      <div class="search-wrapper">
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText" />
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
        <div class="select-item" v-for="(item, index) in catalogueList" :key="index"
          :class="{ selected: selectCatalogueId === item.id }" @click="handleClickFile(item)"
          @dblclick="handleDoubleClickFile(item)">
          <img
            :src="item.fileType == 2 ? require('@/assets/ioc/document/folder.png') : require('@/assets/ioc/document/file.png')" />
          <!-- 修改：条件渲染文件名或输入框 -->
          <div v-if="editingItemId !== item.id">
            {{ item.name }}
          </div>
          <el-input v-else v-model="editingName" ref="renameInput" size="mini" @blur="saveRename(item)"
            @keyup.enter="saveRename(item)" @keyup.esc="cancelRename" />
          <el-popover placement="bottom" trigger="click" popper-class="custom-popover" width="100" @click.stop>
            <div class="popover-menu">
              <div class="popover-menu-item" @click="startRename(item)">重命名</div>
              <div class="popover-menu-item" @click="deleteDocument(item)">删除</div>
              <div class="popover-menu-item" @click="moveTo(item)">移动到</div>
              <div class="popover-menu-item" v-if="item.fileType == 1">跳转到阅读</div>
            </div>
            <img class="more-icon" slot="reference" src="@/assets/ioc/document/more.png" @click.stop />
          </el-popover>
        </div>
        <el-skeleton v-if="catalogueLoadStatus" />
        <div v-if="!catalogueLoadStatus && catalogueList.length == 0">
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
          <el-button type="primary" @click="toRead()">跳转到阅读</el-button>
          <el-button type="primary" @click="saveDoc">保存</el-button>
        </div>
      </div>

      <!-- 富文本编辑器区域 -->
      <div class="editor-container">

        <!-- ✅ 新增：未选中任何文件 / 左侧为空 -->
        <el-empty v-if="!hasSelectedFile" description="请选择或新建一个文档" style="margin-top: 150px;">
        </el-empty>

        <!-- 文件夹状态 -->
        <el-empty v-else-if="currentFile.fileType === 2" style="margin-top: 150px;" description=" ">
          <template #image>
            <img src="@/assets/ioc/document/folder-1.png" style="width: 100px" />
          </template>
        </el-empty>

        <!-- 文件加载状态 -->
        <div v-else-if="loadingContent" class="loading-overlay">
          <div class="loading-content">
            <i class="el-icon-loading" style="font-size: 40px;"></i>
            <p>加载中...</p>
          </div>
        </div>

        <!-- 编辑器正常状态 -->
        <template v-else>
          <Toolbar :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
          <Editor v-model="html" :defaultConfig="editorConfig" :mode="mode" @onCreated="onCreated"
            style="height: 100%; overflow-y: hidden" />
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
    <!-- 移动文件/文件夹弹窗 -->
    <el-dialog title="移动到" :visible.sync="moveDialogVisible" width="400px">
      <div v-if="moveLoading" style="text-align: center; padding: 20px;">
        <i class="el-icon-loading" style="font-size: 24px;"></i>
      </div>

      <div v-else>
        <!-- 当前路径导航 -->
        <div class="move-path">
          <span v-for="(folder, index) in moveFolderStack" :key="folder.id" class="move-path-item"
            @click="jumpToPath(index)">
            {{ folder.name }} /
          </span>
          <span class="move-path-current">{{ moveCurrentFolderName }}</span>
        </div>

        <!-- 文件夹列表 -->
        <el-scrollbar style="max-height: 300px; margin-top: 8px;">
          <div v-for="folder in moveFolderList" :key="folder.id" class="move-folder-item" @click="enterFolder(folder)"
            style="padding: 6px 10px; cursor: pointer; display: flex; align-items: center;">
            <img src="@/assets/ioc/document/folder.png" style="width: 20px; height: 20px; margin-right: 8px;" />
            <span>{{ folder.name }}</span>
          </div>
        </el-scrollbar>
      </div>

      <template #footer>
        <el-button @click="cancelMove">取消</el-button>
        <el-button type="primary" @click="confirmMove">确定</el-button>
      </template>
    </el-dialog>


  </el-container>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import "@wangeditor/editor/dist/css/style.css";
import { toolbarConfig, editorConfig, editorMode } from "@/utils/editorConfig.js";
import { getFileList, saveFile, getFileInfo, saveDocument, deleteDocument, updateDocument, folderList } from "@/api/file";
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
      currentFile: null,
      catalogueList: [],
      newfileTitle: "",
      dialogVisible: false,
      fileType: 1,
      currentFilePid: 0,
      currentFileName: "",
      uniqueCode: "",
      selectCatalogueId: null,
      folderStack: [],
      catalogueLoadStatus: false,
      loadingContent: false,
      editingItemId: null,   // 新增：当前正在编辑的文件/文件夹ID
      editingName: "",       // 新增：编辑中的名称

      moveDialogVisible: false,
      moveFolderList: [],       // 当前层级文件夹列表
      moveFolderStack: [],      // 路径栈 [{id, name, list}]
      moveLoading: false,
      moveCurrentFolderName: '根目录', // 当前所在文件夹名称
      fileToMove: null,         // 要移动的文件/文件夹
      moveCurrentFolderId: 0
    };
  },
  computed: {
    // 是否有选中的文件或文件夹
    hasSelectedFile() {
      return this.currentFile !== null;
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
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

        if (res.code === 200) {
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
        const code = res?.data;
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
        this.currentFile = item;

        // 显示加载状态
        this.loadingContent = true;

        try {
          const res = await getFileInfo({ id: item.id });
          if (res.code === 200) {
            this.currentFile = res.data;
            this.html = this.currentFile.content || "";
          } else {
            this.$message.error("获取文件内容失败");
          }
        } catch (e) {
          this.$message.error("加载文件内容时出错");
        } finally {
          // 隐藏加载状态
          this.loadingContent = false;
        }
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
      this.catalogueLoadStatus = true;
      this.catalogueList = [];

      const res = await getFileList({ pid: this.currentFilePid });

      this.catalogueLoadStatus = false;
      this.catalogueList = res.data || [];

      // ✅ 如果没有任何文件，清空右侧选中状态
      if (this.catalogueList.length === 0) {
        this.currentFile = null;
        this.currentDocId = null;
        this.currentDocName = "";
        this.html = "";
      }
    },
    selectFirstFile() {
      const firstFile = this.catalogueList.find(item => item.fileType === 1);
      if (firstFile) {
        this.handleClickFile(firstFile);
      } else {
        // 没有文件，清空选中
        this.currentFile = null;
        this.currentDocId = null;
        this.currentDocName = "";
        this.html = "";
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
        if (res.code === 200) {
          this.$message.success("保存成功");
        } else {
          this.$message.error("保存失败");
        }
      } catch (e) {
        this.$message.error("保存异常");
      }
    },
    deleteDocument(item) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDocument([item.id]).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功")
            this.loadCatalogue()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 新增：开始重命名
    startRename(item) {
      this.editingItemId = item.id;
      this.editingName = item.name;

      // 下一个tick聚焦到输入框
      this.$nextTick(() => {
        if (this.$refs.renameInput && this.$refs.renameInput[0]) {
          this.$refs.renameInput[0].focus();
        }
      });
    },

    // 新增：取消重命名
    cancelRename() {
      this.editingItemId = null;
      this.editingName = "";
    },

    // 新增：保存重命名
    async saveRename(item) {
      if (!this.editingItemId) return;

      const newName = this.editingName.trim();
      if (!newName) {
        this.$message.warning("名称不能为空");
        return;
      }

      if (newName === item.name) {
        this.cancelRename();
        return;
      }
      //在这里发生一次消息更新一次消息的记录
      await updateDocument({ id: item.id, name: newName }).then(res => {
        if (res.code == 200) {
          item.name = newName
        }
      })
      this.cancelRename();
    },
    toRead() {
      //跳转到阅读
      window.open(window.location.origin + "/#/readPage?documentId=" + this.currentDocId, "_blank");
    },
    // 点击“移动到”
    moveTo(item) {
      this.fileToMove = item;
      this.moveFolderStack = [];
      this.moveCurrentFolderName = '根目录';
      this.moveCurrentFolderId = 0; // 根目录 pid=0
      this.loadMoveFolderList(0, item.id); // pid=0首次加载
      this.moveDialogVisible = true;
    },

    async loadMoveFolderList(pid, id) {
      try {
        this.moveLoading = true;
        const res = await folderList({ "id": id, "pid": pid });
        if (res.code === 200) {
          this.moveFolderList = res.data || [];
        } else {
          this.$message.error('加载文件夹失败');
        }
      } catch (e) {
        this.$message.error('加载文件夹失败');
      } finally {
        this.moveLoading = false;
      }
    },

    // 进入子文件夹
    enterFolder(folder) {
      // 保存当前层级
      this.moveFolderStack.push({
        id: this.moveCurrentFolderId,
        name: this.moveCurrentFolderName,
        list: this.moveFolderList
      });

      // 更新当前层级
      this.moveCurrentFolderName = folder.name;
      this.moveCurrentFolderId = folder.id; // ✅ 当前层级id就是文件夹id
      this.loadMoveFolderList(folder.id, this.fileToMove.id);
    },

    // 点击路径导航跳到指定层级
    jumpToPath(index) {
      const target = this.moveFolderStack[index];
      if (!target) return;

      this.moveFolderStack = this.moveFolderStack.slice(0, index + 1);
      this.moveCurrentFolderName = target.name;
      this.moveFolderList = target.list;
      this.moveCurrentFolderId = target.id; // ✅ 更新当前层级id
    },

    // 取消移动
    cancelMove() {
      this.moveDialogVisible = false;
      this.moveFolderList = [];
      this.moveFolderStack = [];
      this.moveCurrentFolderName = '根目录';
      this.fileToMove = null;
    },

    // 确认移动
    async confirmMove() {
      if (!this.fileToMove) return;

      try {
        const res = await updateDocument({
          id: this.fileToMove.id,
          pid: this.moveCurrentFolderId // ✅ 直接使用当前浏览文件夹id
        });
        if (res.code === 200) {
          this.$message.success('移动成功');
          this.cancelMove();
          this.loadCatalogue(); // 刷新左侧文件列表
        } else {
          this.$message.error('移动失败');
        }
      } catch (e) {
        this.$message.error('移动失败');
      }
    },
    handleKeydown(e) {
      // Ctrl + S 或 Command + S（Mac）
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.saveDoc();
      }
    }
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
  border-top: 1px solid #ccc;
  ;
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

.main-contain {
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

.aside-icon-div {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 5px;
}

.aside-icon {
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
  cursor: pointer;
  /* 鼠标变为手势 */
}

.select-item div {
  flex: 1;
  margin: 0 8px;
  white-space: nowrap;
  /* 不换行 */
  overflow: hidden;
  /* 超出隐藏 */
  text-overflow: ellipsis;
  /* 省略号显示 */
  color: rgb(115, 115, 115);
  pointer-events: none;
  font-size: small;
}

.select-item img:last-child {
  width: 18px;
  height: 18px;
  margin-left: 8px;
}

.select-item::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  height: 1px;
  width: 100%;
  background-color: rgb(230, 230, 230);
  /* 线的颜色 */
}

.selected {
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
  min-width: 100px !important;
  /* 或者 min-width: 0 !important; 彻底取消 */
  max-width: none !important;
  /* 解除最大宽度限制，避免宽度冲突 */
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
  height: 40px;
  /* 或你想要的高度 */
}

.left-icon {
  flex-shrink: 0;
  width: 20px;
  cursor: pointer;
}

.content-header-title {
  font-size: larger;
  color: rgb(115, 115, 115);
  font-weight: bold;
}

/* 新增：加载状态样式 */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content {
  text-align: center;
  color: #409EFF;
}

.loading-content p {
  margin-top: 10px;
  font-size: 16px;
}

.editor-container {
  position: relative;
  /* 为加载状态提供定位上下文 */
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  border-top: 1px solid #ccc;
  ;
}

/* 新增：重命名输入框样式 */
.select-item .el-input {
  flex: 1;
  margin: 0 8px;
}

.select-item .el-input ::v-deep .el-input__inner {
  height: 24px;
  padding: 0 5px;
  font-size: small;
  color: rgb(115, 115, 115);
}

.move-folder-item:hover {
  background-color: #f5f7fa;
  border-radius: 4px;
}

.move-path {
  font-size: 12px;
  color: #409EFF;
  margin-bottom: 8px;
}

.move-path-item {
  cursor: pointer;
}

.move-path-current {
  color: #333;
}
</style>
