<template>
  <el-container style="height: calc(100vh - 130px);">
    <el-main class="role-main">

      <!-- 顶部操作区（全局） -->
      <div class="top-bar">
        <span class="page-title">角色管理</span>
        <div>
          <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAddRole">
            新增角色
          </el-button>
          <el-button type="danger" size="small" icon="el-icon-minus" @click="handleDeleteRole">
            删除角色
          </el-button>
        </div>
      </div>

      <!-- 主体区域 -->
      <div class="content-area">

        <!-- 左侧：角色层级 -->
        <!-- 左侧：角色层级 -->
        <div class="left-panel">
          <div class="panel-header panel-header-flex">
            <span>角色列表 </span>
            <el-tooltip content="刷新角色列表" placement="top">
              <el-button type="text" icon="el-icon-refresh" @click="handleRefreshRole" />
            </el-tooltip>
          </div>

          <div class="panel-body">
            <el-tree ref="roleTree" :data="roleTree" node-key="id" default-expand-all highlight-current
              :props="roleProps" @node-click="handleRoleSelect" />
          </div>
        </div>


        <!-- 右侧：权限列表 -->
        <div class="right-panel">

          <!-- 右侧顶部工具栏 -->
          <div class="panel-header panel-toolbar">
            <el-button size="small" icon="el-icon-plus" @click="handleAddPermission">
              关联菜单
            </el-button>
          </div>

          <!-- 权限列表滚动区 -->
          <div class="panel-body" v-loading="permissionLoading">

            <el-empty v-if="!currentRole" description="请选择左侧角色" />

            <el-table v-else :data="filteredPermissionList" size="small" border style="width: 100%">
              <el-table-column type="index" label="#" width="50" />
              <el-table-column prop="menuName" label="菜单名称" />

              <!-- 操作列 -->
              <el-table-column label="操作" width="80" align="center">
                <template slot-scope="scope">
                  <el-popconfirm title="确定要删除该菜单权限吗？" confirm-button-text="确定" cancel-button-text="取消"
                    @confirm="handleDeletePermission(scope.row)">
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

      <!-- 新增角色弹窗 -->
      <el-dialog title="新增角色" :visible.sync="addRoleDialogVisible" width="400px" destroy-on-close>

        <el-form ref="addRoleForm" :model="addRoleForm" :rules="addRoleRules" label-width="80px">
          <el-form-item label="上级角色">
            <el-input v-model="addRoleForm.parentRoleName" disabled placeholder="无（顶级角色）" />
          </el-form-item>

          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName" placeholder="请输入角色名称" maxlength="20" show-word-limit />
          </el-form-item>
        </el-form>

        <span slot="footer">
          <el-button @click="addRoleDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddRole">确定</el-button>
        </span>

      </el-dialog>

      <el-dialog title="选择关联菜单" :visible.sync="menuDialogVisible" width="700px" :before-close="cleanAddMenu">
        <!-- 🔍 搜索区 -->
        <div class="menu-search-bar">
          <el-input v-model="menuKeyword" size="small" placeholder="请输入菜单名称" clearable style="width: 200px" />
          <el-button size="small" type="primary" icon="el-icon-search" @click="handleMenuSearch">
            搜索
          </el-button>
        </div>

        <!-- 📋 菜单表格 -->
        <el-table ref="menuTable" :data="menuList" size="small" border height="320"
          @selection-change="handleMenuSelectionChange">
          <!-- 勾选列 -->
          <el-table-column type="selection" width="50" align="center" />
          <!-- 菜单名称 -->
          <el-table-column prop="menuName" label="菜单名称" min-width="180" show-overflow-tooltip />
        </el-table>

        <!-- 📄 分页 -->
        <div class="menu-pagination">
          <el-pagination background layout="total, prev, pager, next" :total="menuTotal" :page-size="menuPageSize"
            :current-page.sync="menuCurrentPage" @current-change="handleMenuPageChange" />

        </div>

        <!-- 底部按钮 -->
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="cleanAddMenu">取消</el-button>
          <el-button size="small" type="primary" @click="submitAddMenu">
            确定
          </el-button>
        </span>
      </el-dialog>

    </el-main>
  </el-container>
</template>

<script>
import { getRoleList, getRoleInfo, addRole, deleteRole, deleteRoleMenu } from '@/api/role'
import { getMenuList, addMenu } from '@/api/menu'
export default {
  name: 'RoleManage',
  data() {
    return {
      currentRole: null,

      // 左侧角色树
      roleTree: [],

      // 右侧权限列表（示例数据）
      permissionList: [],

      permissionKeyword: '',
      permissionLoading: false,

      roleProps: {
        label: 'roleName',
        children: 'children'
      },
      /** 新增角色 **/
      addRoleDialogVisible: false,
      addRoleForm: {
        parentId: null,
        parentRoleName: '',
        roleName: ''
      },
      addRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },

      /** 新增菜单 **/
      menuDialogVisible: false,
      // 角色真实已有的菜单（只在选角色时赋值）
      roleMenuIds: [],

      isRestoringSelection: false,
      isLoadingMenu: false,

      // 菜单数据
      menuList: [],          // 原始菜单列表
      menuKeyword: '',       // 搜索关键字
      // 勾选
      checkedMenuIds: [],
      // 分页
      menuCurrentPage: 1,
      menuPageSize: 10,
      menuTotal: 0

    }
  },
  computed: {
    filteredPermissionList() {
      if (!this.permissionKeyword) return this.permissionList
      return this.permissionList.filter(item =>
        item.name.includes(this.permissionKeyword)
      )
    },
    // ① 搜索过滤
    filteredMenuList() {
      if (!this.menuKeyword) return this.menuList
      return this.menuList.filter(menu =>
        menu.menuName.includes(this.menuKeyword)
      )
    },
  },
  mounted() {
    this.loadRoleList()
  },
  methods: {
    async loadRoleList() {
      return getRoleList().then(res => {
        const data = res.data.data
        this.roleTree = data || []
      })
    },

    handleRefreshRole() {
      this.currentRole = null
      this.loadRoleList()
      this.$message.success('角色列表已刷新')
    },

    handleRoleSelect(role) {
      this.currentRole = role
      this.permissionLoading = true
      this.permissionList = []

      getRoleInfo({ id: role.id })
        .then(res => {
          const data = res.data.data
          const menus = data.sysMenuListTos || []

          this.permissionList = menus

          // ✅ 只存“角色真实已有菜单”
          this.roleMenuIds = menus.map(m => m.id)
        })
        .finally(() => {
          this.permissionLoading = false
        })
    },
    handleAddRole() {
      if (this.currentRole) {
        this.addRoleForm.parentId = this.currentRole.id
        this.addRoleForm.parentRoleName = this.currentRole.roleName
      } else {
        this.addRoleForm.parentId = null
        this.addRoleForm.parentRoleName = ''
      }

      this.addRoleForm.roleName = ''
      this.addRoleDialogVisible = true
    },
    handleDeleteRole() {
      if (this.currentRole == null) {
        this.$message.warning('请先选择一个角色')
      } else {
        this.$confirm('此操作将该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRole([this.currentRole.id]).then(res => {
            res = res.data
            if (res.code == 200) {
              this.$message({ type: 'success', message: '删除成功!' });
              this.handleRefreshRole()
            }
          })
        }).catch(() => { })
      }
    },

    handleAddPermission() {
      if (!this.currentRole) {
        this.$message.warning('请先选择一个角色')
        return
      }

      // ✅ 每次打开弹窗，都从角色已有菜单复制
      this.checkedMenuIds = [...this.roleMenuIds]

      this.menuCurrentPage = 1
      this.menuDialogVisible = true
      this.loadMenuList()
    },
    submitAddRole() {
      addRole(this.addRoleForm).then(res => {
        if (res.code === 200) {
          this.$message.success('新增角色成功')
        }
        this.addRoleDialogVisible = false
        this.handleRefreshRole()
      })
    },
    // 搜索
    handleMenuSearch() {
      this.menuCurrentPage = 1
      this.loadMenuList()
    },

    handleMenuPageChange(page) {
      this.menuCurrentPage = page
      this.loadMenuList()
    },
    // 打开弹窗时加载菜单
    loadMenuList() {
      this.isLoadingMenu = true

      getMenuList({
        key: this.menuKeyword,
        page: this.menuCurrentPage,
        limit: this.menuPageSize
      }).then(res => {
        const data = res.data.data || {}

        this.menuList = data.list || []
        this.menuTotal = data.count || 0

        this.$nextTick(() => {
          this.restoreMenuSelection()
          this.isLoadingMenu = false
        })
      })
    }
    ,
    submitAddMenu() {
      console.log('选中的菜单ID:', this.checkedMenuIds)
      this.$message.success('菜单关联成功')
      this.menuDialogVisible = false
      const roleId = this.currentRole.id
      const roleMenuList = this.checkedMenuIds.map(menuId => ({
        roleId,
        menuId
      }))
      addMenu(roleMenuList).then(res=>{
        res=res.data
        if(res.code==200){
          this.cleanAddMenu()
          this.handleRoleSelect(this.currentRole)
        }
      })
    },
    cleanAddMenu() {
      this.menuDialogVisible = false

      // ❌ 不要清 roleMenuIds
      // ❌ 不要保留 checkedMenuIds 的脏状态

      this.checkedMenuIds = []
      this.menuList = []
      this.menuKeyword = ''
      this.menuCurrentPage = 1
    }
    ,
    restoreMenuSelection() {
      if (!this.$refs.menuTable) return

      this.isRestoringSelection = true
      this.$refs.menuTable.clearSelection()

      this.menuList.forEach(row => {
        if (this.checkedMenuIds.includes(row.id)) {
          this.$refs.menuTable.toggleRowSelection(row, true)
        }
      })

      this.$nextTick(() => {
        this.isRestoringSelection = false
      })
    }
    ,
    handleMenuSelectionChange(selection) {
      // 🔥 核心防御
      if (this.isRestoringSelection || this.isLoadingMenu) return

      const currentPageIds = selection.map(item => item.id)
      const currentPageMenuIds = this.menuList.map(item => item.id)

      this.checkedMenuIds = this.checkedMenuIds.filter(
        id => !currentPageMenuIds.includes(id)
      )

      this.checkedMenuIds.push(...currentPageIds)
      this.checkedMenuIds = Array.from(new Set(this.checkedMenuIds))
    },
    handleDeletePermission(menu) {
      deleteRoleMenu({
        menuId: menu.id,
        roleId: this.currentRole.id
      }).then(res => {
        res = res.data
        if (res.code == 200) {
          this.handleRoleSelect(this.currentRole)
          this.$message.success('删除成功')
        }
      })
    }
  }
}
</script>

<style scoped>
.role-main {
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

/* 主体 */
.content-area {
  flex: 1;
  display: flex;
  overflow: hidden;
  gap: 12px;
}

/* 左右面板 */
.left-panel,
.right-panel {
  width: 50%;
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

/* 右侧工具栏 */
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

.menu-search-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.menu-checkbox-group {
  max-height: 320px;
  overflow-y: auto;
  padding: 6px 12px;
}

.menu-checkbox-item {
  padding: 6px 0;
  border-bottom: 1px dashed #ebeef5;
}

.menu-pagination {
  margin-top: 12px;
  text-align: right;
}
</style>
