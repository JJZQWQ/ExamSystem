<template>
  <div class="category-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><Folder /></el-icon>
        试题分类管理
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总分类数" :value="totalCategories" />
        <el-statistic title="一级分类" :value="topLevelCategories" />
        <el-statistic title="子分类" :value="subCategories" />
      </div>
    </div>

    <!-- 顶部操作栏 -->
    <div class="toolbar animate__animated animate__fadeInDown">
      <div class="toolbar-left">
        <el-button 
          type="primary" 
          size="large"
          @click="showCreateModal"
          class="action-btn"
        >
          <el-icon><Plus /></el-icon>
          新建分类
        </el-button>
        <el-button 
          type="success" 
          size="large"
          @click="expandAll"
          class="action-btn"
        >
          <el-icon><ArrowDown /></el-icon>
          全部展开
        </el-button>
        <el-button 
          type="warning" 
          size="large"
          @click="collapseAll"
          class="action-btn"
        >
          <el-icon><ArrowUp /></el-icon>
          全部折叠
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索分类名称..."
          :prefix-icon="Search"
          class="search-input"
          clearable
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 分类树形列表 -->
    <div class="category-tree animate__animated animate__fadeInUp">
      <el-tree
        ref="categoryTreeRef"
        :data="filteredCategories"
        :props="treeProps"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeys"
        :highlight-current="true"
        node-key="id"
        class="category-tree-component"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <div class="node-content">
              <el-icon class="node-icon">
                <Folder v-if="!data.parentId" />
                <Document v-else />
              </el-icon>
              <span class="node-label">{{ data.name }}</span>
              <el-tag 
                v-if="!data.parentId" 
                type="primary" 
                size="small"
                class="node-tag"
              >
                一级分类
              </el-tag>
              <el-tag 
                v-else 
                type="info" 
                size="small"
                class="node-tag"
              >
                子分类
              </el-tag>
            </div>
            <div class="node-actions">
              <el-tooltip content="添加子分类" placement="top">
                <el-button 
                  type="success" 
                  size="small" 
                  circle
                  @click.stop="showCreateSubModal(data)"
                >
                  <el-icon><Plus /></el-icon>
                </el-button>
              </el-tooltip>
              
              <el-tooltip content="编辑分类" placement="top">
                <el-button 
                  type="primary" 
                  size="small" 
                  circle
                  @click.stop="showEditModal(data)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </el-tooltip>
              
              <el-tooltip content="删除分类" placement="top">
                <el-button 
                  type="danger" 
                  size="small" 
                  circle
                  @click.stop="deleteCategory(data)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-tree>
    </div>

    <!-- 创建/编辑分类对话框 -->
    <el-dialog
      v-model="showCategoryModal"
      :title="modalTitle"
      width="600px"
      :before-close="closeCategoryModal"
      class="category-dialog"
    >
      <el-form
        ref="categoryFormRef"
        :model="categoryForm"
        :rules="categoryRules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="categoryForm.name"
            placeholder="请输入分类名称"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="父级分类" prop="parentId" v-if="modalType === 'create'">
          <el-select 
            v-model="categoryForm.parentId" 
            placeholder="请选择父级分类"
            clearable
            style="width: 100%"
          >
            <el-option label="无（作为一级分类）" :value="null" />
            <el-option 
              v-for="category in topLevelCategoriesList" 
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="分类描述" prop="description">
          <el-input
            v-model="categoryForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分类描述（可选）"
          />
        </el-form-item>
        
        <el-form-item label="排序权重" prop="sortOrder">
          <el-input-number 
            v-model="categoryForm.sortOrder" 
            :min="0" 
            :max="999"
            placeholder="数字越小排序越靠前"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeCategoryModal">取消</el-button>
          <el-button type="primary" @click="saveCategory">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分类统计卡片 -->
    <div class="stats-cards animate__animated animate__fadeInUp">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon primary"><Folder /></el-icon>
              <div class="stat-info">
                <div class="stat-number">{{ totalCategories }}</div>
                <div class="stat-label">总分类数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon success"><FolderOpened /></el-icon>
              <div class="stat-info">
                <div class="stat-number">{{ topLevelCategories }}</div>
                <div class="stat-label">一级分类</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon warning"><Document /></el-icon>
              <div class="stat-info">
                <div class="stat-number">{{ subCategories }}</div>
                <div class="stat-label">子分类</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <el-icon class="stat-icon info"><DataLine /></el-icon>
              <div class="stat-info">
                <div class="stat-number">{{ averageSubCategories }}</div>
                <div class="stat-label">平均子分类数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Folder,
  Plus,
  ArrowDown,
  ArrowUp,
  Search,
  Document,
  Edit,
  Delete,
  FolderOpened,
  DataLine
} from '@element-plus/icons-vue'

// 响应式数据
const searchKeyword = ref('')
const showCategoryModal = ref(false)
const modalType = ref('create')
const editingCategoryId = ref(null)
const categoryTreeRef = ref()
const categoryFormRef = ref()
const expandedKeys = ref([])

// 分类表单
const categoryForm = reactive({
  name: '',
  parentId: null,
  description: '',
  sortOrder: 0
})

// 表单验证规则
const categoryRules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ]
}

// 树形组件配置
const treeProps = {
  children: 'children',
  label: 'name'
}

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '综合考试题库',
    parentId: null,
    description: '综合性考试题目集合',
    sortOrder: 1,
    children: []
  },
  {
    id: 2,
    name: '拓展考试题库',
    parentId: null,
    description: '拓展性考试题目集合',
    sortOrder: 2,
    children: [
      { 
        id: 21, 
        name: '墨刀技能大赛考试题库1', 
        parentId: 2,
        description: '墨刀技能大赛相关题目',
        sortOrder: 1
      },
      { 
        id: 22, 
        name: '墨刀技能大赛考试题库2', 
        parentId: 2,
        description: '墨刀技能大赛相关题目',
        sortOrder: 2
      },
      { 
        id: 23, 
        name: '墨刀技能大赛考试题库3', 
        parentId: 2,
        description: '墨刀技能大赛相关题目',
        sortOrder: 3
      },
      { 
        id: 24, 
        name: '墨刀技能大赛考试题库4', 
        parentId: 2,
        description: '墨刀技能大赛相关题目',
        sortOrder: 4
      },
      { 
        id: 25, 
        name: '墨刀技能大赛考试题库5', 
        parentId: 2,
        description: '墨刀技能大赛相关题目',
        sortOrder: 5
      },
      { 
        id: 26, 
        name: '墨刀技能大赛考试题库6', 
        parentId: 2,
        description: '墨刀技能大赛相关题目',
        sortOrder: 6
      },
      { 
        id: 27, 
        name: '墨刀技能大赛考试题库7', 
        parentId: 2,
        description: '墨刀技能大赛相关题目',
        sortOrder: 7
      }
    ]
  },
  {
    id: 3,
    name: '在线测试题库',
    parentId: null,
    description: '在线测试题目集合',
    sortOrder: 3,
    children: []
  },
  {
    id: 4,
    name: '案例题库',
    parentId: null,
    description: '案例分析题目集合',
    sortOrder: 4,
    children: []
  }
])

// 计算属性
const modalTitle = computed(() => {
  if (modalType.value === 'create') {
    return categoryForm.parentId ? '添加子分类' : '新建分类'
  } else {
    return '编辑分类'
  }
})

const totalCategories = computed(() => {
  const countCategories = (items) => {
    let count = 0
    items.forEach(item => {
      count += 1
      if (item.children && item.children.length > 0) {
        count += countCategories(item.children)
      }
    })
    return count
  }
  return countCategories(categories.value)
})

const topLevelCategories = computed(() => {
  return categories.value.length
})

const subCategories = computed(() => {
  return totalCategories.value - topLevelCategories.value
})

const averageSubCategories = computed(() => {
  if (topLevelCategories.value === 0) return 0
  return (subCategories.value / topLevelCategories.value).toFixed(1)
})

const topLevelCategoriesList = computed(() => {
  return categories.value.map(cat => ({
    id: cat.id,
    name: cat.name
  }))
})

const filteredCategories = computed(() => {
  if (!searchKeyword.value) {
    return categories.value
  }
  
  const filterTree = (items) => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
      if (item.children && item.children.length > 0) {
        const filteredChildren = filterTree(item.children)
        item.children = filteredChildren
        return matchesSearch || filteredChildren.length > 0
      }
      return matchesSearch
    })
  }
  
  return filterTree(JSON.parse(JSON.stringify(categories.value)))
})

// 事件处理函数
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const expandAll = () => {
  const getAllKeys = (items) => {
    let keys = []
    items.forEach(item => {
      keys.push(item.id)
      if (item.children && item.children.length > 0) {
        keys = keys.concat(getAllKeys(item.children))
      }
    })
    return keys
  }
  expandedKeys.value = getAllKeys(categories.value)
  nextTick(() => {
    categoryTreeRef.value?.store?.setDefaultExpandedKeys(expandedKeys.value)
  })
}

const collapseAll = () => {
  expandedKeys.value = []
  nextTick(() => {
    categoryTreeRef.value?.store?.setDefaultExpandedKeys([])
  })
}

const showCreateModal = () => {
  modalType.value = 'create'
  resetCategoryForm()
  showCategoryModal.value = true
}

const showCreateSubModal = (parentCategory) => {
  modalType.value = 'create'
  Object.assign(categoryForm, {
    name: '',
    parentId: parentCategory.id,
    description: '',
    sortOrder: 0
  })
  showCategoryModal.value = true
}

const showEditModal = (category) => {
  modalType.value = 'edit'
  editingCategoryId.value = category.id
  Object.assign(categoryForm, {
    name: category.name,
    parentId: category.parentId,
    description: category.description || '',
    sortOrder: category.sortOrder || 0
  })
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  resetCategoryForm()
}

const resetCategoryForm = () => {
  Object.assign(categoryForm, {
    name: '',
    parentId: null,
    description: '',
    sortOrder: 0
  })
  if (categoryFormRef.value) {
    categoryFormRef.value.resetFields()
  }
}

const saveCategory = () => {
  categoryFormRef.value.validate((valid) => {
    if (valid) {
      if (modalType.value === 'create') {
        // 创建新分类
        const newId = Date.now()
        const newCategory = {
          id: newId,
          name: categoryForm.name,
          parentId: categoryForm.parentId,
          description: categoryForm.description,
          sortOrder: categoryForm.sortOrder,
          children: []
        }
        
        if (categoryForm.parentId) {
          // 添加子分类
          const parentCategory = findCategoryById(categories.value, categoryForm.parentId)
          if (parentCategory) {
            if (!parentCategory.children) {
              parentCategory.children = []
            }
            parentCategory.children.push(newCategory)
            parentCategory.children.sort((a, b) => a.sortOrder - b.sortOrder)
          }
        } else {
          // 添加一级分类
          categories.value.push(newCategory)
          categories.value.sort((a, b) => a.sortOrder - b.sortOrder)
        }
        
        ElMessage.success('创建成功')
      } else {
        // 编辑分类
        const category = findCategoryById(categories.value, editingCategoryId.value)
        if (category) {
          category.name = categoryForm.name
          category.description = categoryForm.description
          category.sortOrder = categoryForm.sortOrder
          
          // 如果是编辑一级分类且修改了排序
          if (!category.parentId) {
            categories.value.sort((a, b) => a.sortOrder - b.sortOrder)
          }
        }
        
        ElMessage.success('编辑成功')
      }
      
      closeCategoryModal()
    }
  })
}

const deleteCategory = (category) => {
  const hasChildren = category.children && category.children.length > 0
  
  ElMessageBox.confirm(
    hasChildren 
      ? `确定要删除分类 "${category.name}" 吗？删除后其所有子分类也将被删除。`
      : `确定要删除分类 "${category.name}" 吗？`,
    '删除分类',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    if (category.parentId) {
      // 删除子分类
      const parentCategory = findCategoryById(categories.value, category.parentId)
      if (parentCategory && parentCategory.children) {
        const index = parentCategory.children.findIndex(child => child.id === category.id)
        if (index > -1) {
          parentCategory.children.splice(index, 1)
        }
      }
    } else {
      // 删除一级分类
      const index = categories.value.findIndex(cat => cat.id === category.id)
      if (index > -1) {
        categories.value.splice(index, 1)
      }
    }
    
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const findCategoryById = (items, id) => {
  for (let item of items) {
    if (item.id === id) {
      return item
    }
    if (item.children && item.children.length > 0) {
      const found = findCategoryById(item.children, id)
      if (found) {
        return found
      }
    }
  }
  return null
}

// 组件挂载
onMounted(() => {
  // 默认展开第一个分类
  if (categories.value.length > 0) {
    expandedKeys.value = [categories.value[0].id]
  }
})
</script>

<style scoped>
.category-management {
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

/* 分类树 */
.category-tree {
  margin-bottom: 24px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.category-tree-component {
  max-height: 500px;
  overflow-y: auto;
}

:deep(.el-tree-node__content) {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

:deep(.el-tree-node__content:hover) {
  background-color: #f8f9fa;
}

:deep(.el-tree-node__expand-icon) {
  padding: 6px;
  font-size: 16px;
}

.tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 16px;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.node-icon {
  font-size: 18px;
  color: #409eff;
}

.node-label {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.node-tag {
  margin-left: 8px;
}

.node-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tree-node:hover .node-actions {
  opacity: 1;
}

.node-actions .el-button {
  transition: all 0.3s ease;
}

.node-actions .el-button:hover {
  transform: scale(1.1);
}

/* 统计卡片 */
.stats-cards {
  margin-top: 24px;
}

.stat-card {
  border-radius: 12px;
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.stat-icon.primary {
  background-color: #e6f7ff;
  color: #409eff;
}

.stat-icon.success {
  background-color: #f0f9ff;
  color: #67c23a;
}

.stat-icon.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.stat-icon.info {
  background-color: #f4f4f5;
  color: #909399;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-top: 4px;
}

/* 对话框样式 */
:deep(.category-dialog .el-dialog) {
  border-radius: 16px;
}

:deep(.category-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
}

:deep(.category-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.category-dialog .el-dialog__headerbtn .el-dialog__close) {
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
  .category-management {
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
  
  .tree-node {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .node-actions {
    opacity: 1;
  }
  
  .stats-cards :deep(.el-col) {
    margin-bottom: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .stat-icon {
    font-size: 24px;
    width: 48px;
    height: 48px;
  }
  
  .stat-number {
    font-size: 20px;
  }
}
</style>