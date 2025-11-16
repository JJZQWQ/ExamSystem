<template>
  <div class="create-paper-page">
    <!-- 顶部通知区 -->
    <div class="top-bar">
      <div class="platform-name">在线考试平台</div>
      <div class="top-actions">
        <span class="notification">🔔<span class="badge">3</span></span>
        <button class="btn secondary" @click="exitCreate">退出</button>
      </div>
    </div>

    <div class="main-content">
      <!-- 试卷基本信息区 -->
      <div class="paper-info-section">
        <div class="info-row">
          <div class="form-group">
            <label>试卷名称</label>
            <input 
              type="text" 
              v-model="paperInfo.name" 
              class="form-input"
              placeholder="请输入试卷名称"
            >
          </div>
          
          <div class="form-group">
            <label>组卷方式</label>
            <div class="radio-group">
              <div class="radio-item">
                <input type="radio" id="manual" value="选题组卷" v-model="paperInfo.method">
                <label for="manual">选题组卷</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="random" value="随机组卷" v-model="paperInfo.method">
                <label for="random">随机组卷</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-area">
        <!-- 左侧区域 -->
        <div class="left-panel">
          <!-- 统计区 -->
          <div class="statistics-panel">
            <div class="stat-item">
              <div class="stat-label">总题数</div>
              <div class="stat-value">{{ totalQuestions }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">总分数</div>
              <div class="stat-value">{{ totalScore }}</div>
            </div>
          </div>
          
          <!-- 题型选择区 -->
          <div class="question-type-section">
            <h3>题型选择</h3>
            <div class="question-type-grid">
              <button 
                class="question-type-btn" 
                :class="{ active: activeQuestionType === 'single' }"
                @click="selectQuestionType('single')"
              >
                单选题
              </button>
              <button 
                class="question-type-btn" 
                :class="{ active: activeQuestionType === 'multiple' }"
                @click="selectQuestionType('multiple')"
              >
                多选题
              </button>
              <button 
                class="question-type-btn" 
                :class="{ active: activeQuestionType === 'fill' }"
                @click="selectQuestionType('fill')"
              >
                填空题
              </button>
              <button 
                class="question-type-btn" 
                :class="{ active: activeQuestionType === 'judge' }"
                @click="selectQuestionType('judge')"
              >
                判断题
              </button>
              <button 
                class="question-type-btn" 
                :class="{ active: activeQuestionType === 'qa' }"
                @click="selectQuestionType('qa')"
              >
                问答题
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧区域 -->
        <div class="right-panel">
          <!-- 顶部设置区 -->
          <div class="selected-questions-header">
            <h3>所选的题目</h3>
            <div class="shuffle-options">
              <div class="radio-item">
                <input type="radio" id="shuffleQuestions" v-model="shuffleSetting" value="questions">
                <label for="shuffleQuestions">试题顺序打乱</label>
              </div>
              <div class="radio-item">
                <input type="radio" id="shuffleOptions" v-model="shuffleSetting" value="options">
                <label for="shuffleOptions">选项顺序打乱</label>
              </div>
            </div>
          </div>
          
          <!-- 试题答题区 -->
          <div class="questions-answer-area">
            <!-- 按题型分组展示试题 -->
            <div v-for="(questions, type) in groupedSelectedQuestions" :key="type" class="question-type-section">
              <h4>{{ getQuestionTypeLabel(type) }} (共 {{ questions.length }} 题)</h4>
              <div v-for="(question, index) in questions" :key="question.id" class="question-item">
                <div class="question-stem">
                  {{ index + 1 }}. {{ question.content }}
                </div>
                <div class="question-options">
                  <div class="option-item">
                    <input type="radio" :id="'optionA' + question.id" :name="'question' + question.id" value="A">
                    <label :for="'optionA' + question.id">A. 示例单选题选项</label>
                  </div>
                  <div class="option-item">
                    <input type="radio" :id="'optionB' + question.id" :name="'question' + question.id" value="B">
                    <label :for="'optionB' + question.id">B. 示例单选题选项</label>
                  </div>
                  <div class="option-item">
                    <input type="radio" :id="'optionC' + question.id" :name="'question' + question.id" value="C">
                    <label :for="'optionC' + question.id">C. 示例单选题选项</label>
                  </div>
                  <div class="option-item">
                    <input type="radio" :id="'optionD' + question.id" :name="'question' + question.id" value="D">
                    <label :for="'optionD' + question.id">D. 示例单选题选项</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 题型选择模态框 -->
    <div v-if="showQuestionModal" class="modal-overlay" @click="closeQuestionModal">
      <div class="modal-content large" @click.stop>
        <div class="modal-header">
          <h3>{{ getQuestionTypeLabel(activeQuestionType) }} 选题</h3>
          <button class="close-btn" @click="closeQuestionModal">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 筛选区域 -->
          <div class="filter-section">
            <div class="filter-row">
              <div class="filter-group">
                <label>试题分类</label>
                <select v-model="filterParams.category" class="form-select">
                  <option value="">全部</option>
                  <option value="category1">分类1</option>
                  <option value="category2">分类2</option>
                </select>
              </div>
              
              <div class="filter-group">
                <label>创建时间</label>
                <div class="date-range">
                  <input type="date" v-model="filterParams.startTime" class="form-input">
                  <span>至</span>
                  <input type="date" v-model="filterParams.endTime" class="form-input">
                </div>
              </div>
              
              <div class="filter-group">
                <label>关键词</label>
                <div class="keyword-search">
                  <input 
                    type="text" 
                    v-model="filterParams.keyword" 
                    placeholder="请输入关键词" 
                    class="form-input"
                  >
                  <button class="btn primary" @click="searchQuestions">搜索</button>
                  <button class="btn secondary" @click="resetFilter">重置</button>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-main">
            <!-- 试题列表 -->
            <div class="questions-list-section">
              <h4>试题列表</h4>
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th width="5%">
                        <input 
                          type="checkbox" 
                          :checked="areAllSelected" 
                          @change="toggleSelectAll"
                        >
                      </th>
                      <th>题型</th>
                      <th>试题内容</th>
                      <th>创建时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(question, index) in questionsList" :key="index">
                      <td>
                        <input 
                          type="checkbox" 
                          :checked="isSelected(question)" 
                          @change="toggleQuestionSelection(question)"
                        >
                      </td>
                      <td>{{ getQuestionTypeLabel(question.type) }}</td>
                      <td>{{ question.content }}</td>
                      <td>{{ question.createTime }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- 分页控件 -->
              <div class="pagination">
                <span>共 {{ totalQuestionsCount }} 条</span>
                <button 
                  v-for="page in totalPages" 
                  :key="page" 
                  :class="{ active: currentPage === page }"
                  @click="goToPage(page)"
                  class="page-btn"
                >
                  {{ page }}
                </button>
              </div>
            </div>
            
            <!-- 已选试题区 -->
            <div class="selected-questions-section-modal">
              <h4>已选试题 ({{ selectedQuestionsInModal.length }})</h4>
              <div class="selected-questions-list">
                <div 
                  v-for="(question, index) in selectedQuestionsInModal" 
                  :key="index" 
                  class="selected-question-item-modal"
                >
                  <div class="question-content">{{ question.content }}</div>
                  <button class="remove-btn" @click="removeFromModalSelection(question)">×</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeQuestionModal">返回</button>
          <button class="btn primary" @click="saveSelectedQuestions">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 试卷基本信息
const paperInfo = ref({
  name: '示例试卷 1',
  method: '选题组卷'
})

// 统计数据
const totalQuestions = ref(0)
const totalScore = ref(0)

// 活动题型
const activeQuestionType = ref('')

// 显示题型选择模态框
const showQuestionModal = ref(false)

// 已选试题列表
const selectedQuestions = ref([])

// 模态框内的已选试题
const selectedQuestionsInModal = ref([])

// 筛选参数
const filterParams = ref({
  category: '',
  startTime: '',
  endTime: '',
  keyword: ''
})

// 试题顺序设置
const shuffleSetting = ref('questions')

// 试题列表数据（模拟）
const questionsList = ref([
  { id: 1, type: 'single', content: '示例单选题题目1', createTime: '2023-01-01' },
  { id: 2, type: 'single', content: '示例单选题题目2', createTime: '2023-01-02' },
  { id: 3, type: 'single', content: '示例单选题题目3', createTime: '2023-01-03' }
])

// 总试题数
const totalQuestionsCount = ref(80)

// 当前页
const currentPage = ref(1)

// 总页数
const totalPages = computed(() => Math.ceil(totalQuestionsCount.value / 10))

// 添加用于分组已选试题的计算属性
const groupedSelectedQuestions = computed(() => {
  const grouped = {}
  selectedQuestions.value.forEach(question => {
    if (!grouped[question.type]) {
      grouped[question.type] = []
    }
    grouped[question.type].push(question)
  })
  return grouped
})

// 是否全选
const areAllSelected = computed(() => {
  return questionsList.value.length > 0 && 
         selectedQuestionsInModal.value.length === questionsList.value.length
})

// 获取题型标签
const getQuestionTypeLabel = (type) => {
  const typeMap = {
    'single': '单选题',
    'multiple': '多选题',
    'fill': '填空题',
    'judge': '判断题',
    'qa': '问答题'
  }
  return typeMap[type] || '未知题型'
}

// 选择题型
const selectQuestionType = (type) => {
  activeQuestionType.value = type
  showQuestionModal.value = true
  // 重置筛选条件
  resetFilter()
  // 初始化模态框内已选试题
  selectedQuestionsInModal.value = [...selectedQuestions.value.filter(q => q.type === type)]
}

// 关闭题型选择模态框
const closeQuestionModal = () => {
  showQuestionModal.value = false
  activeQuestionType.value = ''
  selectedQuestionsInModal.value = []
}

// 切换全选
const toggleSelectAll = (event) => {
  if (event.target.checked) {
    // 全选
    selectedQuestionsInModal.value = [...questionsList.value]
  } else {
    // 取消全选
    selectedQuestionsInModal.value = []
  }
}

// 切换试题选择
const toggleQuestionSelection = (question) => {
  const index = selectedQuestionsInModal.value.findIndex(q => q.id === question.id)
  if (index >= 0) {
    // 已选中，取消选择
    selectedQuestionsInModal.value.splice(index, 1)
  } else {
    // 未选中，添加选择
    selectedQuestionsInModal.value.push(question)
  }
}

// 判断试题是否已选中
const isSelected = (question) => {
  return selectedQuestionsInModal.value.some(q => q.id === question.id)
}

// 从模态框选择中移除
const removeFromModalSelection = (question) => {
  const index = selectedQuestionsInModal.value.findIndex(q => q.id === question.id)
  if (index >= 0) {
    selectedQuestionsInModal.value.splice(index, 1)
  }
}

// 搜索试题
const searchQuestions = () => {
  console.log('搜索试题:', filterParams.value)
  // 实际应用中这里会调用API获取数据
}

// 重置筛选条件
const resetFilter = () => {
  filterParams.value = {
    category: '',
    startTime: '',
    endTime: '',
    keyword: ''
  }
}

// 跳转到指定页
const goToPage = (page) => {
  currentPage.value = page
  // 实际应用中这里会重新加载数据
}

// 保存选中的试题
const saveSelectedQuestions = () => {
  // 将模态框中选中的试题添加到主列表中
  selectedQuestions.value = [
    ...selectedQuestions.value.filter(q => q.type !== activeQuestionType.value),
    ...selectedQuestionsInModal.value.map(q => ({
      ...q,
      score: 5 // 默认分数
    }))
  ]
  
  // 更新统计数据
  totalQuestions.value = selectedQuestions.value.length
  totalScore.value = selectedQuestions.value.reduce((sum, q) => sum + (q.score || 0), 0)
  
  // 关闭模态框
  closeQuestionModal()
}

// 移除已选试题
const removeQuestion = (index) => {
  selectedQuestions.value.splice(index, 1)
  // 更新统计数据
  totalQuestions.value = selectedQuestions.value.length
  totalScore.value = selectedQuestions.value.reduce((sum, q) => sum + (q.score || 0), 0)
}

// 退出创建
const exitCreate = () => {
  router.push('/home/question/paper')
}
</script>

<style scoped>
.create-paper-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  max-width: 100%;
  overflow-x: hidden;
}

/* 顶部通知区 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0 20px;
  flex-shrink: 0;
}

.platform-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 20px;
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

.btn {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn.primary {
  background-color: #0066cc;
  color: white;
}

.btn.primary:hover {
  background-color: #0056b3;
}

.btn.secondary {
  background-color: #6c757d;
  color: white;
}

.btn.secondary:hover {
  background-color: #5a6268;
}

/* 主内容区 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
  max-width: 100%;
}

/* 试卷基本信息区 */
.paper-info-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 20px;
}

.info-row {
  display: flex;
  gap: 30px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.info-row .form-group {
  flex: 1;
  margin-bottom: 0;
  min-width: 200px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-input, .form-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #0066cc;
}

/* 单选框组 */
.radio-group {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 内容区域 */
.content-area {
  flex: 1;
  display: flex;
  gap: 20px;
  overflow: hidden;
  min-height: 600px;
}

/* 左侧区域 */
.left-panel {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
}

/* 统计区 */
.statistics-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 20px;
  display: flex;
  gap: 15px;
}

.stat-item {
  flex: 1;
  text-align: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #0066cc;
}

/* 题型选择区 */
.question-type-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.question-type-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.question-type-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  padding: 10px 0;
}

.question-type-btn {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  transition: all 0.2s;
  text-align: left;
}

.question-type-btn:hover, .question-type-btn.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

/* 右侧区域 */
.right-panel {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 右侧区域 - 顶部设置区 */
.selected-questions-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.selected-questions-header h3 {
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.shuffle-options {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

/* 试题答题区 */
.questions-answer-area {
  flex: 1;
  overflow-y: auto;
}

.question-type-section {
  margin-bottom: 25px;
}

.question-type-section h4 {
  color: #0066cc;
  margin-bottom: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.question-item {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.question-stem {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.question-options {
  margin-left: 10px;
}

.option-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}

.option-item input[type="radio"] {
  margin: 0;
}

.option-item label {
  cursor: pointer;
  color: #555;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 1200px;
}

.modal-header {
  padding: 20px;
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

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 筛选区域 */
.filter-section {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 150px;
}

.filter-group label {
  font-weight: bold;
  color: #333;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.keyword-search {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 表格容器 */
.table-container {
  overflow-x: auto;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

/* 分页控件 */
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.page-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

/* 模态框内已选试题区 */
.selected-questions-section-modal {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
}

.selected-questions-section-modal h4 {
  margin-top: 0;
  color: #333;
}

.selected-question-item-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 5px;
}

.modal-main {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.questions-list-section {
  flex: 2;
  min-width: 300px;
}

.selected-questions-section-modal {
  flex: 1;
  min-width: 250px;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .content-area {
    flex-direction: column;
  }
  
  .left-panel {
    width: 100%;
  }
  
  .info-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .modal-content {
    width: 95%;
    margin: 10px;
  }
  
  .modal-main {
    flex-direction: column;
  }
}
</style>