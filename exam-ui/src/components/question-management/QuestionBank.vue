<template>
  <div class="question-bank">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><Document /></el-icon>
        试题库
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总试题数" :value="totalQuestions" />
        <el-statistic title="已发布" :value="activeQuestions" />
        <el-statistic title="草稿" :value="draftQuestions" />
      </div>
    </div>

    <div class="content-wrapper">
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
            添加试题
          </el-button>
          <el-button 
            type="success" 
            size="large"
            @click="showImportDialog"
            class="action-btn"
          >
            <el-icon><Upload /></el-icon>
            导入试题
          </el-button>
          <el-button 
            type="danger" 
            size="large"
            @click="deleteSelected"
            :disabled="selectedQuestions.length === 0"
            class="action-btn"
          >
            <el-icon><Delete /></el-icon>
            批量删除
          </el-button>
        </div>
        <div class="toolbar-right">
          <div class="search-filters">
            <el-input
              v-model="searchParams.keyword"
              placeholder="搜索题干关键字..."
              :prefix-icon="Search"
              class="search-input"
              clearable
              @input="handleSearch"
            />
            
            <el-select 
              v-model="searchParams.questionType" 
              placeholder="题型" 
              clearable
              class="filter-select"
            >
              <el-option label="全部题型" value="" />
              <el-option label="单选题" value="单选题" />
              <el-option label="多选题" value="多选题" />
              <el-option label="判断题" value="判断题" />
              <el-option label="填空题" value="填空题" />
              <el-option label="简答题" value="简答题" />
            </el-select>
            
            <el-select 
              v-model="searchParams.category" 
              placeholder="分类" 
              clearable
              class="filter-select"
            >
              <el-option label="全部分类" value="" />
              <el-option label="综合考试题库" value="综合考试题库" />
              <el-option label="拓展考试题库" value="拓展考试题库" />
              <el-option label="在线测试题库" value="在线测试题库" />
              <el-option label="案例题库" value="案例题库" />
            </el-select>
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
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
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
import { 
  Document, 
  Plus, 
  Upload, 
  Delete, 
  Search 
} from '@element-plus/icons-vue'

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

const activeQuestions = computed(() => {
  return questions.value.filter(q => q.status === 'active').length
})

const draftQuestions = computed(() => {
  return questions.value.filter(q => q.status === 'inactive').length
})

const totalPages = computed(() => {
  return Math.ceil(totalQuestions.value / pagination.value.pageSize)
})

const isAllSelected = computed(() => {
  return selectedQuestions.value.length === questions.value.length && questions.value.length > 0
})

// 搜索试题
const searchQuestions = () => {
  console.log('搜索参数:', searchParams.value)
  // 在实际应用中，这里会调用API进行搜索
  alert('搜索功能已执行')
}

// 处理搜索输入
const handleSearch = () => {
  searchQuestions()
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
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
}

const handleCurrentChange = (page) => {
  pagination.value.currentPage = page
}
</script>

<style scoped>
.question-bank {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 40px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: fadeIn 0.6s ease-out;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
}

/* 页面头部样式 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 24px;
  margin: 0 0 24px 0;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.page-header-content {
  position: relative;
  z-index: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

.page-stats {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 顶部操作与搜索栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.toolbar-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.search-filters {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-actions {
  display: flex;
  gap: 8px;
}

/* 按钮样式 */
.btn {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-family: inherit;
  letter-spacing: 0.3px;
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
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0) scale(0.98);
}

.btn:disabled {
  background-color: #e9ecef;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
  opacity: 0.6;
}

.btn:disabled:hover {
  transform: none;
  box-shadow: none;
}

.btn.small {
  padding: 6px 12px;
  font-size: 13px;
}

.btn.primary {
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0052a3 0%, #003d7a 100%);
  box-shadow: 0 6px 24px rgba(0, 102, 204, 0.4);
}

.btn.secondary {
  background: linear-gradient(135deg, #6c757d 0%, #545b62 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn.secondary:hover:not(:disabled) {
  background: linear-gradient(135deg, #545b62 0%, #3d4142 100%);
  box-shadow: 0 6px 24px rgba(108, 117, 125, 0.4);
}

.btn.danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn.danger:hover:not(:disabled) {
  background: linear-gradient(135deg, #c82333 0%, #a71e2a 100%);
  box-shadow: 0 6px 24px rgba(220, 53, 69, 0.4);
}

.btn.warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
  box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
}

.btn.warning:hover:not(:disabled) {
  background: linear-gradient(135deg, #e0a800 0%, #d39e00 100%);
  box-shadow: 0 6px 24px rgba(255, 193, 7, 0.4);
}

.btn.success {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.btn.success:hover:not(:disabled) {
  background: linear-gradient(135deg, #218838 0%, #1e7e34 100%);
  box-shadow: 0 6px 24px rgba(40, 167, 69, 0.4);
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  letter-spacing: 0.3px;
}

.form-input,
.form-select,
.form-textarea,
.form-file {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e8ff;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;
  position: relative;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.1);
  transform: translateY(-1px);
  background-color: #f8fbff;
}

.form-input:hover,
.form-select:hover,
.form-textarea:hover {
  border-color: #b3d1ff;
  background-color: #f8fbff;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08);
}

.jump-input {
  width: 70px;
  text-align: center;
  font-weight: 500;
}

/* 数据表格 */
.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
  animation: fadeInUp 0.6s ease-out;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  table-layout: fixed;
}

.data-table th,
.data-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.2s ease;
  font-size: 14px;
  vertical-align: middle;
}

.data-table th {
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  font-weight: 600;
  color: #2c3e50;
  position: sticky;
  top: 0;
  z-index: 10;
  letter-spacing: 0.3px;
  border-bottom: 2px solid #e1e8ff;
}

/* 设置列宽 */
.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 5%;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
  width: 40%;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 15%;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 15%;
}

.data-table th:nth-child(5),
.data-table td:nth-child(5) {
  width: 25%;
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
  width: 4px;
  height: 100%;
  background-color: transparent;
  transition: background-color 0.3s;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  transform: translateX(4px);
  box-shadow: 0 2px 12px rgba(0, 102, 204, 0.08);
}

.data-table tbody tr:hover::before {
  background: linear-gradient(135deg, #0066cc 0%, #00a8ff 100%);
}

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 底部分页区 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: 24px;
}

.pagination-info {
  color: #6c757d;
  font-size: 14px;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 24px;
}

.page-size-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  padding: 8px 16px;
  border: 2px solid #e1e8ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
  font-size: 14px;
  background: #fff;
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
  width: 40px;
  height: 40px;
}

.page-number:hover {
  border-color: #0066cc;
  background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
}

.page-number.active {
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  color: white;
  border-color: #0066cc;
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.3);
}

.page-number.active:hover {
  background: linear-gradient(135deg, #0052a3 0%, #003d7a 100%);
  transform: scale(1.05) translateY(-2px);
}

.page-jump {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: 85%;
  max-width: 700px;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  max-width: 900px;
}

.modal-header {
  padding: 24px 28px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
}

.modal-header h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #6c757d;
  width: 40px;
  height: 40px;
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
  width: 50px;
  height: 50px;
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
  padding: 28px;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  padding: 20px 28px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
}

/* 选项容器 */
.options-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.option-item:hover {
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
  transform: translateY(-1px);
}

.option-label {
  font-weight: 600;
  width: 24px;
  color: #0066cc;
}

.option-input {
  flex: 1;
}

/* 答案部分 */
.radio-group,
.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.radio-item:hover,
.checkbox-item:hover {
  background-color: #f8faff;
}

/* 导入说明 */
.import-instructions {
  background: linear-gradient(135deg, #f8faff 0%, #ffffff 100%);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border-left: 4px solid #0066cc;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.08);
}

.import-instructions ul {
  margin: 12px 0;
  padding-left: 24px;
}

.import-instructions li {
  margin-bottom: 8px;
  line-height: 1.6;
  color: #2c3e50;
}

.import-preview {
  margin-top: 24px;
}

.import-preview h4 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #1a1a1a;
  font-weight: 600;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* 分页容器样式 - 与考试信息管理模块保持一致 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 表格行样式 */
:deep(.running-row) {
  background-color: #f0f9ff !important;
}

:deep(.completed-row) {
  background-color: #f5f7fa !important;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
  transform: scale(1.005);
}

/* 响应式设计 */
@media (max-width: 1400px) {
  .content-wrapper {
    max-width: 1200px;
  }
}

@media (max-width: 1200px) {
  .question-bank {
    padding: 20px;
  }
  
  .content-wrapper {
    max-width: 100%;
  }
  
  .page-header {
    padding: 24px 20px;
  }
  
  .page-title {
    font-size: 28px;
  }
  
  .page-stats {
    gap: 24px;
  }
  
  .toolbar {
    padding: 16px 20px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .toolbar-left,
  .toolbar-right {
    justify-content: center;
  }
  
  .search-filters {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .modal-content {
    width: 90%;
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .question-bank {
    padding: 16px;
  }
  
  .page-header {
    padding: 20px 16px;
    margin-bottom: 20px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 12px;
  }
  
  .page-stats {
    gap: 16px;
  }
  
  .stat-value {
    font-size: 20px;
  }
  
  .toolbar {
    padding: 12px 16px;
  }
  
  .toolbar-left {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .search-filters {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 6px;
  }
  
  .pagination {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .pagination-controls {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .page-numbers {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-navigation {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }
  
  .modal-content {
    width: 95%;
    max-height: 90vh;
    border-radius: 12px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 20px;
  }
  
  .modal-header {
    padding: 16px 20px;
  }
  
  .modal-header h3 {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .question-bank {
    padding: 12px;
  }
  
  .page-header {
    padding: 16px 12px;
  }
  
  .page-title {
    font-size: 20px;
  }
  
  .page-stats {
    gap: 12px;
  }
  
  .stat-item {
    text-align: center;
  }
  
  .stat-label {
    font-size: 12px;
  }
  
  .stat-value {
    font-size: 18px;
  }
  
  .toolbar {
    padding: 8px 12px;
  }
  
  .btn {
    padding: 8px 14px;
    font-size: 13px;
  }
  
  .btn.small {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .data-table {
    font-size: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 8px 12px;
  }
  
  .data-table th:nth-child(1),
  .data-table td:nth-child(1) {
    width: 8%;
  }
  
  .data-table th:nth-child(2),
  .data-table td:nth-child(2) {
    width: 35%;
  }
  
  .data-table th:nth-child(3),
  .data-table td:nth-child(3) {
    width: 18%;
  }
  
  .data-table th:nth-child(4),
  .data-table td:nth-child(4) {
    width: 18%;
  }
  
  .data-table th:nth-child(5),
  .data-table td:nth-child(5) {
    width: 21%;
  }
  
  .modal-content {
    width: 98%;
    border-radius: 8px;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 16px;
  }
  
  .options-container {
    gap: 8px;
  }
  
  .option-item {
    padding: 8px;
  }
}
</style>