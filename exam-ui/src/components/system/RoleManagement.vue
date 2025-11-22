<template>
  <div class="role-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><UserFilled /></el-icon>
        角色管理
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总角色数" :value="totalRoles" />
        <el-statistic title="系统角色" :value="systemRolesCount" />
        <el-statistic title="自定义角色" :value="customRolesCount" />
      </div>
    </div>

    <!-- 顶部操作栏 -->
    <div class="toolbar animate__animated animate__fadeInDown">
      <div class="toolbar-left">
        <el-button 
          type="primary" 
          size="large"
          @click="showAddRoleModal"
          class="action-btn"
        >
          <el-icon><Plus /></el-icon>
          新增角色
        </el-button>
        <el-button 
          type="danger" 
          size="large"
          :disabled="selectedRoles.length === 0"
          @click="deleteSelectedRoles"
          class="action-btn"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
        <el-button 
          type="success" 
          size="large"
          @click="exportRoles"
          class="action-btn"
        >
          <el-icon><Download /></el-icon>
          导出角色
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索角色名称或编码..."
          :prefix-icon="Search"
          class="search-input"
          clearable
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 高级搜索区域 -->
    <el-card class="search-card animate__animated animate__fadeInUp">
      <div class="search-header">
        <h3>高级搜索</h3>
        <el-button 
          type="text" 
          @click="toggleSearchPanel"
          class="toggle-btn"
        >
          {{ showSearchPanel ? '收起' : '展开' }}
          <el-icon>
            <component :is="showSearchPanel ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </el-button>
      </div>
      
      <div v-show="showSearchPanel" class="search-content">
        <el-form :model="searchParams" inline>
          <el-form-item label="角色名称">
            <el-input
              v-model="searchParams.name"
              placeholder="请输入角色名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="角色编码">
            <el-input
              v-model="searchParams.code"
              placeholder="请输入角色编码"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="角色类型">
            <el-select 
              v-model="searchParams.type" 
              placeholder="全部类型"
              clearable
              style="width: 150px"
            >
              <el-option label="系统角色" value="system" />
              <el-option label="自定义角色" value="custom" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchRoles">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 角色列表 -->
    <el-card class="role-table-card animate__animated animate__fadeInUp">
      <div class="table-header">
        <h3>角色列表</h3>
        <div class="table-actions">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="table">表格视图</el-radio-button>
            <el-radio-button label="card">卡片视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="table-view">
        <el-table
          :data="filteredRoles"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
          row-key="code"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="角色名称" min-width="150">
            <template #default="{ row }">
              <div class="role-name-cell">
                <el-icon class="role-icon">
                  <component :is="row.isSystem ? 'Lock' : 'User'" />
                </el-icon>
                <span>{{ row.name }}</span>
                <el-tag v-if="row.isSystem" type="danger" size="small">系统</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="角色编码" width="150" />
          <el-table-column prop="description" label="描述" min-width="200" />
          <el-table-column prop="userCount" label="用户数量" width="100">
            <template #default="{ row }">
              <el-badge :value="row.userCount" type="primary" />
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="250" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small"
                @click="adjustPermissions(row)"
              >
                <el-icon><Lock /></el-icon>
                权限管理
              </el-button>
              <el-button 
                type="warning" 
                size="small"
                :disabled="row.isSystem"
                @click="editRole(row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-dropdown>
                <el-button type="info" size="small">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="viewRoleUsers(row)">
                      <el-icon><User /></el-icon>查看用户
                    </el-dropdown-item>
                    <el-dropdown-item @click="copyRole(row)">
                      <el-icon><CopyDocument /></el-icon>复制角色
                    </el-dropdown-item>
                    <el-dropdown-item 
                      @click="deleteRole(row)"
                      :disabled="row.isSystem"
                      divided
                    >
                      <el-icon><Delete /></el-icon>删除角色
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="card-view">
        <el-row :gutter="20">
          <el-col 
            v-for="role in filteredRoles" 
            :key="role.code"
            :span="8"
            style="margin-bottom: 20px"
          >
            <el-card class="role-card" shadow="hover">
              <div class="card-header">
                <div class="role-info">
                  <el-icon class="role-icon-large">
                    <component :is="role.isSystem ? 'Lock' : 'User'" />
                  </el-icon>
                  <div class="role-details">
                    <h4>{{ role.name }}</h4>
                    <p>{{ role.code }}</p>
                  </div>
                </div>
                <el-tag v-if="role.isSystem" type="danger">系统</el-tag>
              </div>
              
              <div class="card-content">
                <div class="info-item">
                  <el-icon><Document /></el-icon>
                  <span>{{ role.description || '暂无描述' }}</span>
                </div>
                <div class="info-item">
                  <el-icon><User /></el-icon>
                  <span>{{ role.userCount }} 个用户</span>
                </div>
                <div class="info-item">
                  <el-icon><Clock /></el-icon>
                  <span>{{ role.createTime }}</span>
                </div>
              </div>
              
              <div class="card-footer">
                <el-button type="primary" size="small" @click="adjustPermissions(role)">
                  权限管理
                </el-button>
                <el-button 
                  type="warning" 
                  size="small"
                  :disabled="role.isSystem"
                  @click="editRole(role)"
                >
                  编辑
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="showRoleModal"
      :title="editingRole ? '编辑角色' : '新增角色'"
      width="600px"
      :before-close="closeRoleModal"
      class="role-dialog"
    >
      <el-form 
        :model="currentRole" 
        :rules="roleRules"
        ref="roleFormRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input
            v-model="currentRole.name"
            placeholder="请输入角色名称"
            :disabled="currentRole.isSystem"
          />
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input
            v-model="currentRole.code"
            placeholder="请输入角色编码"
            :disabled="editingRole || currentRole.isSystem"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="currentRole.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
            :disabled="currentRole.isSystem"
          />
        </el-form-item>
        <el-form-item label="角色类型">
          <el-radio-group v-model="currentRole.type" :disabled="currentRole.isSystem">
            <el-radio label="custom">自定义角色</el-radio>
            <el-radio label="system">系统角色</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeRoleModal">取消</el-button>
          <el-button 
            type="primary" 
            @click="saveRole"
            :disabled="currentRole.isSystem"
          >
            {{ editingRole ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 权限管理对话框 -->
    <el-dialog
      v-model="showPermissionModal"
      :title="`${currentRole.name} - 权限管理`"
      width="800px"
      :before-close="closePermissionModal"
      class="permission-dialog"
    >
      <div class="permission-content">
        <div class="permission-tabs">
          <el-tabs v-model="activePermissionTab">
            <el-tab-pane label="菜单权限" name="menu">
              <div class="permission-tree">
                <el-tree
                  :data="menuPermissions"
                  :props="treeProps"
                  show-checkbox
                  node-key="id"
                  :default-checked-keys="checkedMenuKeys"
                  @check="handleMenuCheck"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="操作权限" name="action">
              <div class="permission-grid">
                <div 
                  v-for="permission in actionPermissions" 
                  :key="permission.id"
                  class="permission-item"
                >
                  <el-checkbox 
                    v-model="permission.enabled"
                    @change="handleActionChange"
                  >
                    <div class="permission-info">
                      <div class="permission-name">{{ permission.name }}</div>
                      <div class="permission-desc">{{ permission.description }}</div>
                    </div>
                  </el-checkbox>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePermissionModal">取消</el-button>
          <el-button type="primary" @click="savePermissions">保存权限</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  UserFilled,
  Plus,
  Delete,
  Download,
  Search,
  ArrowUp,
  ArrowDown,
  Lock,
  User,
  Edit,
  CopyDocument,
  Document,
  Clock
} from '@element-plus/icons-vue'

// 响应式数据
const viewMode = ref('table')
const searchKeyword = ref('')
const showSearchPanel = ref(false)
const showRoleModal = ref(false)
const showPermissionModal = ref(false)
const editingRole = ref(false)
const activePermissionTab = ref('menu')
const selectedRoles = ref([])
const roleFormRef = ref()

// 搜索参数
const searchParams = reactive({
  name: '',
  code: '',
  type: ''
})

// 当前编辑的角色
const currentRole = reactive({
  name: '',
  code: '',
  description: '',
  isSystem: false,
  type: 'custom'
})

// 角色表单验证规则
const roleRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入角色编码', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '编码只能包含字母、数字和下划线，且以字母或下划线开头', trigger: 'blur' }
  ]
}

// 角色列表数据
const roles = ref([
  {
    name: '系统管理员',
    code: 'admin',
    description: '系统超级管理员，拥有所有权限',
    isSystem: true,
    type: 'system',
    userCount: 1,
    createTime: '2023-01-01 10:00:00'
  },
  {
    name: '教师',
    code: 'teacher',
    description: '教师角色，可以创建考试、批改试卷',
    isSystem: true,
    type: 'system',
    userCount: 15,
    createTime: '2023-01-01 10:00:00'
  },
  {
    name: '学生',
    code: 'student',
    description: '学生角色，可以参加考试、查看成绩',
    isSystem: true,
    type: 'system',
    userCount: 120,
    createTime: '2023-01-01 10:00:00'
  },
  {
    name: '助教',
    code: 'assistant',
    description: '助教角色，协助教师进行考试管理',
    isSystem: false,
    type: 'custom',
    userCount: 8,
    createTime: '2023-02-15 14:30:00'
  }
])

// 菜单权限数据
const menuPermissions = ref([
  {
    id: '1',
    label: '考试管理',
    children: [
      { id: '1-1', label: '考试信息管理' },
      { id: '1-2', label: '成绩管理' },
      { id: '1-3', label: '考试分析' }
    ]
  },
  {
    id: '2',
    label: '试题管理',
    children: [
      { id: '2-1', label: '试题库' },
      { id: '2-2', label: '试题分类' }
    ]
  },
  {
    id: '3',
    label: '系统管理',
    children: [
      { id: '3-1', label: '用户管理' },
      { id: '3-2', label: '角色管理' },
      { id: '3-3', label: '系统设置' }
    ]
  }
])

// 操作权限数据
const actionPermissions = ref([
  { id: '1', name: '创建试卷', description: '创建新的考试试卷', enabled: true },
  { id: '2', name: '编辑试卷', description: '编辑已有试卷内容', enabled: true },
  { id: '3', name: '删除试卷', description: '删除考试试卷', enabled: false },
  { id: '4', name: '批改试卷', description: '批改学生提交的试卷', enabled: true },
  { id: '5', name: '查看成绩', description: '查看学生考试成绩', enabled: true },
  { id: '6', name: '导出成绩', description: '导出考试成绩报表', enabled: false },
  { id: '7', name: '管理用户', description: '管理系统用户', enabled: false },
  { id: '8', name: '系统设置', description: '修改系统配置', enabled: false }
])

// 树形组件配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 已选中的菜单权限
const checkedMenuKeys = ref(['1-1', '1-2', '2-1'])

// 计算属性
const totalRoles = computed(() => roles.value.length)

const systemRolesCount = computed(() => {
  return roles.value.filter(role => role.isSystem).length
})

const customRolesCount = computed(() => {
  return roles.value.filter(role => !role.isSystem).length
})

const filteredRoles = computed(() => {
  let filtered = roles.value
  
  if (searchKeyword.value) {
    filtered = filtered.filter(role => 
      role.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      role.code.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  if (searchParams.name) {
    filtered = filtered.filter(role => 
      role.name.toLowerCase().includes(searchParams.name.toLowerCase())
    )
  }
  
  if (searchParams.code) {
    filtered = filtered.filter(role => 
      role.code.toLowerCase().includes(searchParams.code.toLowerCase())
    )
  }
  
  if (searchParams.type) {
    filtered = filtered.filter(role => {
      if (searchParams.type === 'system') return role.isSystem
      return !role.isSystem
    })
  }
  
  return filtered
})

// 事件处理函数
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const toggleSearchPanel = () => {
  showSearchPanel.value = !showSearchPanel.value
}

const searchRoles = () => {
  ElMessage.success('搜索完成')
}

const resetSearch = () => {
  searchParams.name = ''
  searchParams.code = ''
  searchParams.type = ''
  searchKeyword.value = ''
}

const handleSelectionChange = (selection) => {
  selectedRoles.value = selection
}

const showAddRoleModal = () => {
  editingRole.value = false
  Object.assign(currentRole, {
    name: '',
    code: '',
    description: '',
    isSystem: false,
    type: 'custom'
  })
  showRoleModal.value = true
}

const editRole = (role) => {
  editingRole.value = true
  Object.assign(currentRole, role)
  showRoleModal.value = true
}

const closeRoleModal = () => {
  showRoleModal.value = false
  roleFormRef.value?.resetFields()
}

const saveRole = async () => {
  if (!roleFormRef.value) return
  
  try {
    await roleFormRef.value.validate()
    
    if (editingRole.value) {
      const index = roles.value.findIndex(r => r.code === currentRole.code)
      if (index !== -1) {
        roles.value[index] = { ...currentRole }
      }
      ElMessage.success('角色更新成功')
    } else {
      const newRole = {
        ...currentRole,
        userCount: 0,
        createTime: new Date().toLocaleString()
      }
      roles.value.push(newRole)
      ElMessage.success('角色添加成功')
    }
    
    closeRoleModal()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const deleteRole = (role) => {
  if (role.isSystem) {
    ElMessage.warning('系统角色不可删除')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除角色 ${role.name} 吗？`,
    '删除角色',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = roles.value.findIndex(r => r.code === role.code)
    if (index !== -1) {
      roles.value.splice(index, 1)
      ElMessage.success('角色删除成功')
    }
  })
}

const deleteSelectedRoles = () => {
  if (selectedRoles.value.length === 0) {
    ElMessage.warning('请选择要删除的角色')
    return
  }
  
  const systemRoles = selectedRoles.value.filter(role => role.isSystem)
  if (systemRoles.length > 0) {
    ElMessage.warning('系统角色不可删除，请重新选择')
    return
  }
  
  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRoles.value.length} 个角色吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    selectedRoles.value.forEach(role => {
      const index = roles.value.findIndex(r => r.code === role.code)
      if (index !== -1) {
        roles.value.splice(index, 1)
      }
    })
    selectedRoles.value = []
    ElMessage.success('批量删除成功')
  })
}

const adjustPermissions = (role) => {
  Object.assign(currentRole, role)
  showPermissionModal.value = true
}

const closePermissionModal = () => {
  showPermissionModal.value = false
}

const handleMenuCheck = (data, checked) => {
  console.log('菜单权限变更:', data, checked)
}

const handleActionChange = () => {
  console.log('操作权限变更')
}

const savePermissions = () => {
  ElMessage.success('权限保存成功')
  closePermissionModal()
}

const viewRoleUsers = (role) => {
  ElMessage.info(`查看角色 ${role.name} 的用户列表`)
}

const copyRole = (role) => {
  const newRole = {
    ...role,
    name: role.name + '_副本',
    code: role.code + '_copy',
    isSystem: false,
    type: 'custom',
    userCount: 0,
    createTime: new Date().toLocaleString()
  }
  roles.value.push(newRole)
  ElMessage.success('角色复制成功')
}

const exportRoles = () => {
  ElMessage.success('角色导出成功')
}

// 组件挂载
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.role-management {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.page-stats {
  display: flex;
  gap: 32px;
}

.page-stats :deep(.el-statistic__head) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.page-stats :deep(.el-statistic__content) {
  color: white;
  font-size: 24px;
  font-weight: 700;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 300px;
}

/* 搜索卡片 */
.search-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.toggle-btn {
  color: #409eff;
}

.search-content {
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 角色表格卡片 */
.role-table-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.role-name-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.role-icon {
  color: #409eff;
}

/* 卡片视图 */
.card-view {
  margin-top: 20px;
}

.role-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.role-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-icon-large {
  font-size: 24px;
  color: #409eff;
}

.role-details h4 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.role-details p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.card-content {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.card-footer {
  display: flex;
  gap: 8px;
}

/* 权限对话框 */
.permission-content {
  max-height: 60vh;
  overflow-y: auto;
}

.permission-tree {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.permission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

.permission-item {
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.permission-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.permission-info {
  margin-left: 8px;
}

.permission-name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.permission-desc {
  font-size: 12px;
  color: #909399;
}

/* 对话框样式 */
:deep(.role-dialog .el-dialog),
:deep(.permission-dialog .el-dialog) {
  border-radius: 16px;
}

:deep(.role-dialog .el-dialog__header),
:deep(.permission-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
}

:deep(.role-dialog .el-dialog__title),
:deep(.permission-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.role-dialog .el-dialog__headerbtn .el-dialog__close),
:deep(.permission-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-stats {
    gap: 20px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .role-management {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-stats {
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  
  .toolbar-left {
    flex-direction: column;
    gap: 8px;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .permission-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
  
  .role-card {
    margin-bottom: 16px;
  }
}
</style>