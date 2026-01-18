<template>
    <el-container style="height: calc(100vh - 130px);">
        <el-main class="dict-main">

            <!-- 顶部操作区 -->
            <div class="top-bar">
                <span class="page-title">字典管理</span>
                <div>
                    <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddClassify">
                        新增分类
                    </el-button>
                    <el-button type="danger" size="small" icon="el-icon-minus" @click="handleDeleteClassify">
                        删除分类
                    </el-button>
                </div>
            </div>

            <!-- 主体区域 -->
            <div class="content-area">

                <!-- 左侧：字典分类树 -->
                <div class="left-panel">
                    <div class="panel-header panel-header-flex">
                        <span>字典分类</span>
                        <el-tooltip content="刷新分类列表" placement="top">
                            <el-button type="text" icon="el-icon-refresh" @click="loadClassifyTree" />
                        </el-tooltip>
                    </div>
                    <div class="panel-body">
                        <el-tree ref="classifyTree" :data="classifyTree" node-key="id" default-expand-all
                            highlight-current :props="classifyProps" @node-click="handleClassifySelect" />
                    </div>
                </div>

                <!-- 右侧：字典内容列表 -->
                <div class="right-panel">

                    <!-- 顶部工具栏 -->
                    <div class="panel-header panel-toolbar">
                        <el-button size="small" icon="el-icon-plus" @click="handleAddDict">
                            新增字典内容
                        </el-button>
                    </div>

                    <!-- 内容列表滚动区 -->
                    <div class="panel-body" v-loading="dictLoading">

                        <el-empty v-if="!currentClassify" description="请选择左侧字典分类" />

                        <el-table v-else :data="dictList" size="small" border style="width: 100%">
                            <el-table-column type="index" label="#" width="50" />
                            <el-table-column prop="dictName" label="字典名称" />
                            <el-table-column prop="dictCode" label="字典CODE" />
                            <el-table-column prop="sort" label="排序" width="80" />
                            <el-table-column prop="remark" label="备注" />
                            <el-table-column label="操作" width="120" align="center">
                                <template #default="scope">
                                    <el-button type="text" size="mini" @click="handleEditDict(scope.row)">编辑</el-button>
                                    <el-popconfirm title="确定要删除吗？" confirm-button-text="确定" cancel-button-text="取消"
                                        @confirm="handleDeleteDict(scope.row)">
                                        <el-button slot="reference" type="text" size="mini" style="color: red">
                                            删除
                                        </el-button>
                                    </el-popconfirm>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>

                </div>

            </div>

            <!-- 新增/编辑字典内容弹窗 -->
            <el-dialog :title="dictDialogTitle" :visible.sync="dictDialogVisible" width="500px">
                <el-form :model="dictForm" ref="dictFormRef" label-width="100px">
                    <el-form-item label="字典名称" prop="dictName">
                        <el-input v-model="dictForm.dictName" />
                    </el-form-item>

                    <el-form-item label="字典CODE" prop="dictCode">
                        <el-input v-model="dictForm.dictCode" />
                    </el-form-item>

                    <el-form-item label="排序" prop="sort">
                        <el-input-number v-model="dictForm.sort" :min="0" />
                    </el-form-item>
                    <el-form-item label="备注" prop="remark">
                        <el-input v-model="dictForm.remark" />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dictDialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitDictForm">确认</el-button>
                </span>
            </el-dialog>

        </el-main>
        <!-- 新增字典分类弹窗 -->
        <el-dialog title="新增字典分类" :visible.sync="classifyDialogVisible" width="420px">
            <el-form ref="classifyFormRef" :model="classifyForm" label-width="90px" :rules="classifyRules">
                <el-form-item label="上级分类">
                    <el-input v-model="classifyForm.parentName" disabled placeholder="顶级分类" />
                </el-form-item>

                <el-form-item label="分类名称" prop="classifyName">
                    <el-input v-model="classifyForm.classifyName" />
                </el-form-item>

                <el-form-item label="排序">
                    <el-input-number v-model="classifyForm.sort" :min="0" />
                </el-form-item>

                <el-form-item label="备注">
                    <el-input v-model="classifyForm.remark" />
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="classifyDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitClassifyForm">确定</el-button>
            </span>
        </el-dialog>

    </el-container>

</template>

<script>
import {
    getDictClassifyList, deleteDictClassify, addDictClassify,
    getDictList, addDict, updateDict, deleteDict
} from '@/api/dict'

export default {
    name: 'DictManage',
    data() {
        return {
            currentClassify: null,
            classifyTree: [],
            classifyProps: { label: 'classifyName', children: 'children' },

            dictList: [],
            dictLoading: false,

            // 新增/编辑字典内容
            dictDialogVisible: false,
            dictDialogTitle: '新增字典内容',
            dictForm: {
                id: null,
                dictName: '',
                dictCode: '',
                sort: 0,
                remark: ''
            },

            /** 新增分类 **/
            classifyDialogVisible: false,
            classifyForm: {
                parentId: null,
                parentName: '',
                classifyName: '',
                sort: 0,
                remark: ''
            },
            classifyRules: {
                classifyName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.loadClassifyTree()
    },
    methods: {
        // ================= 左侧分类 =================
        loadClassifyTree() {
            getDictClassifyList().then(res => {
                console.info(res)
                this.classifyTree = res.data.data || []
            })
        },
        handleClassifySelect(node) {
            this.currentClassify = node
            this.loadDictList()
        },
        handleAddClassify() {
            if (this.currentClassify) {
                this.classifyForm.parentId = this.currentClassify.id
                this.classifyForm.parentName = this.currentClassify.classifyName
            } else {
                this.classifyForm.parentId = null
                this.classifyForm.parentName = ''
            }

            this.classifyForm.classifyName = ''
            this.classifyForm.sort = 0
            this.classifyForm.remark = ''
            this.classifyDialogVisible = true
        },
        handleDeleteClassify() {
            if (!this.currentClassify) {
                this.$message.warning('请先选择一个分类')
                return
            }
            this.$confirm('确定删除该分类吗？', '提示', { type: 'warning' }).then(() => {
                deleteDictClassify([this.currentClassify.id]).then(() => {
                    this.$message.success('删除成功')
                    this.currentClassify = null
                    this.loadClassifyTree()
                })
            }).catch(() => { })
        },

        // ================= 右侧字典内容 =================
        loadDictList() {
            if (!this.currentClassify) return
            this.dictLoading = true
            getDictList({ classifyId: this.currentClassify.id }).then(res => {
                this.dictList = res.data.data || []
            }).finally(() => {
                this.dictLoading = false
            })
        },
        handleAddDict() {
            if (!this.currentClassify) {
                this.$message.warning('请先选择左侧分类')
                return
            }
            this.dictDialogTitle = '新增字典内容'
            this.dictForm = { id: null, dict_name: '', dict_code: '', sort: 0, remark: '' }
            this.dictDialogVisible = true
        },
        handleEditDict(row) {
            this.dictDialogTitle = '编辑字典内容'
            this.dictForm = { ...row }
            this.dictDialogVisible = true
        },
        submitDictForm() {
            this.$refs.dictFormRef.validate(valid => {
                if (!valid) return

                const api = this.dictForm.id ? updateDict : addDict

                api({
                    ...this.dictForm,
                    classifyId: this.currentClassify.id
                }).then(() => {
                    this.$message.success(this.dictForm.id ? '编辑成功' : '新增成功')
                    this.dictDialogVisible = false
                    this.loadDictList()
                })
            })
        },
        handleDeleteDict(row) {
            deleteDict([row.id]).then(() => {
                this.$message.success('删除成功')
                this.loadDictList()
            })
        },
        submitClassifyForm() {
            this.$refs.classifyFormRef.validate(valid => {
                if (!valid) return

                addDictClassify({
                    parentId: this.classifyForm.parentId,
                    classifyName: this.classifyForm.classifyName,
                    sort: this.classifyForm.sort,
                    remark: this.classifyForm.remark
                }).then(() => {
                    this.$message.success('新增分类成功')
                    this.classifyDialogVisible = false
                    this.loadClassifyTree()
                })
            })
        }


    }
}
</script>

<style scoped>
.dict-main {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* 顶部 */
.top-bar {
    flex-shrink: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.page-title {
    font-size: 16px;
    font-weight: 600;
}

/* 主体区域 */
.content-area {
    flex: 1;
    display: flex;
    overflow: hidden;
    gap: 12px;
}

/* 左右面板 */
.left-panel {
    width: 33%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.right-panel {
    width: 67%;
    display: flex;
    flex-direction: column;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* 面板头 */
.panel-header {
    flex-shrink: 0;
    padding: 10px 12px;
    font-weight: 600;
    border-bottom: 1px solid #ebeef5;
}

/* 工具栏 */
.panel-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
}

/* 面板内容（唯一滚动区） */
.panel-body {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
}
</style>
