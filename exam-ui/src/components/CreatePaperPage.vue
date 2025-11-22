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
            <div v-if="selectedQuestions.length === 0" class="empty-state">
              <div class="empty-icon">📝</div>
              <p>请从左侧选择题型添加试题</p>
            </div>
            <div v-else v-for="(questions, type) in groupedSelectedQuestions" :key="type" class="question-type-section">
              <h4>{{ getQuestionTypeLabel(type) }} (共 {{ questions.length }} 题)</h4>
              <div v-for="(question, index) in questions" :key="question.id" class="question-item">
                <div class="question-stem">
                  {{ index + 1 }}. {{ question.content }}
                </div>
                <div class="question-options" v-if="question.type === 'single' || question.type === 'multiple'">
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
                <div class="question-actions">
                  <button class="remove-question-btn" @click="removeQuestion(question)">移除</button>
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
    
    <!-- 随机组卷设置模态框 -->
    <div v-if="showRandomSettingsModal" class="modal-overlay" @click="closeRandomSettingsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>出题范围</h3>
          <button class="close-btn" @click="closeRandomSettingsModal">×</button>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>试卷类型</label>
            <select v-model="randomSettings.paperType" class="form-select">
              <option value="type1">类型1</option>
              <option value="type2">类型2</option>
              <option value="type3">类型3</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>题目数量</label>
            <input 
              type="number" 
              v-model="randomSettings.questionCount" 
              class="form-input"
              min="1"
              max="100"
            >
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeRandomSettingsModal">返回</button>
          <button class="btn primary" @click="saveRandomSettings">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
const removeQuestion = (question) => {
  const index = selectedQuestions.value.findIndex(q => q.id === question.id)
  if (index > -1) {
    selectedQuestions.value.splice(index, 1)
    // 更新统计数据
    totalQuestions.value = selectedQuestions.value.length
    totalScore.value = selectedQuestions.value.reduce((sum, q) => sum + (q.score || 0), 0)
  }
}

// 退出创建
const exitCreate = () => {
  router.push('/home/question/paper')
}

// 显示随机组卷设置模态框
const showRandomSettingsModal = ref(false)

// 随机组卷设置
const randomSettings = ref({
  paperType: 'type1',
  questionCount: 10
})

// 监听组卷方式变化
watch(() => paperInfo.value.method, (newMethod) => {
  if (newMethod === '随机组卷') {
    showRandomSettingsModal.value = true
  }
})

// 关闭随机组卷设置模态框
const closeRandomSettingsModal = () => {
  showRandomSettingsModal.value = false
  // 如果关闭时还是随机组卷，重置为选题组卷
  if (paperInfo.value.method === '随机组卷') {
    paperInfo.value.method = '选题组卷'
  }
}

// 保存随机组卷设置
const saveRandomSettings = () => {
  console.log('随机组卷设置:', randomSettings.value)
  showRandomSettingsModal.value = false
  // 这里可以添加实际的随机组卷逻辑
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

/* 题型选择按钮 */
.question-type-btn {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f8f9fa;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  position: relative;
  overflow: hidden;
}

.question-type-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(0, 102, 204, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.question-type-btn:active::before {
  width: 100px;
  height: 100px;
}

.question-type-btn:hover {
  background-color: #f0f8ff;
  border-color: #0066cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
}

.question-type-btn.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.question-type-btn.active:hover {
  background-color: #0052a3;
  transform: scale(1.05) translateY(-2px);
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
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.question-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 204, 0.05), transparent);
  transition: left 0.6s;
}

.question-item:hover::before {
  left: 100%;
}

.question-item:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #0066cc;
  background-color: #fff;
}

.question-item:active {
  transform: translateY(-2px) scale(1.005);
  transition: all 0.1s;
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
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.option-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 204, 0.05), transparent);
  transition: left 0.6s;
}

.option-item:hover::before {
  left: 100%;
}

.option-item:hover {
  background-color: #f0f8ff;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
}

.option-item input[type="radio"] {
  margin: 0;
  transition: all 0.2s ease;
}

.option-item:hover input[type="radio"] {
  transform: scale(1.2);
}

.option-item label {
  cursor: pointer;
  color: #555;
  transition: all 0.2s ease;
  font-weight: 500;
}

.option-item:hover label {
  color: #0066cc;
  transform: translateX(2px);
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
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 90%;
  max-width: 500px;
  animation: slideInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
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

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.modal-content.large {
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
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

/* 筛选区域 */
.filter-section {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: slideInLeft 0.5s ease-out;
}

.filter-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 204, 0.03), transparent);
  transition: left 0.8s;
}

.filter-section:hover::before {
  left: 100%;
}

.filter-section:hover {
  border-color: #e1e8ff;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.08);
  transform: translateY(-2px);
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
  transition: all 0.2s ease;
}

.filter-group:hover {
  transform: scale(1.02);
}

.filter-group label {
  font-weight: bold;
  color: #333;
  transition: color 0.2s ease;
}

.filter-group:hover label {
  color: #0066cc;
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
  animation: fadeInUp 0.6s ease-out;
}

.data-table th,
.data-table td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
  transition: all 0.2s ease;
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

.data-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
  position: sticky;
  top: 0;
  z-index: 10;
}

/* 分页控件 */
.pagination {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
  animation: fadeInUp 0.8s ease-out;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #ddd;
  background-color: white;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.page-btn::before {
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

.page-btn:hover::before {
  width: 30px;
  height: 30px;
}

.page-btn:hover {
  border-color: #0066cc;
  background-color: #0066cc;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 102, 204, 0.3);
}

.page-btn:active {
  transform: translateY(0) scale(0.95);
}

.page-btn.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.4);
}

.page-btn.active:hover {
  background-color: #0052a3;
  transform: scale(1.1) translateY(-2px);
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

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* 移除按钮样式 */
.question-actions {
  margin-top: 8px;
  text-align: right;
}

.remove-question-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.3s;
}

.remove-question-btn:hover {
  background: #ff3838;
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