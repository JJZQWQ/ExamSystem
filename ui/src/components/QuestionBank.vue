<template>
  <div class="question-bank">
    <h1>试题库</h1>
    
    <!-- 顶部操作与搜索栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn primary" @click="showCreateModal">
          <span>+</span> 添加试题
        </button>
        <button class="btn secondary" @click="deleteSelected" :disabled="selectedQuestions.length === 0">
          删除
        </button>
        <button class="btn secondary" @click="showImportDialog">
          导入试题
        </button>
      </div>
      <div class="toolbar-right">
        <div class="search-filters">
          <div class="filter-group">
            <input 
              type="text" 
              v-model="searchParams.keyword" 
              placeholder="题干关键字" 
              class="form-input"
            >
          </div>
          <div class="filter-group">
            <select v-model="searchParams.questionType" class="form-select">
              <option value="">全部题型</option>
              <option value="单选题">单选题</option>
              <option value="多选题">多选题</option>
              <option value="判断题">判断题</option>
              <option value="填空题">填空题</option>
              <option value="简答题">简答题</option>
            </select>
          </div>
          <div class="filter-actions">
            <button class="btn primary" @click="searchQuestions">搜索</button>
            <button class="btn secondary" @click="resetSearch">重置</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主内容区（试题列表） -->
    <div class="question-content">
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
              <th>题干</th>
              <th>试题分类</th>
              <th>题型</th>
              <th>创建时间</th>
              <th width="15%">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="question in questions" :key="question.id">
              <td>
                <input 
                  type="checkbox" 
                  :checked="selectedQuestions.includes(question.id)"
                  @change="toggleSelectQuestion(question.id)"
                >
              </td>
              <td>{{ question.stem }}</td>
              <td>{{ question.category }}</td>
              <td>{{ question.type }}</td>
              <td>{{ question.createTime }}</td>
              <td>
                <div class="action-buttons">
                  <button class="btn small secondary" @click="showEditModal(question)">编辑</button>
                  <button class="btn small danger" @click="deleteQuestion(question.id)">删除</button>
                  <button 
                    class="btn small" 
                    :class="question.status === 'active' ? 'warning' : 'success'"
                    @click="toggleQuestionStatus(question.id)"
                  >
                    {{ question.status === 'active' ? '停用' : '启用' }}
                  </button>
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
        共 {{ totalQuestions }} 条
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
    
    <!-- 添加/编辑试题模态框 -->
    <div v-if="showQuestionModal" class="modal-overlay" @click="closeQuestionModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>{{ questionModalType === 'create' ? '添加试题' : '编辑试题' }}</h3>
          <button class="close-btn" @click="closeQuestionModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>题干 *</label>
            <textarea 
              v-model="questionForm.stem" 
              class="form-textarea"
              rows="3"
              placeholder="请输入题干内容"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label>试题分类 *</label>
            <select v-model="questionForm.category" class="form-select">
              <option value="">请选择分类</option>
              <option value="综合考试题库">综合考试题库</option>
              <option value="拓展考试题库">拓展考试题库</option>
              <option value="在线测试题库">在线测试题库</option>
              <option value="案例题库">案例题库</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>题型 *</label>
            <select v-model="questionForm.type" class="form-select" @change="onQuestionTypeChange">
              <option value="">请选择题型</option>
              <option value="单选题">单选题</option>
              <option value="多选题">多选题</option>
              <option value="判断题">判断题</option>
              <option value="填空题">填空题</option>
              <option value="简答题">简答题</option>
            </select>
          </div>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="难度" prop="difficulty">
                <el-rate v-model="questionForm.difficulty" show-text />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="分值" prop="score">
                <el-input-number v-model="questionForm.score" :min="1" :max="100" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <!-- 选项部分（仅对选择题显示） -->
          <div v-if="questionForm.type === '单选题' || questionForm.type === '多选题'">
            <el-form-item label="选项" prop="options">
              <div class="options-container">
                <div 
                  v-for="(option, index) in questionForm.options" 
                  :key="index"
                  class="option-item"
                >
                  <el-input
                    v-model="option.content"
                    :placeholder="'选项 ' + String.fromCharCode(65 + index)"
                    class="option-input"
                  >
                    <template #prefix>
                      <span class="option-label">{{ String.fromCharCode(65 + index) }}.</span>
                    </template>
                    <template #append>
                      <el-button 
                        v-if="questionForm.options.length > 2" 
                        type="danger"
                        @click="removeOption(index)"
                        :icon="Delete"
                      />
                    </template>
                  </el-input>
                </div>
                <el-button type="primary" plain @click="addOption" :icon="Plus">
                  添加选项
                </el-button>
              </div>
            </el-form-item>
          </div>
          
          <!-- 答案部分 -->
          <el-form-item label="答案" prop="answer">
            <!-- 单选题答案 -->
            <div v-if="questionForm.type === '单选题'">
              <el-radio-group v-model="questionForm.answer">
                <el-radio 
                  v-for="(option, index) in questionForm.options" 
                  :key="index"
                  :label="String.fromCharCode(65 + index)"
                >
                  {{ String.fromCharCode(65 + index) }}. {{ option.content }}
                </el-radio>
              </el-radio-group>
            </div>
            
            <!-- 多选题答案 -->
            <div v-else-if="questionForm.type === '多选题'">
              <el-checkbox-group v-model="questionForm.answer">
                <el-checkbox 
                  v-for="(option, index) in questionForm.options" 
                  :key="index"
                  :label="String.fromCharCode(65 + index)"
                >
                  {{ String.fromCharCode(65 + index) }}. {{ option.content }}
                </el-checkbox>
              </el-checkbox-group>
            </div>
            
            <!-- 判断题答案 -->
            <div v-else-if="questionForm.type === '判断题'">
              <el-radio-group v-model="questionForm.answer">
                <el-radio label="正确">正确</el-radio>
                <el-radio label="错误">错误</el-radio>
              </el-radio-group>
            </div>
            
            <!-- 填空题/简答题答案 -->
            <div v-else>
              <el-input
                v-model="questionForm.answer"
                type="textarea"
                :rows="3"
                placeholder="请输入答案"
              />
            </div>
          </el-form-item>
          
          <el-form-item label="解析" prop="analysis">
            <el-input
              v-model="questionForm.analysis"
              type="textarea"
              :rows="3"
              placeholder="请输入试题解析"
            />
          </el-form-item>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeQuestionModal">取消</button>
          <button class="btn primary" @click="saveQuestion">保存</button>
        </div>
      </div>
    </div>
    
    <!-- 导入试题模态框 -->
    <div v-if="showImportDialogFlag" class="modal-overlay" @click="closeImportDialog">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>导入试题</h3>
          <button class="close-btn" @click="closeImportDialog">×</button>
        </div>
        
        <div class="modal-body">
          <div class="import-instructions">
            <p>请按照以下格式准备Excel文件：</p>
            <ul>
              <li>第一行为表头：题干、试题分类、题型、选项A、选项B、选项C、选项D、答案、解析</li>
              <li>题型支持：单选题、多选题、判断题、填空题、简答题</li>
              <li>多选题答案请用逗号分隔，如：A,C</li>
              <li>判断题答案请填写：正确 或 错误</li>
            </ul>
          </div>
          
          <div class="form-group">
            <label>选择文件 *</label>
            <input type="file" accept=".xlsx,.xls" class="form-file" @change="handleFileSelect">
          </div>
          
          <div class="import-preview" v-if="importPreview.length > 0">
            <h4>预览前5条数据：</h4>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>题干</th>
                    <th>试题分类</th>
                    <th>题型</th>
                    <th>答案</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in importPreview" :key="index">
                    <td>{{ item.stem }}</td>
                    <td>{{ item.category }}</td>
                    <td>{{ item.type }}</td>
                    <td>{{ item.answer }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeImportDialog">取消</button>
          <button class="btn primary" @click="importQuestions" :disabled="!selectedFile">导入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 搜索参数
const searchParams = ref({
  keyword: '',
  questionType: ''
})

// 分页参数
const pagination = ref({
  currentPage: 1,
  pageSize: 10,
  total: 80
})

// 跳转页码
const jumpPage = ref('')

// 选中的试题
const selectedQuestions = ref([])

// 试题数据
const questions = ref([
  {
    id: 1,
    stem: 'Vue.js是一个用于构建用户界面的渐进式框架，它的核心库只关注视图层。',
    category: '综合考试题库',
    type: '单选题',
    createTime: '2023-06-01 10:00',
    status: 'active'
  },
  {
    id: 2,
    stem: 'React是Facebook开发的一个用于构建用户界面的JavaScript库。',
    category: '拓展考试题库',
    type: '判断题',
    createTime: '2023-06-02 14:30',
    status: 'active'
  },
  {
    id: 3,
    stem: '请简述Vue.js的生命周期。',
    category: '在线测试题库',
    type: '简答题',
    createTime: '2023-06-03 09:15',
    status: 'inactive'
  },
  {
    id: 4,
    stem: 'JavaScript中的闭包是指什么？',
    category: '案例题库',
    type: '填空题',
    createTime: '2023-06-04 16:45',
    status: 'active'
  },
  {
    id: 5,
    stem: '以下哪些是Vue.js的指令？',
    category: '综合考试题库',
    type: '多选题',
    createTime: '2023-06-05 11:20',
    status: 'active'
  }
])

// 模态框相关
const showQuestionModal = ref(false)
const questionModalType = ref('create') // 'create' 或 'edit'
const editingQuestionId = ref(null)

const showImportDialogFlag = ref(false)
const selectedFile = ref(null)
const importPreview = ref([])

// 试题表单数据
const questionForm = ref({
  stem: '',
  category: '',
  type: '',
  options: [
    { content: '' },
    { content: '' }
  ],
  answer: '',
  analysis: ''
})

// 计算属性
const totalQuestions = computed(() => pagination.value.total)

const totalPages = computed(() => {
  return Math.ceil(totalQuestions.value / pagination.value.pageSize)
})

const isAllSelected = computed(() => {
  return selectedQuestions.value.length === questions.value.length && questions.value.length > 0
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

// 搜索试题
const searchQuestions = () => {
  console.log('搜索参数:', searchParams.value)
  // 在实际应用中，这里会调用API进行搜索
  alert('搜索功能已执行')
}

// 重置搜索
const resetSearch = () => {
  searchParams.value = {
    keyword: '',
    questionType: ''
  }
}

// 切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedQuestions.value = []
  } else {
    selectedQuestions.value = questions.value.map(q => q.id)
  }
}

// 切换选择单个试题
const toggleSelectQuestion = (id) => {
  const index = selectedQuestions.value.indexOf(id)
  if (index > -1) {
    selectedQuestions.value.splice(index, 1)
  } else {
    selectedQuestions.value.push(id)
  }
}

// 显示创建试题模态框
const showCreateModal = () => {
  questionModalType.value = 'create'
  editingQuestionId.value = null
  resetQuestionForm()
  showQuestionModal.value = true
}

// 显示编辑试题模态框
const showEditModal = (question) => {
  questionModalType.value = 'edit'
  editingQuestionId.value = question.id
  questionForm.value = {
    stem: question.stem,
    category: question.category,
    type: question.type,
    options: questionForm.value.options, // 保持选项结构
    answer: question.answer || '',
    analysis: question.analysis || ''
  }
  showQuestionModal.value = true
}

// 关闭试题模态框
const closeQuestionModal = () => {
  showQuestionModal.value = false
}

// 重置试题表单
const resetQuestionForm = () => {
  questionForm.value = {
    stem: '',
    category: '',
    type: '',
    options: [
      { content: '' },
      { content: '' }
    ],
    answer: '',
    analysis: ''
  }
}

// 题型变化时的处理
const onQuestionTypeChange = () => {
  // 重置选项和答案
  questionForm.value.options = [
    { content: '' },
    { content: '' }
  ]
  questionForm.value.answer = ''
}

// 添加选项
const addOption = () => {
  questionForm.value.options.push({ content: '' })
}

// 删除选项
const removeOption = (index) => {
  if (questionForm.value.options.length > 2) {
    questionForm.value.options.splice(index, 1)
    
    // 如果删除的是已选中的选项，需要更新答案
    if (questionForm.value.type === '单选题') {
      const answerIndex = questionForm.value.answer.charCodeAt(0) - 65
      if (answerIndex === index) {
        questionForm.value.answer = ''
      } else if (answerIndex > index) {
        questionForm.value.answer = String.fromCharCode(65 + answerIndex - 1)
      }
    } else if (questionForm.value.type === '多选题') {
      const answers = questionForm.value.answer.split(',')
      const updatedAnswers = answers
        .map(a => a.trim())
        .filter(a => {
          const answerIndex = a.charCodeAt(0) - 65
          return answerIndex !== index
        })
        .map((a, i) => {
          const answerIndex = a.charCodeAt(0) - 65
          return answerIndex > index 
            ? String.fromCharCode(65 + answerIndex - 1) 
            : a
        })
      
      questionForm.value.answer = updatedAnswers.join(',')
    }
  }
}

// 保存试题
const saveQuestion = () => {
  if (!questionForm.value.stem.trim()) {
    alert('请输入题干内容')
    return
  }
  
  if (!questionForm.value.category) {
    alert('请选择试题分类')
    return
  }
  
  if (!questionForm.value.type) {
    alert('请选择题型')
    return
  }
  
  if (!questionForm.value.answer) {
    alert('请输入答案')
    return
  }
  
  if (questionModalType.value === 'create') {
    // 创建新试题
    const newQuestion = {
      id: Date.now(),
      stem: questionForm.value.stem,
      category: questionForm.value.category,
      type: questionForm.value.type,
      createTime: new Date().toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      status: 'active'
    }
    questions.value.unshift(newQuestion)
  } else {
    // 编辑试题
    const index = questions.value.findIndex(q => q.id === editingQuestionId.value)
    if (index !== -1) {
      questions.value[index].stem = questionForm.value.stem
      questions.value[index].category = questionForm.value.category
      questions.value[index].type = questionForm.value.type
    }
  }
  
  closeQuestionModal()
}

// 删除试题
const deleteQuestion = (id) => {
  if (confirm('确定要删除这个试题吗？')) {
    const index = questions.value.findIndex(q => q.id === id)
    if (index !== -1) {
      questions.value.splice(index, 1)
      // 同时从选中列表中移除
      const selectedIndex = selectedQuestions.value.indexOf(id)
      if (selectedIndex > -1) {
        selectedQuestions.value.splice(selectedIndex, 1)
      }
    }
  }
}

// 批量删除试题
const deleteSelected = () => {
  if (selectedQuestions.value.length === 0) return
  
  if (confirm(`确定要删除选中的${selectedQuestions.value.length}个试题吗？`)) {
    questions.value = questions.value.filter(q => !selectedQuestions.value.includes(q.id))
    selectedQuestions.value = []
  }
}

// 切换试题状态
const toggleQuestionStatus = (id) => {
  const question = questions.value.find(q => q.id === id)
  if (question) {
    question.status = question.status === 'active' ? 'inactive' : 'active'
  }
}

// 显示导入模态框
const showImportDialog = () => {
  showImportDialogFlag.value = true
  selectedFile.value = null
  importPreview.value = []
}

// 关闭导入模态框
const closeImportDialog = () => {
  showImportDialogFlag.value = false
  selectedFile.value = null
  importPreview.value = []
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    // 模拟文件预览（在实际应用中需要解析Excel文件）
    importPreview.value = [
      {
        stem: '这是导入的示例题目1',
        category: '综合考试题库',
        type: '单选题',
        answer: 'A'
      },
      {
        stem: '这是导入的示例题目2',
        category: '拓展考试题库',
        type: '判断题',
        answer: '正确'
      }
    ]
  }
}

// 导入试题
const importQuestions = () => {
  if (!selectedFile.value) {
    alert('请选择要导入的文件')
    return
  }
  
  // 在实际应用中，这里会处理文件上传和解析
  alert(`成功导入${importPreview.value.length}条试题数据`)
  closeImportDialog()
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
.question-bank {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100% - 20px);
}

.question-bank h1 {
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
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.btn:active::before {
  width: 100px;
  height: 100px;
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0) scale(0.95);
}

.btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.btn.small {
  padding: 5px 10px;
  font-size: 12px;
}

.btn.primary {
  background-color: #0066cc;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: #0052a3;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.btn.secondary {
  background-color: #6c757d;
  color: white;
}

.btn.secondary:hover:not(:disabled) {
  background-color: #545b62;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn.danger {
  background-color: #dc3545;
  color: white;
}

.btn.danger:hover:not(:disabled) {
  background-color: #c82333;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn.warning {
  background-color: #ffc107;
  color: #212529;
}

.btn.warning:hover:not(:disabled) {
  background-color: #e0a800;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.btn.success {
  background-color: #28a745;
  color: white;
}

.btn.success:hover:not(:disabled) {
  background-color: #218838;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
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
.form-select,
.form-textarea,
.form-file {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e1e8ff;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;
  position: relative;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  transform: translateY(-1px);
}

.form-input:hover,
.form-select:hover,
.form-textarea:hover {
  border-color: #b3d1ff;
  background-color: #f8fbff;
}

.jump-input {
  width: 60px;
  text-align: center;
}

/* 数据表格 */
.table-container {
  overflow-x: auto;
  animation: fadeInUp 0.6s ease-out;
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
  transition: all 0.2s ease;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.data-table tbody tr::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 3px;
  height: 100%;
  background-color: transparent;
  transition: background-color 0.3s;
}

.data-table tbody tr:hover {
  background-color: #f8f9ff;
  transform: translateX(3px);
}

.data-table tbody tr:hover::before {
  background-color: #0066cc;
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
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.page-number::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(0, 102, 204, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.page-number:hover::before {
  width: 30px;
  height: 30px;
}

.page-number:hover {
  border-color: #0066cc;
  background-color: #f0f8ff;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
}

.page-number.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.page-number.active:hover {
  background-color: #0052a3;
  transform: scale(1.1) translateY(-2px);
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 5px;
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
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0066cc, #00a8ff, #0066cc);
  background-size: 200% 100%;
  animation: shimmer 2s linear infinite;
}

.modal-content.large {
  max-width: 800px;
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
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.close-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(220, 53, 69, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.close-btn:hover::before {
  width: 40px;
  height: 40px;
}

.close-btn:hover {
  color: #dc3545;
  background-color: rgba(220, 53, 69, 0.1);
  transform: rotate(90deg) scale(1.1);
}

.close-btn:active {
  transform: rotate(90deg) scale(0.95);
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

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-label {
  font-weight: bold;
  width: 20px;
}

.option-input {
  flex: 1;
}

/* 答案部分 */
.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 导入说明 */
.import-instructions {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.import-instructions ul {
  margin: 10px 0;
  padding-left: 20px;
}

.import-instructions li {
  margin-bottom: 5px;
}

.import-preview {
  margin-top: 20px;
}

.import-preview h4 {
  margin-top: 0;
  margin-bottom: 10px;
}
</style>