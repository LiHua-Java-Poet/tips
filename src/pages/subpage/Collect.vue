<template>
    <el-container style="height: 100%;">
      <el-aside width="250px" class="aside-custom">
                <el-card class="collect-card">
                    新增空间
                </el-card>
            <div class="collect-scroll-wrapper">
                <el-card class="collect-card">
                    计划1号
                </el-card>
                <el-card class="collect-card">
                    计划2号
                </el-card>
                <el-card class="collect-card">
                    计划3号
                </el-card>
                <el-card class="collect-card">
                    计划3号
                </el-card>
                                <el-card class="collect-card">
                    计划3号
                </el-card>
                                <el-card class="collect-card">
                    计划3号
                </el-card>
            </div>
      </el-aside>
      <el-container>
        <el-main style="background-color: rgb(255, 255, 255);border-radius: 10px;">
            <!-- 聊天区域 -->
            <div class="chat-container">
                <!-- 消息显示区域 -->
                <div class="chat-message-area">
                    <div class="message" v-for="(msg, index) in messages" :key="index">
                    <div class="message-bubble">{{ msg.text }}</div>
                    </div>
                </div>

                <!-- 信息输入区域 -->
                <div class="chat-input-area">
                    <el-input
                    type="textarea"
                    v-model="newMessage"
                    class="input-box"
                    :autosize="{ minRows: 2, maxRows: 6 }"
                    resize="vertical"
                    placeholder="请输入消息..."
                    />
                    <el-button type="primary" @click="sendMessage" class="send-button">发送</el-button>
                </div>
            </div>
        </el-main>
      </el-container>
    </el-container>
</template>

<script>

export default {
  name: "collectPage",
  data() {
    return {
        showStatus: 1,
        dateRange: [], // 存储起止日期，[startDate, endDate]
        searchText:'',
        messages: [
            { text: '欢迎来到聊天区！' },
            { text: '这是历史消息1' },
            { text: '这是历史消息2' },
            { text: '欢迎来到聊天区！' },
            { text: '这是历史消息1' },
            { text: '这是历史消息2' },
            { text: '欢迎来到聊天区！' },
            { text: '这是历史消息1' },
            { text: '这是历史消息2' },
            { text: '欢迎来到聊天区！' },
            { text: '这是历史消息1' },
            { text: '这是历史消息2' },
            { text: '欢迎来到聊天区！' },
            { text: '这是历史消息1' },
            { text: '这是历史消息2' },
            { text: '欢迎来到聊天区！' },
            { text: '这是历史消息1' },
            { text: '这是历史消息2' },
            { text: '欢迎来到聊天区！' },
            { text: '这是历史消息1' },
            { text: '这是历史消息2' },
        ],
        newMessage: ''
    };
  },
  methods: {
    setStatus(status) {
      this.showStatus = status;
    },
    sendMessage() {
        const content = this.newMessage.trim();
        if (content) {
        this.messages.push({ text: content });
        this.newMessage = '';
        this.$nextTick(() => {
            const container = this.$el.querySelector('.chat-message-area');
            container.scrollTop = container.scrollHeight;
        });
        }
    }
  },
};
</script>

<style scoped>
/* 顶部状态按钮优化 */
.status-button {
  padding: 8px 16px;
  background-color: #f5f5f5;
  text-align: center;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
  margin: 0 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border: 1px solid #ddd;
}

.status-button:hover {
  background-color: #e0e0e0;
}

.status-button.process {
  background-color: #409eff;
  color: white;
  border: none;
}
.status-button.finish {
  background-color: #67c23a;
  color: white;
  border: none;
}
.status-button.cancel {
  background-color: #f56c6c;
  color: white;
  border: none;
}

/* 图标手型 + hover 提示 */
.icon {
  cursor: pointer;
  fill: #666;
  transition: all 0.2s;
}
.icon:hover {
  fill: #409eff;
  transform: scale(1.1);
}

/* 卡片样式优化 */
.collect-card {
  width: 95%;
  height: 60px;
  margin: 10px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}
.collect-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 弹出表单优化（你可放在 style scoped 里） */
.el-popover .el-form {
  padding: 10px;
}

/* 主体与侧栏的布局间距 */
.el-aside {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.el-main {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  min-height: 300px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}


/* 设置 el-aside 外观 */
.aside-custom {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%; /* 填满容器高度 */
}

.collect-scroll-wrapper {
  flex: 1;
  overflow-y: auto;
  max-height: 500px;
  padding-right: 6px; /* 预留空间防止遮挡 */
  scrollbar-width: none;           /* Firefox */
  -ms-overflow-style: none;        /* IE */
}

/* Chrome */
.collect-scroll-wrapper::-webkit-scrollbar {
  width: 6px;            /* 始终保留宽度，防止跳动 */
  background: transparent;
}

/* 默认不显示滑块 */
.collect-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: transparent;
}

/* hover 时显示滑块，不改变整体宽度 */
.collect-scroll-wrapper:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px; /* 整个聊天区域高度固定 */
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  background-color: #fafafa;
}

/* 消息区域：允许滚动 */
.chat-message-area {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  background-color: #ffffff;
  border: 1px solid #eee;
}

/* 单条消息样式：靠左 */
.message {
  margin-bottom: 10px;
  display: flex;
}

.message-bubble {
  background-color: #f1f3f5;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  max-width: 80%;
  word-break: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  white-space: pre-wrap;

}

/* 输入区域 */
.chat-input-area {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

/* 多行可拖拽 */
.input-box {
  flex: 1;
  resize: vertical;
}

/* 发送按钮 */
.send-button {
  flex-shrink: 0;
}


</style>