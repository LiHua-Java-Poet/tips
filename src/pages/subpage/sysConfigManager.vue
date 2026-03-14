<template>
    <el-container style="height: calc(100vh - 80px);">
        <el-main class="menu-main">

            <!-- 搜索区域 -->
            <el-card shadow="never" class="search-card">
                <div class="search-top-bar">

                    <el-form :inline="true" :model="query" size="small">
                        <el-form-item label="配置名称">
                            <el-input v-model="query.conf_name" clearable />
                        </el-form-item>

                        <el-form-item label="状态">
                            <el-select v-model="query.status" clearable style="width:120px">
                                <el-option label="正常" :value="1" />
                                <el-option label="停用" :value="2" />
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" @click="handleSearch">查询</el-button>
                            <el-button @click="handleReset">重置</el-button>
                        </el-form-item>
                    </el-form>

                    <el-button type="primary" size="small" @click="openAddDialog">
                        新增配置
                    </el-button>
                </div>
            </el-card>

            <!-- 表格区域 -->
            <div class="table-scroll-area">
                <el-table :data="list" border stripe size="small" v-loading="loading" :height="tableHeight">

                    <el-table-column type="index" width="60" label="序号" align="center" />

                    <el-table-column prop="confName" label="配置名称" width="200" />

                    <el-table-column prop="confContent" label="配置内容" />

                    <el-table-column prop="description" label="描述" />

                    <el-table-column label="状态" width="100">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
                                {{ scope.row.status === 1 ? '正常' : '停用' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="创建时间" width="180">
                        <template slot-scope="scope">
                            {{ formatTime(scope.row.createTime) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="更新时间" width="180">
                        <template slot-scope="scope">
                            {{ formatTime(scope.row.updateTime) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="180" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="mini" @click="openEditDialog(scope.row)">
                                编辑
                            </el-button>
                            <el-button type="text" size="mini" style="color:red" @click="handleDelete(scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>
            </div>

            <!-- 分页 -->
            <div class="pagination">
                <el-pagination background layout="total, sizes, prev, pager, next" :total="total"
                    :page-size="query.limit" :current-page="query.page" @size-change="handleSizeChange"
                    @current-change="handlePageChange" />
            </div>

            <!-- 弹窗 -->
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
                <el-form :model="form" ref="formRef" label-width="100px">

                    <el-form-item label="配置名称" prop="conf_name"
                        :rules="[{ required: true, message: '请输入配置名称', trigger: 'blur' }]">
                        <el-input v-model="form.conf_name" />
                    </el-form-item>

                    <el-form-item label="配置内容" prop="conf_content"
                        :rules="[{ required: true, message: '请输入配置内容', trigger: 'blur' }]">
                        <el-input v-model="form.conf_content" />
                    </el-form-item>

                    <el-form-item label="描述">
                        <el-input type="textarea" v-model="form.description" />
                    </el-form-item>

                    <el-form-item label="状态">
                        <el-radio-group v-model="form.status">
                            <el-radio :label="1">正常</el-radio>
                            <el-radio :label="2">停用</el-radio>
                        </el-radio-group>
                    </el-form-item>

                </el-form>

                <span slot="footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确认</el-button>
                </span>
            </el-dialog>

        </el-main>
    </el-container>
</template>

<script>
import { getConfigList, addConfig, deleteTask } from '@/api/sys'

export default {
    name: 'SysConfig',
    data() {
        return {
            loading: false,
            list: [],
            total: 0,
            tableHeight: 620,

            query: {
                conf_name: '',
                status: null,
                page: 1,
                limit: 10
            },

            dialogVisible: false,
            dialogTitle: '新增配置',

            form: {
                id: null,
                conf_name: '',
                conf_content: '',
                description: '',
                status: 1
            }
        }
    },

    created() {
        this.fetchList()
    },

    methods: {

        fetchList() {
            this.loading = true
            getConfigList(this.query).then(res => {
                this.list = res.data.list
                this.total = res.data.total
            }).finally(() => {
                this.loading = false
            })
        },

        handleSearch() {
            this.query.page = 1
            this.fetchList()
        },

        handleReset() {
            this.query = {
                conf_name: '',
                status: null,
                page: 1,
                limit: 10
            }
            this.fetchList()
        },

        handleSizeChange(size) {
            this.query.limit = size
            this.fetchList()
        },

        handlePageChange(page) {
            this.query.page = page
            this.fetchList()
        },

        openAddDialog() {
            this.dialogTitle = '新增配置'
            this.form = {
                id: null,
                conf_name: '',
                conf_content: '',
                description: '',
                status: 1
            }
            this.dialogVisible = true
        },

        openEditDialog(row) {
            this.dialogTitle = '编辑配置'
            this.form = { ...row }
            this.dialogVisible = true
        },

        submitForm() {
            this.$refs.formRef.validate(valid => {
                if (!valid) return

                addConfig(this.form).then(() => {
                    this.$message.success(this.form.id ? '编辑成功' : '新增成功')
                    this.dialogVisible = false
                    this.fetchList()
                })
            })
        },

        handleDelete(row) {
            this.$confirm('确定删除该配置吗？', '提示', { type: 'warning' })
                .then(() => {
                    deleteTask([row.id]).then(() => {
                        this.$message.success('删除成功')
                        this.fetchList()
                    })
                })
        },

        formatTime(timestamp) {
            if (!timestamp) return ''
            const date = new Date(timestamp * 1000)
            return `${date.getFullYear()}-${(date.getMonth() + 1)
                .toString().padStart(2, '0')}-${date.getDate()
                    .toString().padStart(2, '0')} ${date.getHours()
                        .toString().padStart(2, '0')}:${date.getMinutes()
                            .toString().padStart(2, '0')}:${date.getSeconds()
                                .toString().padStart(2, '0')}`
        }

    }
}
</script>

<style>
.menu-main {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.search-card {
    flex-shrink: 0;
    margin-bottom: 12px;
    padding: 12px 16px;
}

.search-top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.table-scroll-area {
    flex: 1;
    overflow-y: auto;
}

.pagination {
    flex-shrink: 0;
    margin-top: 12px;
    text-align: right;
}
</style>