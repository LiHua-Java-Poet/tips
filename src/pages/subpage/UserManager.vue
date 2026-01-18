<template>
  <el-container style="height: calc(100vh - 80px);">
    <el-main class="user-main">

      <!-- 查询区域（保留白卡片样式） -->
      <el-card shadow="never" class="search-card">
        <div class="search-top-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <!-- 查询表单 -->
          <el-form :inline="true" :model="query" size="small">
            <el-form-item label="用户名">
              <el-input v-model="query.userName" clearable />
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="query.account" clearable />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="query.phone" clearable />
            </el-form-item>
            <el-form-item label="用户类型">
              <el-select v-model="query.type" clearable style="width: 120px">
                <el-option label="普通用户" :value="1" />
                <el-option label="管理员" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="query.status" clearable style="width: 120px">
                <el-option label="正常" :value="1" />
                <el-option label="停用" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button @click="handleReset">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 新增按钮 -->
          <el-button type="primary" size="small" @click="openAddDialog">新增用户</el-button>
        </div>
      </el-card>

      <!-- 表格滚动区域 -->
      <div class="table-scroll-area">
        <el-table
          :data="list"
          border
          stripe
          size="small"
          v-loading="loading"
          :height="tableHeight"
        >
          <el-table-column type="index" width="50" label="序号" />
          <el-table-column prop="userName" width="150" label="用户名" />
          <el-table-column prop="account" label="账号" />
          <el-table-column prop="phone" label="手机号" />
          <el-table-column prop="type" label="用户类型" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.type === 2" type="danger">管理员</el-tag>
              <el-tag v-else>普通用户</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
              <el-tag v-else type="info">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="160" />
          <el-table-column label="操作" width="160" fixed="right">
            <template #default="scope">
              <el-button type="text" size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" style="color:red" @click="handleDelete(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          :total="total"
          :page-size="query.limit"
          :current-page="query.page"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 新增/编辑弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
        <el-form :model="form" ref="formRef" label-width="100px">
          <el-form-item label="用户名" prop="userName" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
            <el-input v-model="form.userName" />
          </el-form-item>
          <el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
            <el-input v-model="form.account" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" />
          </el-form-item>
          <el-form-item label="用户类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择类型">
              <el-option label="普通用户" :value="1" />
              <el-option label="管理员" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="密码" v-if="!form.id">
            <el-input type="password" v-model="form.password" placeholder="新增用户需要设置密码" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">确认</el-button>
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import { userList, addUser, updateUser, deleteUser } from '@/api/user';

export default {
  name: 'UserList',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      tableHeight: 620,
      query: {
        account: '',
        userName: '',
        phone: '',
        type: null,
        status: null,
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      dialogTitle: '新增用户',
      form: {
        id: null,
        userName: '',
        account: '',
        phone: '',
        type: 1,
        status: 1,
        password: ''
      }
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      this.loading = true;
      userList(this.query)
        .then(res => {
          const data = res.data.data;
          this.list = data.list;
          this.total = data.count;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearch() {
      this.query.page = 1;
      this.fetchList();
    },
    handleReset() {
      this.query = {
        account: '',
        userName: '',
        phone: '',
        type: null,
        status: null,
        page: 1,
        limit: 10
      };
      this.fetchList();
    },
    handleSizeChange(size) {
      this.query.limit = size;
      this.fetchList();
    },
    handlePageChange(page) {
      this.query.page = page;
      this.fetchList();
    },
    openAddDialog() {
      this.dialogTitle = '新增用户';
      this.form = { id: null, userName: '', account: '', phone: '', type: 1, status: 1, password: '' };
      this.dialogVisible = true;
    },
    openEditDialog(row) {
      this.dialogTitle = '编辑用户';
      this.form = { ...row, password: '' }; // 编辑不显示密码
      this.dialogVisible = true;
    },
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;

        if (this.form.id) {
          updateUser(this.form).then(() => {
            this.$message.success('编辑成功');
            this.dialogVisible = false;
            this.fetchList();
          });
        } else {
          addUser(this.form).then(() => {
            this.$message.success('新增成功');
            this.dialogVisible = false;
            this.fetchList();
          });
        }
      });
    },
    handleDelete(id) {
      this.$confirm('确定删除该用户吗？', '提示', { type: 'warning' })
        .then(() => {
          deleteUser([id]).then(() => {
            this.$message.success('删除成功');
            this.fetchList();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped>
.user-main {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.search-card {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.search-top-bar {
  width: 100%;
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
