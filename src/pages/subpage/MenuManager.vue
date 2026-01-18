<template>
  <el-container style="height: calc(100vh - 80px);">
    <el-main class="menu-main">

      <!-- 搜索区域 + 新增按钮 -->
      <el-card shadow="never" class="search-card">
        <div class="search-top-bar" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          
          <!-- 搜索表单 -->
          <el-form :inline="true" :model="query" size="small">
            <el-form-item label="菜单名称">
              <el-input v-model="query.menuName" clearable />
            </el-form-item>
            <el-form-item label="菜单路径">
              <el-input v-model="query.navigatorPath" clearable />
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
          <el-button type="primary" size="small" @click="openAddDialog">新增菜单</el-button>
        </div>
      </el-card>

      <!-- 表格滚动区域 -->
      <div class="table-scroll-area">
        <el-table :data="list" border stripe size="small" v-loading="loading" :height="tableHeight">
          <el-table-column type="index" width="50" label="序号" align="center"/>
          <el-table-column prop="menuName" label="菜单名称" width="180" />
          <el-table-column prop="navigatorPath" label="菜单路径" />
          <el-table-column prop="componetPath" label="组件路径" />
          <el-table-column prop="icon" label="图标" width="100" />
          <el-table-column prop="sort" label="排序" width="80" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
              <el-tag v-else type="info">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="200">
            <template #default="scope">
              {{ formatTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="200">
            <template #default="scope">
              {{ formatTime(scope.row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="text" size="mini" @click="openEditDialog(scope.row)">编辑</el-button>
              <el-button type="text" size="mini" style="color:red" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination background layout="total, sizes, prev, pager, next" :total="total" :page-size="query.limit"
          :current-page="query.page" @size-change="handleSizeChange" @current-change="handlePageChange" />
      </div>

      <!-- 新增/编辑弹窗 -->
      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
        <el-form :model="form" ref="formRef" label-width="100px">
          <el-form-item label="菜单名称" prop="menuName" :rules="[{ required: true, message: '请输入菜单名称', trigger: 'blur' }]">
            <el-input v-model="form.menuName" />
          </el-form-item>
          <el-form-item label="菜单路径" prop="navigatorPath">
            <el-input v-model="form.navigatorPath" />
          </el-form-item>
          <el-form-item label="组件路径" prop="componetPath">
            <el-input v-model="form.componetPath" />
          </el-form-item>
          <el-form-item label="图标" prop="icon">
            <el-input v-model="form.icon" placeholder="可输入icon类名或图标路径" />
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="form.sort" :min="0" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="2">停用</el-radio>
            </el-radio-group>
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
import { getMenuList, deleteMenu, updateMenu, saveMenu } from '@/api/menu';

export default {
  name: 'MenuList',
  data() {
    return {
      loading: false,
      list: [],
      total: 0,
      tableHeight: 620,
      query: {
        menuName: '',
        navigatorPath: '',
        status: null,
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      dialogTitle: '新增菜单',
      form: {
        id: null,
        menuName: '',
        navigatorPath: '',
        componetPath: '',
        icon: '',
        sort: 0,
        status: 1
      }
    };
  },
  created() {
    this.fetchList();
  },
  methods: {
    fetchList() {
      this.loading = true;
      getMenuList(this.query)
        .then(res => {
          res = res.data.data;
          this.list = res.list;
          this.total = res.count;
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
        menuName: '',
        navigatorPath: '',
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
      this.dialogTitle = '新增菜单';
      this.form = { id: null, menuName: '', navigatorPath: '', componetPath: '', icon: '', sort: 0, status: 1 };
      this.dialogVisible = true;
    },
    openEditDialog(row) {
      this.dialogTitle = '编辑菜单';
      this.form = { ...row };
      this.dialogVisible = true;
    },
    submitForm() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return;
        const api = this.form.id ? updateMenu : saveMenu;
        api(this.form).then(() => {
          this.$message.success(this.form.id ? '编辑成功' : '新增成功');
          this.dialogVisible = false;
          this.fetchList();
        });
      });
    },
    handleDelete(row) {
      this.$confirm('确定删除该菜单吗？', '提示', { type: 'warning' })
        .then(() => {
          deleteMenu([row.id]).then(() => {
            this.$message.success('删除成功');
            this.fetchList();
          });
        })
        .catch(() => { });
    },
    formatTime(timestamp) {
      if (!timestamp) return '';
      const date = new Date(timestamp * 1000);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    }
  }
};
</script>

<style scoped>
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
