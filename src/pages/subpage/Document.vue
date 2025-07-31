<template>
  <el-container style="height: 100%;" class="main-contain">
    <!-- 左侧导航 -->
    <el-aside width="200px" class="aside-custom">
        s
    </el-aside>

    <!-- 右侧内容区 -->
    <el-main style="padding: 20px;">
      <!-- 顶部操作栏 -->
      <div style="margin-bottom: 20px; display: flex; justify-content: space-between;">
        <div>
          <el-button type="primary" @click="saveDoc">保存</el-button>
          <el-button type="danger" @click="deleteDoc">删除</el-button>
          <el-button @click="uploadDoc">上传</el-button>
        </div>
        <div>
          <span v-if="currentDocName">当前文档：{{ currentDocName }}</span>
        </div>
      </div>

      <!-- 富文本编辑器区域 -->
      <div style="border: 1px solid #ccc; border-radius: 5px; overflow: hidden;">
        <div id="editor" style="min-height: 400px;"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>

export default {
  name: 'documentPage',
  data() {
    return {
      editor: null,
      docTree: [
        {
          id: 1,
          label: '项目文档',
          children: [
            { id: 2, label: '需求文档' },
            { id: 3, label: '设计文档' },
          ]
        },
        {
          id: 4,
          label: '用户手册',
          children: [
            { id: 5, label: '操作指南' },
            { id: 6, label: 'FAQ' },
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentDocId: null,
      currentDocName: ''
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    initEditor() {
      
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
  }
}
</script>

<style scoped>
.main-contain{
    background-color: rgb(255, 255, 255);
    border-radius: 8px;
}
.aside-custom{
    padding: 15px;
    border-right: 2px solid rgb(240, 240, 240);
    width: 150px;
}
</style>
