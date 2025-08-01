<template>
  <el-container style="height: 100%;" class="main-contain">
    <!-- 左侧导航 -->
        <el-aside width="250px" class="aside-custom">
            <!-- 搜索栏：固定不动 -->
            <div class="search-wrapper">
                <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="searchText">
                </el-input>
            </div>
            <div class="item-wrapper">
                <span class="left-icon">
                    <svg t="1754029918386" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7855" width="20" height="20"><path d="M624.788992 204.047974 585.205965 164.464026 219.560038 530.185011 585.205965 895.864013 624.788992 856.280986 298.663014 530.16105Z" p-id="7856"></path></svg>
                </span>
                <div class="item-text">文件夹一号</div>
            </div>
            <!-- 可滚动区域 -->
            <div class="scroll-area">
                <div class="select-item"
                v-for="(item, index) in catalogueList"
                :key="index">
                <img v-if="item.type==1" src="@/assets/ioc/document/folder.png">
                <img v-else src="@/assets/ioc/document/file.png">
                <div>{{ item.name }}</div>
                <el-popover
                    placement="bottom"
                    width="100"
                    trigger="click">
                    <div class="popover-menu">
                        <div class="popover-menu-item">重命名</div>
                        <div class="popover-menu-item">删除</div>
                        <div class="popover-menu-item">移动到</div>
                        <div class="popover-menu-item">分享</div>
                    </div>
                    <img class="more-icon" slot="reference" src="../../assets/ioc/document/more.png">
                </el-popover>
                </div>
            </div>
        </el-aside>
    <!-- 右侧内容区 -->
    <el-main style="padding: 20px;">
      <!-- 顶部操作栏 -->
      <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
        <div class="content-header-title">
          <span v-if="currentDocName">{{ currentDocName }}</span>
        </div>
        <div>
          <el-button type="primary" @click="saveDoc">保存</el-button>
        </div>
      </div>
      <!-- 富文本编辑器区域 -->
        <div class="editor-container">
            <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
            />
            <Editor
            style="height: 100%; overflow-y: hidden"
            v-model="html"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            />
        </div>
    </el-main>
  </el-container>
</template>

<script>
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import '@wangeditor/editor/dist/css/style.css'
import { toolbarConfig, editorConfig, editorMode } from '@/utils/editorConfig.js';


export default {
  name: 'documentPage',
  components:{Editor,Toolbar},
  data() {
    return {
      editor: null,
      html: '',
      toolbarConfig,
      editorConfig,
      mode: editorMode,

      searchText:'',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentDocId: null,
      currentDocName: 'java的学习路线概览',
      catalogueList:[
        {
            "name":"文件夹1号",
            "type":1
        },
        {
            "name":"我的宝贵资源",
            "type":1
        },
        {
            "name":"java的学习路线概览",
            "type":2
        }
      ],
    }
  },
  methods: {
    onCreated(editorInstance) {
      this.editor = editorInstance
    },
    handleNodeClick(node) {
      this.currentDocId = node.id
      this.currentDocName = node.label
      // 假设加载文档内容
      this.editor.txt.html(`<p>这是"${node.label}"的内容</p>`)
    },
    saveDoc() {
      const html = this.editor.txt.html()
      console.log('保存文档内容：', html)
      // 可调用接口进行保存
    },
    deleteDoc() {
      this.editor.txt.clear()
      this.currentDocName = ''
      this.currentDocId = null
    },
    uploadDoc() {
      this.$message.info('上传功能待开发')
    }
  },
    beforeDestroy() {
        if (this.editor) {
            this.editor.destroy()
            this.editor = null
        }
    }
}
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
  border: 1px solid #ccc;
  border-radius: 6px;
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

::v-deep(.el-popover) {
  min-width: unset !important;
  width: 20px !important;
  padding: 6px;
}

/* 搜索栏固定 */
.search-wrapper {
  flex: 0 0 auto;
  margin-bottom: 10px;
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
