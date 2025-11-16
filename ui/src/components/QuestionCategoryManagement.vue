<template>
  <div class="question-category-management">
    <h1>试题分类目录创建管理</h1>
    
    <!-- 顶部操作与信息栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn primary" @click="showCreateModal">新建</button>
      </div>
      <div class="toolbar-right">
        <span class="platform-name">在线考试平台</span>
        <span class="notification">🔔<span class="badge">4</span></span>
      </div>
    </div>
    
    <!-- 主内容区（试题分类目录管理） -->
    <div class="category-content">
      <div class="category-list">
        <div 
          v-for="category in categories" 
          :key="category.id"
          class="category-item"
        >
          <div class="category-header">
            <div class="category-info" @click="toggleCategory(category.id)">
              <span class="toggle-icon">
                {{ category.expanded ? '▼' : '▶' }}
              </span>
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">({{ category.children.length }})</span>
            </div>
            <div class="category-actions">
              <button class="btn small" @click="showCreateSubModal(category.id)">添加</button>
              <button class="btn small secondary" @click="showEditModal(category)">编辑</button>
              <button class="btn small danger" @click="deleteCategory(category.id)">删除</button>
            </div>
          </div>
          
          <!-- 子分类列表 -->
          <div v-if="category.expanded" class="sub-category-list">
            <div 
              v-for="subCategory in category.children" 
              :key="subCategory.id"
              class="sub-category-item"
            >
              <div class="sub-category-info">
                <span class="sub-category-name">{{ subCategory.name }}</span>
              </div>
              <div class="sub-category-actions">
                <button class="btn small secondary" @click="showEditModal(subCategory, category.id)">编辑</button>
                <button class="btn small danger" @click="deleteSubCategory(category.id, subCategory.id)">删除</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 新建分类模态框 -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>分类名称</label>
            <input 
              type="text" 
              v-model="form.name" 
              class="form-input"
              placeholder="请输入分类名称"
            >
          </div>
          
          <!-- 选择父级分类（仅在添加子分类时显示） -->
          <div v-if="parentCategoryId" class="form-group">
            <label>父级分类</label>
            <select v-model="form.parentId" class="form-select" disabled>
              <option :value="parentCategoryId">
                {{ getParentCategoryName(parentCategoryId) }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeModal">取消</button>
          <button class="btn primary" @click="saveCategory">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 分类数据
const categories = ref([
  {
    id: 1,
    name: '综合考试题库',
    expanded: false,
    children: []
  },
  {
    id: 2,
    name: '拓展考试题库',
    expanded: true,
    children: [
      { id: 21, name: '墨刀技能大赛考试题库1' },
      { id: 22, name: '墨刀技能大赛考试题库2' },
      { id: 23, name: '墨刀技能大赛考试题库3' },
      { id: 24, name: '墨刀技能大赛考试题库4' },
      { id: 25, name: '墨刀技能大赛考试题库5' },
      { id: 26, name: '墨刀技能大赛考试题库6' },
      { id: 27, name: '墨刀技能大赛考试题库7' }
    ]
  },
  {
    id: 3,
    name: '在线测试题库',
    expanded: false,
    children: []
  },
  {
    id: 4,
    name: '案例题库',
    expanded: false,
    children: []
  }
])

// 模态框相关
const showModal = ref(false)
const modalType = ref('create') // 'create' 或 'edit'
const editingCategoryId = ref(null)
const parentCategoryId = ref(null)

// 表单数据
const form = ref({
  name: '',
  parentId: null
})

// 模态框标题
const modalTitle = computed(() => {
  if (modalType.value === 'create') {
    return parentCategoryId.value ? '添加子分类' : '新建分类'
  } else {
    return '编辑分类'
  }
})

// 切换分类展开/折叠状态
const toggleCategory = (id) => {
  const category = categories.value.find(cat => cat.id === id)
  if (category) {
    category.expanded = !category.expanded
  }
}

// 显示新建分类模态框
const showCreateModal = () => {
  modalType.value = 'create'
  parentCategoryId.value = null
  form.value = { name: '', parentId: null }
  showModal.value = true
}

// 显示添加子分类模态框
const showCreateSubModal = (parentId) => {
  modalType.value = 'create'
  parentCategoryId.value = parentId
  form.value = { name: '', parentId: parentId }
  showModal.value = true
}

// 显示编辑模态框
const showEditModal = (category, parentId = null) => {
  modalType.value = 'edit'
  editingCategoryId.value = category.id
  parentCategoryId.value = parentId
  form.value = { name: category.name, parentId: parentId }
  showModal.value = true
}

// 关闭模态框
const closeModal = () => {
  showModal.value = false
}

// 保存分类
const saveCategory = () => {
  if (!form.value.name.trim()) {
    alert('请输入分类名称')
    return
  }

  if (modalType.value === 'create') {
    // 创建新分类
    const newId = Date.now() // 简单生成唯一ID
    if (parentCategoryId.value) {
      // 添加子分类
      const parentCategory = categories.value.find(cat => cat.id === parentCategoryId.value)
      if (parentCategory) {
        parentCategory.children.push({
          id: newId,
          name: form.value.name
        })
      }
    } else {
      // 添加一级分类
      categories.value.push({
        id: newId,
        name: form.value.name,
        expanded: false,
        children: []
      })
    }
  } else {
    // 编辑分类
    if (parentCategoryId.value) {
      // 编辑子分类
      const parentCategory = categories.value.find(cat => cat.id === parentCategoryId.value)
      if (parentCategory) {
        const subCategory = parentCategory.children.find(sub => sub.id === editingCategoryId.value)
        if (subCategory) {
          subCategory.name = form.value.name
        }
      }
    } else {
      // 编辑一级分类
      const category = categories.value.find(cat => cat.id === editingCategoryId.value)
      if (category) {
        category.name = form.value.name
      }
    }
  }

  closeModal()
}

// 删除一级分类
const deleteCategory = (id) => {
  if (confirm('确定要删除这个分类吗？')) {
    const index = categories.value.findIndex(cat => cat.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }
}

// 删除子分类
const deleteSubCategory = (parentId, subId) => {
  if (confirm('确定要删除这个子分类吗？')) {
    const parentCategory = categories.value.find(cat => cat.id === parentId)
    if (parentCategory) {
      const index = parentCategory.children.findIndex(sub => sub.id === subId)
      if (index !== -1) {
        parentCategory.children.splice(index, 1)
      }
    }
  }
}

// 获取父级分类名称
const getParentCategoryName = (parentId) => {
  const category = categories.value.find(cat => cat.id === parentId)
  return category ? category.name : ''
}
</script>

<style scoped>
.question-category-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100% - 20px);
}

.question-category-management h1 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 顶部操作与信息栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.toolbar-left {
  display: flex;
  gap: 10px;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.platform-name {
  font-weight: bold;
  color: #333;
}

.notification {
  position: relative;
  font-size: 18px;
  cursor: pointer;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: red;
  color: white;
  border-radius: 50%;
  font-size: 10px;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 按钮样式 */
.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn.small {
  padding: 5px 10px;
  font-size: 12px;
}

.btn.primary {
  background-color: #0066cc;
  color: white;
}

.btn.secondary {
  background-color: #6c757d;
  color: white;
}

.btn.danger {
  background-color: #dc3545;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn.secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn.danger:hover:not(:disabled) {
  background-color: #c82333;
}

/* 分类列表 */
.category-list {
  margin-top: 20px;
}

.category-item {
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin-bottom: 10px;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f8f9fa;
}

.category-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  flex: 1;
}

.toggle-icon {
  margin-right: 10px;
  width: 20px;
  text-align: center;
}

.category-name {
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.category-count {
  color: #666;
  font-size: 14px;
}

.category-actions {
  display: flex;
  gap: 10px;
}

/* 子分类列表 */
.sub-category-list {
  padding: 10px 15px 10px 45px;
  border-top: 1px solid #dee2e6;
  background-color: #fff;
}

.sub-category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.sub-category-item:last-child {
  border-bottom: none;
}

.sub-category-name {
  color: #333;
}

.sub-category-actions {
  display: flex;
  gap: 10px;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-input,
.form-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #0066cc;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>