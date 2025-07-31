<template>
    <el-container style="height: 100%;">
      <el-aside width="250px" class="aside-custom">
            <div class="collect-add">
                <img style="width: 30px; height: 30px;" src="../../assets/ioc/collect/add.png">
                <span>新增会话</span>
            </div>
            <div class="collect-scroll-wrapper">
                <el-card class="collect-card" v-for="(item,index) in collectList" :key="index">
                    {{ item }}
                </el-card>
            </div>
      </el-aside>
      <el-container>
        <el-main class="chat-container">
            <!-- 聊天区域 -->
                <!-- 消息显示区域 -->
                <div class="chat-message-area">
                  <div class="message" v-for="(msg, index) in messages" :key="index">
                    <div class="message-bubble">{{ msg.text }}</div>
                  </div>
                </div>
                <!-- 控件区域 -->
                <div>
                  <el-radio-group v-model="radio">
                    <el-radio :label="3">仅记录</el-radio>
                    <el-radio :label="6">知识库</el-radio>
                    <el-radio :label="9">Ai回复</el-radio>
                  </el-radio-group>
                </div>
                <!-- 信息输入区域 -->
                <div class="chat-input-area">
                  <el-input
                    type="textarea"
                    v-model="newMessage"
                    class="input-box"
                    maxlength="5000"
                    show-word-limit
                    :rows="5"
                    resize="none"
                    placeholder="请输入消息..."
                    @keydown.native="handleKeydown"
                  />
                  <el-button
                    type="primary"
                    class="send-button"
                    @click="sendMessage"
                  >
                    发送
                  </el-button>
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
        ],
        newMessage: '',
        radio:3,
        collectList:['会话1号','会话1号','会话1号']
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
    },
    handleKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // 阻止默认换行行为
        this.sendMessage();
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const container = this.$el.querySelector('.chat-message-area');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  },
  computed: {

  }
};
</script>


<style scoped>
/* 左侧面板 */
.aside-custom {
  background-color: #fff;
  padding: 16px;
  border-radius: 10px;
  margin-right: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0; /* 关键 */
}

/* 新增会话按钮 */
.collect-add {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  border: 1px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}
.collect-add:hover {
  background-color: #f0faff;
  border-color: #409eff;
}
.collect-add img {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

/* 滚动区域填满剩余空间 */
.collect-scroll-wrapper {
  flex: 1;
  min-height: 0; /* 关键：允许滚动区域缩放 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 滚动条美化 */
.collect-scroll-wrapper::-webkit-scrollbar {
  width: 6px;
}
.collect-scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}
.collect-scroll-wrapper:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}

/* 卡片样式 */
.collect-card {
  cursor: pointer;
  border-radius: 8px;
  padding: 12px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;      /* 避免卡片被压缩 */
  text-align: left;
  flex: none;
  height: 40px;
}
.collect-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 主区域容器 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

/* 消息显示区域 */
.chat-message-area {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  margin-bottom: 15px;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

/* 每条消息 */
.message {
  margin-bottom: 10px;
  display: flex;
}
.message-bubble {
  background-color: #f1f3f5;
  padding: 10px 14px;
  border-radius: 14px;
  font-size: 14px;
  max-width: 80%;
  word-break: break-word;
  white-space: pre-wrap;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

/* 控件（Radio）区域 */
.el-radio-group {
  margin-bottom: 15px;
  padding-left: 4px;
}

/* 信息输入区域 */
.chat-input-area {
  position: relative;
  padding: 12px;
  border-top: 1px solid #eee;
  background-color: #fafafa;
}

.input-box {
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
}

.el-textarea__inner {
  border-radius: 8px;
  padding: 12px;
  resize: none !important;
  min-height: 50px;
  max-height: 50px;
  font-size: 14px;
  line-height: 1.6;
  box-sizing: border-box;
}

.send-button {
  position: absolute;
  bottom: 18px;
  right: 20px;
  padding: 6px 18px;
  font-size: 14px;
  border-radius: 6px;
}

</style>

