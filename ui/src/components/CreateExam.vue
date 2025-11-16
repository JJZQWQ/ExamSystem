<template>
  <div class="create-exam-container">
    <!-- 返回按钮 -->
    <div class="back-button" @click="backToList">
      ← 返回考试列表
    </div>
    
    <h1>创建考试</h1>
    
    <!-- 步骤指示器 -->
    <div class="step-indicator">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-item"
        :class="{ active: currentStep === index, completed: index < currentStep }"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-name">{{ step }}</div>
      </div>
    </div>
    
    <!-- 步骤内容 -->
    <div class="step-content">
      <!-- 第一步：试卷基本信息 -->
      <div v-if="currentStep === 0" class="step-form">
        <h2>试卷基本信息</h2>
        
        <div class="form-group">
          <label>考试名称</label>
          <input 
            type="text" 
            v-model="examInfo.name" 
            placeholder="请输入考试名称"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>配置考试班级</label>
          <div class="class-config">
            <div class="selector-row">
              <select v-model="selectedSchool" class="form-select">
                <option value="">请选择院校</option>
                <option v-for="school in schools" :key="school.id" :value="school.id">
                  {{ school.name }}
                </option>
              </select>
              
              <select 
                v-model="selectedMajor" 
                class="form-select" 
                :disabled="!selectedSchool"
              >
                <option value="">请选择专业</option>
                <option v-for="major in majors" :key="major.id" :value="major.id">
                  {{ major.name }}
                </option>
              </select>
            </div>
            
            <div class="class-list" v-if="selectedMajor">
              <div 
                v-for="classItem in classes" 
                :key="classItem.id"
                class="class-item"
                :class="{ selected: examInfo.classIds.includes(classItem.id) }"
                @click="toggleClassSelection(classItem.id)"
              >
                {{ classItem.name }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>配置阅卷人</label>
          <select v-model="examInfo.grader" class="form-select">
            <option value="">请选择阅卷人</option>
            <option v-for="grader in graders" :key="grader.id" :value="grader.id">
              {{ grader.name }}
            </option>
          </select>
        </div>
        
        <div class="form-actions">
          <button class="btn primary" @click="nextStep">下一步</button>
        </div>
      </div>
      
      <!-- 第二步：配置试卷 -->
      <div v-else-if="currentStep === 1" class="step-form">
        <h2>配置试卷</h2>
        
        <div class="search-filters">
          <div class="filter-group">
            <input 
              type="text" 
              v-model="searchParams.paperName" 
              placeholder="试卷名称"
              class="form-input"
            >
          </div>
          
          <div class="filter-group">
            <input 
              type="number" 
              v-model="searchParams.totalScore" 
              placeholder="总分"
              class="form-input"
            >
          </div>
          
          <div class="filter-group">
            <input 
              type="text" 
              v-model="searchParams.creator" 
              placeholder="创建人"
              class="form-input"
            >
          </div>
          
          <button class="btn secondary" @click="searchPapers">搜索</button>
        </div>
        
        <div class="paper-list">
          <div 
            v-for="paper in papers" 
            :key="paper.id"
            class="paper-item"
            :class="{ selected: examInfo.paperId === paper.id }"
            @click="selectPaper(paper.id)"
          >
            <div class="paper-info">
              <h3>{{ paper.name }}</h3>
              <p>总分：{{ paper.totalScore }}分 | 创建人：{{ paper.creator }}</p>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <button class="btn secondary" @click="prevStep">上一步</button>
          <button 
            class="btn primary" 
            @click="nextStep" 
            :disabled="!examInfo.paperId"
          >
            下一步
          </button>
        </div>
      </div>
      
      <!-- 第三步：发布 -->
      <div v-else-if="currentStep === 2" class="step-form">
        <h2>发布设置</h2>
        
        <div class="form-group">
          <label>考试时间</label>
          <div class="time-range">
            <input 
              type="datetime-local" 
              v-model="examInfo.startTime"
              class="form-input"
            >
            <span>至</span>
            <input 
              type="datetime-local" 
              v-model="examInfo.endTime"
              class="form-input"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label>考试分类</label>
          <select v-model="examInfo.category" class="form-select">
            <option value="">请选择考试分类</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label>答卷时长（分钟）</label>
          <input 
            type="number" 
            v-model="examInfo.duration" 
            placeholder="请输入答卷时长"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>答题次数</label>
          <input 
            type="number" 
            v-model="examInfo.attempts" 
            placeholder="请输入答题次数"
            class="form-input"
          >
        </div>
        
        <div class="form-group">
          <label>考试说明</label>
          <textarea 
            v-model="examInfo.description" 
            placeholder="请输入考试说明"
            class="form-textarea"
            rows="4"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button class="btn secondary" @click="prevStep">上一步</button>
          <button class="btn primary" @click="publishExam">发布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 定义事件发射器
const emit = defineEmits(['back-to-list'])

// 步骤定义
const steps = ['试卷基本信息', '配置试卷', '发布']
const currentStep = ref(0)

// 试卷基本信息
const examInfo = ref({
  name: '',
  classIds: [],
  grader: '',
  paperId: null,
  startTime: '',
  endTime: '',
  category: '',
  duration: '',
  attempts: '',
  description: ''
})

// 院校数据
const schools = ref([
  { id: 1, name: '清华大学' },
  { id: 2, name: '北京大学' },
  { id: 3, name: '北京航空航天大学' }
])

// 专业数据
const majors = ref([
  { id: 1, name: '计算机科学与技术', schoolId: 1 },
  { id: 2, name: '软件工程', schoolId: 1 },
  { id: 3, name: '电子信息工程', schoolId: 1 },
  { id: 4, name: '计算机科学与技术', schoolId: 2 },
  { id: 5, name: '人工智能', schoolId: 2 }
])

// 班级数据
const classes = ref([
  { id: 1, name: '计算机2023级1班', majorId: 1 },
  { id: 2, name: '计算机2023级2班', majorId: 1 },
  { id: 3, name: '软件2023级1班', majorId: 2 },
  { id: 4, name: '电子2023级1班', majorId: 3 }
])

// 阅卷人数据
const graders = ref([
  { id: 1, name: '张老师' },
  { id: 2, name: '李老师' },
  { id: 3, name: '王老师' }
])

// 试卷数据
const papers = ref([
  { id: 1, name: 'Vue.js基础试卷', totalScore: 100, creator: '张老师' },
  { id: 2, name: 'React高级试卷', totalScore: 120, creator: '李老师' },
  { id: 3, name: 'Java编程试卷', totalScore: 100, creator: '王老师' },
  { id: 4, name: '数据库原理试卷', totalScore: 80, creator: '赵老师' }
])

// 考试分类数据
const categories = ref([
  { id: 1, name: '期末考试' },
  { id: 2, name: '期中考试' },
  { id: 3, name: '模拟考试' },
  { id: 4, name: '补考' }
])

// 搜索参数
const searchParams = ref({
  paperName: '',
  totalScore: '',
  creator: ''
})

// 选中的院校和专业
const selectedSchool = ref('')
const selectedMajor = ref('')

// 计算属性：根据选中的专业过滤班级
const filteredClasses = computed(() => {
  if (!selectedMajor.value) return []
  return classes.value.filter(c => c.majorId === parseInt(selectedMajor.value))
})

// 切换班级选择
const toggleClassSelection = (classId) => {
  const index = examInfo.value.classIds.indexOf(classId)
  if (index > -1) {
    examInfo.value.classIds.splice(index, 1)
  } else {
    examInfo.value.classIds.push(classId)
  }
}

// 选择试卷
const selectPaper = (paperId) => {
  examInfo.value.paperId = paperId
}

// 搜索试卷
const searchPapers = () => {
  // 在实际应用中，这里会调用API进行搜索
  console.log('搜索参数:', searchParams.value)
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 下一步
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

// 发布考试
const publishExam = () => {
  // 在实际应用中，这里会调用API发布考试
  console.log('发布考试信息:', examInfo.value)
  alert('考试发布成功！')
  // 重置表单并返回列表
  resetForm()
  backToList()
}

// 返回考试列表
const backToList = () => {
  emit('back-to-list')
}

// 重置表单
const resetForm = () => {
  currentStep.value = 0
  examInfo.value = {
    name: '',
    classIds: [],
    grader: '',
    paperId: null,
    startTime: '',
    endTime: '',
    category: '',
    duration: '',
    attempts: '',
    description: ''
  }
  selectedSchool.value = ''
  selectedMajor.value = ''
}
</script>

<style scoped>
.create-exam-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100% - 20px);
  position: relative;
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #0066cc;
  cursor: pointer;
  font-size: 14px;
}

.back-button:hover {
  text-decoration: underline;
}

.create-exam-container h1 {
  margin-top: 0;
  color: #333;
  text-align: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  justify-content: space-between;
  margin: 30px 0;
  position: relative;
}

.step-indicator::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 1;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #666;
  margin-bottom: 10px;
}

.step-name {
  font-size: 14px;
  color: #666;
}

.step-item.active .step-number {
  background-color: #0066cc;
  color: white;
}

.step-item.completed .step-number {
  background-color: #28a745;
  color: white;
}

.step-item.active .step-name,
.step-item.completed .step-name {
  color: #333;
  font-weight: bold;
}

/* 步骤内容 */
.step-form {
  padding: 20px 0;
}

.step-form h2 {
  color: #333;
  margin-bottom: 20px;
}

/* 表单组 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #333;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0066cc;
}

.form-textarea {
  resize: vertical;
}

/* 班级配置 */
.class-config {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
}

.selector-row {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
}

.class-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.class-item {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s;
}

.class-item:hover {
  background-color: #f8f9fa;
}

.class-item.selected {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

/* 搜索过滤器 */
.search-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: end;
}

.search-filters .filter-group {
  flex: 1;
}

/* 试卷列表 */
.paper-list {
  margin-bottom: 20px;
}

.paper-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.paper-item:hover {
  background-color: #f8f9fa;
}

.paper-item.selected {
  background-color: #e6f7ff;
  border-color: #0066cc;
}

.paper-info h3 {
  margin: 0 0 5px 0;
  color: #333;
}

.paper-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 时间范围 */
.time-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-range span {
  white-space: nowrap;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.btn {
  padding: 10px 20px;
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

.btn.primary {
  background-color: #0066cc;
  color: white;
}

.btn.secondary {
  background-color: #6c757d;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn.secondary:hover {
  background-color: #5a6268;
}
</style>