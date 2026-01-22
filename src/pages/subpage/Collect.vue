<template>
  <el-container style="height: 100%;">
    <el-aside width="250px" class="aside-custom">
      <div class="collect-add" @click="openAddDialog">
        <img style="width: 30px; height: 30px;" src="../../assets/ioc/collect/add.png">
        <span>新增会话</span>
      </div>
      <div class="collect-scroll-wrapper">
        <el-card class="collect-card" v-for="(item, index) in sessionList" :key="index"
          :class="{ selected: selectedSeeionId === item.id }" @click.native="selectSeeion(item.id)">
          <div class="card-content">
            {{ item.title }}
          </div>
          <!-- 右上角固定的按钮 -->
          <el-popover placement="bottom-end" width="150" trigger="click">
            <div class="menu-item" @click="openUpdateName(item)">重命名</div>
            <div class="menu-item" @click="deleteSessions(item)">删除</div>
            <template #reference>
              <button class="more-btn" @click.stop>⋮</button>
            </template>
          </el-popover>
        </el-card>
        <el-empty description="没有会话" image-size="100" v-if="sessionList.length == 0"></el-empty>
      </div>
    </el-aside>
    <el-container>
      <el-main class="chat-container">
        <!-- 聊天区域 -->
        <!-- 消息显示区域 -->
        <div class="chat-message-area" :style="{ fontFamily: messageFontFamily }">
          <div class="message" v-for="(msg, index) in messages" :key="index">
            <div class="message-bubble">
              {{msg.content}}
            </div>
            <span class="delete-btn" @click="deleteMessage(msg)">
              <img style="width: 20px;height: 20px;" src="@/assets/ioc/collect/delete.png" />
            </span>
            <span class="delete-btn" @click="copyMessage(msg)">
              <img style="width: 20px;height: 20px;" src="@/assets/ioc/collect/copy.png" />
            </span>
          </div>
        </div>
        <!-- 控件区域 -->
        <div class="chat-toolbar">
          <!-- 左侧：模式选择 -->
          <el-radio-group v-model="radio">
            <el-radio :label="1">仅记录</el-radio>
            <el-radio :label="2">知识库</el-radio>
            <el-radio :label="3">Ai回复</el-radio>
          </el-radio-group>

          <!-- 右侧：字体选择 -->
          <el-select v-model="fontFamily" size="small" style="width: 160px">
            <el-option label="默认（系统字体）" value="ui" />
            <el-option label="微软雅黑" value="yahei" />
            <el-option label="宋体（传统）" value="simsun" />
            <el-option label="黑体" value="simhei" />
            <el-option label="楷体" value="kaiti" />
          </el-select>

        </div>
        <!-- 信息输入区域 -->
        <div class="chat-input-area">
          <el-input type="textarea" v-model="newMessage" class="input-box" maxlength="5000" show-word-limit :rows="5"
            resize="none" placeholder="请输入消息..." @keydown.native="handleKeydown" />
          <el-button type="primary" class="send-button" @click="sendMessage">
            发送
          </el-button>
        </div>
      </el-main>
    </el-container>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="400px" @close="newSessionTitle = ''">
      <el-input v-model="newSessionTitle" placeholder="请输入会话标题" maxlength="100" show-word-limit />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="navigatorFuntion">确定</el-button>
      </template>
    </el-dialog>

  </el-container>
</template>

<script>
import { getSessionList, saveSession, getMessageList, saveMessage, deleteMessage, updateSession, deleteSession } from '@/api/collect';
import { getUniqueCode } from '@/api/public';
export default {
  name: "collectPage",
  data() {
    return {
      showStatus: 1,
      dateRange: [], // 存储起止日期，[startDate, endDate]
      searchText: '',
      messages: [],
      newMessage: '',
      radio: 1,
      sessionList: [],
      dialogVisible: false,
      newSessionTitle: '',
      sessionCode: '',
      selectedSeeionId: null,
      title: '',
      seesionType: 1,
      updateSession: null,
      fontFamily: 'simsun', // 默认宋体
    };
  },
  methods: {
    setStatus(status) {
      this.showStatus = status;
    },
    async sendMessage() {
      const content = this.newMessage.trim();
      if (content) {
        await saveMessage({
          sessionId: this.selectedSeeionId,
          collectType: 1,
          content: content,
          messageType: this.radio
        })
        this.messages.push({ content: content });
        this.newMessage = '';
        this.$nextTick(() => {
          const container = this.$el.querySelector('.chat-message-area');
          container.scrollTop = container.scrollHeight;
        });
      }
    },
    handleKeydown(e) {
      // Ctrl + Enter 换行
      if (e.key === 'Enter' && e.ctrlKey) {
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;

        // 在光标位置插入换行符
        textarea.value = value.substring(0, start) + '\n' + value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        e.preventDefault(); // 阻止默认行为
        this.newMessage = textarea.value;
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        // 阻止默认换行行为
        e.preventDefault();
        this.sendMessage();
      }
    },
    async fetchSessions() {
      const res = await getSessionList();
      this.sessionList = res.data || [];
      //刷新一次会话列表的话，先选中第一个
      if (this.sessionList.length > 0) {
        this.selectSeeion(this.sessionList[0].id)
      }
    },
    navigatorFuntion() {
      if (this.seesionType == 1) {
        this.addSession()
      } else {
        this.updateSessionAction()
      }
    },
    async addSession() {
      if (!this.newSessionTitle.trim()) {
        this.$message.warning('请输入会话标题');
        return;
      }
      const res = await saveSession({ title: this.newSessionTitle, uniqueCode: this.sessionCode });
      if (res.code === 200) {
        this.$message.success('新增成功');
        this.dialogVisible = false;
        this.newSessionTitle = '';
        this.fetchSessions(); // 刷新会话列表
      } else {
        this.$message.error(res.message || '新增失败');
      }
    },
    async openAddDialog() {
      this.title = '新增会话'
      this.seesionType = 1
      try {
        const res = await getUniqueCode();
        const code = res?.data;
        if (!code) {
          this.$message.error('获取会话编号失败');
          return;
        }
        this.sessionCode = code;
        this.dialogVisible = true;
      } catch (e) {
        this.$message.error('请求唯一码失败');
        console.error(e);
      }
    },
    openUpdateName(item) {
      this.title = '重命名会话'
      this.seesionType = 2
      this.dialogVisible = true;
      this.updateSession = item
    },
    updateSessionAction() {
      updateSession({ id: this.updateSession.id, title: this.newSessionTitle }).then(res => {
        if (res.data.code == 200) {
          this.$message.success('修改成功')
        }
        this.updateSession.title = this.newSessionTitle
        this.dialogVisible = false;
      })
    },
    async selectSeeion(id) {
      this.selectedSeeionId = id
      await getMessageList({ sessionId: id }).then(res => {
        this.messages = res.data.reverse()
      })
    },
    deleteSessions(item) {
      this.$confirm('确认删除？')
        .then(() => {
          deleteSession([item.id]).then(() => {
            let index = this.sessionList.indexOf(item);
            if (index !== -1) {
              this.sessionList.splice(index, 1);
            }
            this.$message.success('删除成功')
          })
        })
        .catch(() => { });
    },
    deleteMessage(msg) {
      this.$confirm('确认删除？')
        .then(() => {
          deleteMessage([msg.id]).then(() => {
            let index = this.messages.indexOf(msg);
            if (index !== -1) {
              this.messages.splice(index, 1);
            }
            this.$message.success('删除成功')
          })
        })
        .catch(() => { });
    },
    copyMessage(msg) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(msg.content)
          .then(() => this.$message.success('复制成功'))
          .catch(() => this.fallbackCopy(msg.content))
      } else {
        this.fallbackCopy(msg.content)
      }
    },
    fallbackCopy(text) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.top = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$message.success('复制成功')
    }
  },
  mounted() {
    this.$nextTick(() => {
      const container = this.$el.querySelector('.chat-message-area');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
    this.fetchSessions();
  },
  computed: {
    messageFontFamily() {
      switch (this.fontFamily) {
        case 'yahei':
          return '"Microsoft YaHei", Arial, sans-serif'
        case 'simsun':
          return 'SimSun, serif'
        case 'simhei':
          return 'SimHei, sans-serif'
        case 'kaiti':
          return 'KaiTi, serif'
        default:
          return 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", Arial, sans-serif'
      }
    }
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
  min-height: 0;
  /* 关键 */
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
  margin-bottom: 10px;
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
  min-height: 0;
  /* 关键：允许滚动区域缩放 */
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 5px;
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
  padding: 8px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-height: 40px;
  /* 避免卡片被压缩 */
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
  align-items: center;
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

.message-bubble:hover {
  background: #e9e9e9;
}

/* 默认隐藏按钮 */
.delete-btn {
  margin-left: 8px;
  color: #999;
  cursor: pointer;
  display: none;
  white-space: nowrap;
}

/* 当鼠标悬停在整条 message（气泡或按钮）时显示按钮 */
.message:hover .delete-btn {
  display: inline;
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

.selected {
  background-color: rgb(234, 234, 234);
  /* 深色 */
}

.collect-card {
  position: relative;
  /* 用于定位右上角按钮 */
  cursor: pointer;
  border-radius: 8px;
  padding: 12px 40px 12px 12px;
  /* 右侧预留空间放按钮 */
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
  min-height: 40px;
  height: 40px;
  display: flex;
  align-items: center;
}

/* 只放标题 */
.card-content {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
}

/* 固定在卡片右侧的按钮 */
.more-btn {
  position: absolute;
  right: 10px;
  /* 固定右边距 */
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  color: #666;
}

.more-btn:hover {
  color: #333;
}

/* popover 菜单 */
.menu-item {
  padding: 8px 10px;
  cursor: pointer;
}

.menu-item:hover {
  background: #f5f5f5;
}

.chat-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 4px;
}
</style>
