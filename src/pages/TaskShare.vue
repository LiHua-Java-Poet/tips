<template>
    <el-container style="height: 100vh; padding: 30px;">
        <el-main class="share-wrapper">
            <!-- 加载骨架 -->
            <el-skeleton v-if="loading" animated />

            <!-- 任务信息 -->
            <div v-else-if="taskInfo">
                <!-- 顶部 -->
                <div class="top-bar">
                    <el-tag type="info">任务详情</el-tag>
                    <el-button v-if="isEdit" type="primary" size="small" @click="openDrawer">
                        修改
                    </el-button>
                </div>

                <!-- 基础信息 -->
                <div class="task-base-info">
                    <h2 class="task-title">{{ taskInfo.taskName }}</h2>
                    <div class="task-desc">{{ taskInfo.description || '无描述' }}</div>
                    <div class="task-time">任务时间：{{ formatDate(taskInfo.taskTime) }}</div>
                </div>

                <!-- 任务项 -->
                <div v-if="selectedTaskInfo.itemToList?.length > 0" class="remark-content-container">
                    <strong class="remark-title">任务项：</strong>
                    <ul class="remark-list">
                        <li v-for="(item, index) in selectedTaskInfo.itemToList" :key="index" class="remark-item">
                            <!-- 标签 Popover -->
                            <el-popover placement="right" trigger="click" width="180" v-model="item._popoverVisible"
                                popper-class="remark-tag-popover" @show="item._popoverVisible = false">
                                <div class="tag-options">
                                    <div v-for="dict in dictMap.taskItemLable" :key="dict.dictCode"
                                        class="tag-option-item" @click="handleChangeItemLabel(item, dict)">
                                        <span class="tag-color-dot" :style="{ backgroundColor: dict.color }"></span>
                                        <span class="tag-name">{{ dict.dictName }}</span>
                                    </div>
                                </div>

                                <template slot="reference">
                                    <!-- 关键修改：添加固定宽度的外层容器 -->
                                    <div class="tag-badge-container">
                                        <span class="tag-badge" :style="{
                                            backgroundColor: dictMap.taskItemLable.find(d => d.dictCode === item.label)?.color || '#909399'
                                        }">
                                            {{dictMap.taskItemLable.find(d => d.dictCode === item.label)?.dictName ||
                                                '未分类'}}
                                        </span>
                                    </div>
                                </template>
                            </el-popover>

                            <!-- 编号 -->
                            <span class="item-number">{{ item.no }}.</span>
                            <!-- 内容 -->
                            <span class="item-content"> {{ item.itemContext }}</span>
                        </li>
                    </ul>
                </div>
                <!-- 附件 -->
                <div class="task-annex" v-if="taskInfo.annexFiles?.length">
                    <div class="annex-title">附件</div>
                    <AnnexFileView :fileList="taskInfo.annexFiles" />
                </div>
            </div>

            <!-- 空状态 -->
            <el-empty v-else description="任务不存在" />
        </el-main>

        <!-- Drawer 编辑 -->
        <el-drawer title="编辑任务" :visible.sync="drawerVisible" size="600px" :before-close="handleClose">
            <el-form ref="taskForm" :model="taskForm" label-width="100px" style="padding-right: 30px;">
                <el-form-item label="任务描述">
                    <el-input autosize type="textarea" v-model="taskForm.description" placeholder="请输入任务描述" />
                </el-form-item>

                <el-form-item label="任务时间">
                    <el-date-picker v-model="taskForm.taskTime" type="date" placeholder="选择日期" style="width: 100%;" />
                </el-form-item>

                <el-form-item label="任务项">
                    <div v-for="(item, index) in taskForm.itemToList" :key="index"
                        style="display: flex; align-items: center; margin-bottom: 8px;">
                        <span style="
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                background-color: #e0e0e0;
                border-radius: 50%;
                font-size: 12px;
                color: #333;
                margin-right: 15px;
              ">
                            {{ item.no }}
                        </span>

                        <el-input v-model="item.itemContext" placeholder="请输入内容" style="flex: 1; margin-right: 10px;" />
                        <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="removeItem(index)" />
                    </div>

                    <el-button type="primary" icon="el-icon-plus" size="mini" circle @click="addItem" />
                </el-form-item>

                <el-form-item label="附件内容">
                    <AnnexFileUpload :value="taskForm.annexFiles" @update="taskForm.annexFiles = $event"
                        ref="AnnexFileUpload" />
                </el-form-item>
            </el-form>

            <!-- Drawer 底部 -->
            <div style="text-align: right; margin-top: 20px; padding-right: 30px; margin-bottom: 20px;">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="submitFormTask">保存</el-button>
            </div>
        </el-drawer>
    </el-container>
</template>

<script>
import { shareTaskInfo, shareUpdate } from '@/api/task'
import { getDictList } from '@/api/dict'
import { formatDate } from '@/utils/navigator'
import AnnexFileView from '@/components/AnnexFileView.vue'
import AnnexFileUpload from '@/components/AnnexFileUpload.vue';
import { getUniqueCode } from '@/api/public';

export default {
    name: 'TaskShare',
    components: { AnnexFileView, AnnexFileUpload },

    data() {
        return {
            code: null,       // 从地址栏获取
            id: null,         // 从接口返回的数据里获取
            mode: 'view',
            loading: false,
            taskInfo: null,
            taskItemLabelDict: [],
            drawerVisible: false,
            uniqueCode: null,
            taskForm: {
                description: '',
                taskTime: null,
                itemToList: [],
                taskType: '',
                annexFiles: []
            },
            dictMap: {
                taskItemLable: []
            }
        }
    },

    computed: {
        isEdit() {
            return this.mode === 'edit'
        },

        selectedTaskInfo() {
            return this.taskInfo || { itemToList: [] }
        }
    },

    created() {
        // 从地址栏获取 code
        this.code = this.$route.query.code
        this.mode = this.$route.query.mode || 'view'
        if (!this.code) return

        // 拉取任务信息
        this.fetchTask()

        // 获取任务标签字典
        getDictList({ classifyCode: 'taskItemLable' }).then(res => {
            this.taskItemLabelDict = res.data || []
            this.dictMap.taskItemLable = this.taskItemLabelDict
        })
    },

    methods: {
        formatDate,

        async fetchTask() {
            this.loading = true
            try {
                // 调用接口只传 code
                const res = await shareTaskInfo({ code: this.code })
                if (res.code === 200 && res.data) {
                    this.taskInfo = res.data
                    // 从接口返回的数据里取 id
                    this.id = res.data.id
                } else {
                    this.$message.warning('任务不存在')
                    this.taskInfo = null
                }
            } catch (err) {
                console.error(err)
                this.$message.error('获取任务信息失败')
                this.taskInfo = null
            } finally {
                this.loading = false
            }
        },

        async openDrawer() {
            await getUniqueCode().then(res => {
                this.uniqueCode = res.data
            })
            if (!this.taskInfo) return
            this.taskForm = JSON.parse(
                JSON.stringify({
                    description: this.taskInfo.description,
                    taskTime: new Date(this.taskInfo.taskTime * 1000),
                    itemToList: this.taskInfo.itemToList || [],
                    taskType: this.taskInfo.taskType,
                    annexFiles: this.taskInfo.annexFiles || []
                })
            )
            this.drawerVisible = true
        },

        handleClose() {
            this.drawerVisible = false
        },

        addItem() {
            const no = this.taskForm.itemToList.length + 1
            this.taskForm.itemToList.push({ no, itemContext: '', label: '' })
        },

        removeItem(index) {
            this.taskForm.itemToList.splice(index, 1)
            this.taskForm.itemToList.forEach((item, idx) => (item.no = idx + 1))
        },

        async submitFormTask() {
            if (!this.id) return

            // 确保 taskTime 是 Date 对象
            let taskTime = this.taskForm.taskTime
            if (taskTime) {
                if (!(taskTime instanceof Date)) {
                    taskTime = new Date(taskTime) // 字符串或时间戳转 Date
                }
            }

            const payload = {
                id: this.id,
                description: this.taskForm.description,
                taskTime: taskTime ? Math.floor(taskTime.getTime() / 1000) : null, // 秒级时间戳
                itemToList: this.taskForm.itemToList,
                taskType: this.taskForm.taskType,
                annexFiles: this.taskForm.annexFiles,
                uniqueCode: this.uniqueCode
            }

            const res = await shareUpdate(payload)
            if (res.code === 200) {
                this.$message.success('保存成功')
                this.drawerVisible = false
                this.fetchTask()
            }
        },

        changeItemLabel(item, dict) {
            item.label = dict.dictCode
            item._popoverVisible = false
        },

        handleChangeItemLabel(item, dict) {
            this.changeItemLabel(item, dict)
        }
    }
}
</script>


<style scoped>
.remark-title {
    margin-bottom: 10px;
}

.share-wrapper {
    background: #fff;
    border-radius: 10px;
    padding: 20px;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.task-base-info {
    margin-bottom: 30px;
}

.task-title {
    font-size: 22px;
    font-weight: 600;
}

.task-desc {
    color: #666;
    margin: 8px 0;
    white-space: pre-wrap;
    /* 保留换行和空格 */
    word-wrap: break-word;
    /* 超长单词换行 */
}


.task-time {
    font-size: 13px;
    color: #999;
}

.task-item-area {
    border-top: 1px solid #eee;
    padding-top: 20px;
}

.remark-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.remark-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
}

.tag-badge-container {
    width: 100px;
    /* 固定宽度，根据需要调整 */
    display: flex;
    justify-content: center;
    /* 水平居中 */
    margin-right: 8px;
}

.tag-badge {
    display: inline-block;
    width: 100%;
    /* 占满容器宽度 */
    text-align: center;
    /* 文字居中 */
    padding: 4px 0;
    /* 上下内边距，可根据需求调整 */
    border-radius: 12px;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
    white-space: nowrap;
    /* 防止文字换行 */
    overflow: hidden;
    text-overflow: ellipsis;
    /* 超长文字显示省略号 */
}


.item-number {
    margin-right: 6px;
    font-weight: 600;
    color: #409eff;
}

.item-content {
    color: #333;
}

.item-edit-input {
    flex: 1;
}

.tag-options {
    display: flex;
    flex-direction: column;
}

.tag-option-item {
    display: flex;
    align-items: center;
    padding: 6px;
    cursor: pointer;
}

.tag-option-item:hover {
    background: #f5f7fa;
}

.tag-color-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-right: 6px;
}
</style>
