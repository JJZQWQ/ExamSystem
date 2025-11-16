<template>
  <div class="paper-bank">
    <h1>试卷库</h1>
    
    <!-- 顶部操作与搜索栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn primary" @click="createPaper">
          <span>+</span> 创建试卷
        </button>
        <button class="btn secondary" @click="deleteSelected" :disabled="selectedPapers.length === 0">
          删除
        </button>
      </div>
      <div class="toolbar-right">
        <div class="search-filters">
          <div class="filter-group">
            <input 
              type="text" 
              v-model="searchParams.keyword" 
              placeholder="输入关键字检索" 
              class="form-input"
            >
          </div>
          <div class="filter-actions">
            <button class="btn primary" @click="searchPapers">搜索</button>
            <button class="btn secondary" @click="resetSearch">重置</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主内容区（试卷列表） -->
    <div class="paper-content">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th width="5%">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll"
                >
              </th>
              <th>试卷名称</th>
              <th>组卷方式</th>
              <th>总分</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th width="25%">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paper in papers" :key="paper.id">
              <td>
                <input 
                  type="checkbox" 
                  :checked="selectedPapers.includes(paper.id)"
                  @change="toggleSelectPaper(paper.id)"
                >
              </td>
              <td>{{ paper.name }}</td>
              <td>{{ paper.method }}</td>
              <td>{{ paper.totalScore }}</td>
              <td>{{ paper.creator }}</td>
              <td>{{ paper.createTime }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn small secondary" @click="previewPaper(paper)">预览</button>
                  <button class="btn small secondary" @click="editPaper(paper)">编辑</button>
                  <button class="btn small primary" @click="createExam(paper)">创建考试</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 底部分页区 -->
    <div class="pagination">
      <div class="pagination-info">
        共 {{ totalPapers }} 条
      </div>
      <div class="pagination-controls">
        <div class="page-size-selector">
          <span>每页</span>
          <select v-model="pagination.pageSize" class="form-select" @change="changePageSize">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span>条</span>
        </div>
        <div class="page-navigation">
          <button 
            class="btn small" 
            :disabled="pagination.currentPage === 1"
            @click="goToPage(pagination.currentPage - 1)"
          >
            上一页
          </button>
          <span class="page-numbers">
            <span 
              v-for="page in pageNumbers" 
              :key="page"
              class="page-number"
              :class="{ active: page === pagination.currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </span>
          </span>
          <button 
            class="btn small" 
            :disabled="pagination.currentPage === totalPages"
            @click="goToPage(pagination.currentPage + 1)"
          >
            下一页
          </button>
        </div>
        <div class="page-jump">
          <span>前往</span>
          <input 
            type="number" 
            v-model="jumpPage" 
            class="form-input jump-input"
            min="1" 
            :max="totalPages"
          >
          <span>页</span>
          <button class="btn small primary" @click="jumpToPage">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 搜索参数
const searchParams = ref({
  keyword: ''
})

// 分页参数
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 80
})

// 跳转页码
const jumpPage = ref('')

// 选中的试卷
const selectedPapers = ref([])

// 试卷数据
const papers = ref([
  {
    id: 1,
    name: 'Vue.js中级考试试卷',
    method: '选题组卷',
    totalScore: 100,
    creator: '王老师',
    createTime: '2019-11-30 10:00'
  },
  {
    id: 2,
    name: 'React基础测试试卷',
    method: '选题组卷',
    totalScore: 100,
    creator: '王老师',
    createTime: '2019-11-30 10:00'
  },
  {
    id: 3,
    name: 'JavaScript高级编程试卷',
    method: '选题组卷',
    totalScore: 100,
    creator: '王老师',
    createTime: '2019-11-30 10:00'
  },
  {
    id: 4,
    name: 'HTML/CSS基础试卷',
    method: '选题组卷',
    totalScore: 100,
    creator: '王老师',
    createTime: '2019-11-30 10:00'
  },
  {
    id: 5,
    name: '数据库原理期末试卷',
    method: '选题组卷',
    totalScore: 100,
    creator: '王老师',
    createTime: '2019-11-30 10:00'
  }
])

// 计算属性
const totalPapers = computed(() => pagination.value.total)

const totalPages = computed(() => {
  return Math.ceil(totalPapers.value / pagination.value.pageSize)
})

const isAllSelected = computed(() => {
  return selectedPapers.value.length === papers.value.length && papers.value.length > 0
})

const pageNumbers = computed(() => {
  const pages = []
  const currentPage = pagination.value.currentPage
  const total = totalPages.value
  
  let start = Math.max(1, currentPage - 2)
  let end = Math.min(total, currentPage + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(total, start + 4)
    } else {
      start = Math.max(1, end - 4)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 搜索试卷
const searchPapers = () => {
  console.log('搜索参数:', searchParams.value)
  // 在实际应用中，这里会调用API进行搜索
  alert('搜索功能已执行')
}

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    keyword: ''
  }
}

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedPapers.value = []
  } else {
    selectedPapers.value = papers.value.map(p => p.id)
  }
}

// 切换选择单个试卷
const toggleSelectPaper = (id) => {
  const index = selectedPapers.value.indexOf(id)
  if (index > -1) {
    selectedPapers.value.splice(index, 1)
  } else {
    selectedPapers.value.push(id)
  }
}

// 创建试卷 - 跳转到新的独立页面
const createPaper = () => {
  router.push('/create-paper')
}

// 批量删除试卷
const deleteSelected = () => {
  if (selectedPapers.value.length === 0) return
  
  if (confirm(`确定要删除选中的${selectedPapers.value.length}个试卷吗？`)) {
    papers.value = papers.value.filter(p => !selectedPapers.value.includes(p.id))
    selectedPapers.value = []
  }
}

// 预览试卷 - 跳转到新的预览页面
const previewPaper = (paper) => {
  router.push('/paper-preview')
}

// 编辑试卷
const editPaper = (paper) => {
  alert(`编辑试卷：${paper.name}`)
  // 在实际应用中，这里会打开编辑模态框
}

// 创建考试
const createExam = (paper) => {
  alert(`基于试卷 "${paper.name}" 创建考试`)
  // 在实际应用中，这里会跳转到创建考试页面或打开创建考试模态框
}

// 分页相关方法
const changePageSize = () => {
  pagination.value.currentPage = 1
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    pagination.value.currentPage = page
  }
}

const jumpToPage = () => {
  const page = parseInt(jumpPage.value)
  if (page >= 1 && page <= totalPages.value) {
    pagination.value.currentPage = page
    jumpPage.value = ''
  } else {
    alert(`请输入1到${totalPages.value}之间的页码`)
  }
}
</script>

<style scoped>
.paper-bank {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100% - 20px);
}

.paper-bank h1 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 顶部操作与搜索栏 */
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
  gap: 15px;
}

.search-filters {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-actions {
  display: flex;
  gap: 5px;
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

.jump-input {
  width: 60px;
  text-align: center;
}

/* 数据表格 */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
}

.data-table tbody tr:hover {
  background-color: #f8f9fa;
}

.action-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

/* 底部分页区 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #eee;
}

.pagination-info {
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 5px;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.page-number.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>