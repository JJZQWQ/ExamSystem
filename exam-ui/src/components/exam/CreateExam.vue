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
    <transition name="step-content" mode="out-in">
      <div :key="currentStep" class="step-content">
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
    </transition>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .create-exam-container {
    max-width: 95%;
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .create-exam-container {
    padding: 10px;
    margin: 0;
    max-width: 100%;
  }
  
  .step-indicator {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .step-item {
    flex-direction: row;
    justify-content: flex-start;
    gap: 15px;
    padding: 15px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
  }
  
  .step-content {
    padding: 20px 15px;
    margin: 0 -5px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .selector-row {
    flex-direction: column;
    gap: 15px;
  }
  
  .form-select {
    width: 100%;
  }
  
  .class-list {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .search-filters {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-group {
    width: 100%;
  }
  
  .time-range {
    flex-direction: column;
    gap: 15px;
  }
  
  .time-range input {
    width: 100%;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 15px;
  }
  
  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .create-exam-container {
    padding: 5px;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .step-content {
    padding: 15px 10px;
  }
  
  .form-input,
  .form-select,
  .form-textarea {
    padding: 10px 12px;
    font-size: 14px;
  }
  
  .btn {
    padding: 10px 16px;
    font-size: 13px;
  }
}

/* 返回按钮 */
.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
  color: #0066cc;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: rgba(0, 102, 204, 0.05);
  border: 1px solid transparent;
  font-weight: 500;
}

.back-button:hover {
  background-color: rgba(0, 102, 204, 0.1);
  border-color: rgba(0, 102, 204, 0.2);
  transform: translateX(-2px);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15);
}

.back-button:active {
  transform: translateX(0) scale(0.98);
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
  margin: 40px 0;
  position: relative;
  padding: 0 20px;
}

.step-indicator::before {
  content: '';
  position: absolute;
  top: 25px;
  left: 50px;
  right: 50px;
  height: 3px;
  background: linear-gradient(90deg, #0066cc 0%, #e0e0e0 100%);
  z-index: 1;
  border-radius: 2px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f5f5f5;
  border: 3px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #999;
  margin-bottom: 12px;
  font-size: 18px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.step-number::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 102, 204, 0.3) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-name {
  font-size: 14px;
  color: #999;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  max-width: 100px;
}

.step-item.active .step-number {
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  border-color: #0066cc;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
}

.step-item.active .step-number::before {
  width: 60px;
  height: 60px;
}

.step-item.completed .step-number {
  background: linear-gradient(135deg, #28a745 0%, #218838 100%);
  border-color: #28a745;
  color: white;
  transform: scale(1.05);
  box-shadow: 0 3px 12px rgba(40, 167, 69, 0.3);
}

.step-item.completed .step-number::before {
  width: 50px;
  height: 50px;
}

.step-item.active .step-name,
.step-item.completed .step-name {
  color: #333;
  font-weight: 600;
  transform: translateY(-2px);
}

.step-item:hover:not(.active):not(.completed) .step-number {
  transform: scale(1.05);
  border-color: #0066cc;
  color: #0066cc;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.2);
}

/* 步骤内容 */
.step-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  min-height: 400px;
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-content-enter-active,
.step-content-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-content-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.step-content-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.step-content-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

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
  padding: 12px 16px;
  border: 2px solid #e1e8ff;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fafbfc;
  position: relative;
}

.form-input:hover,
.form-select:hover,
.form-textarea:hover {
  border-color: #0066cc;
  background-color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #0066cc;
  background-color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* 班级配置 */
.class-config {
  border: 2px solid #e1e8ff;
  border-radius: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #fafbfc 0%, #f8f9fa 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.class-config:hover {
  border-color: #0066cc;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.1);
}

.selector-row {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.class-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.class-item {
  padding: 14px 16px;
  border: 2px solid #e1e8ff;
  border-radius: 8px;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #fff;
  position: relative;
  overflow: hidden;
  font-weight: 500;
}

.class-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 204, 0.1), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.class-item:hover {
  background-color: #f0f7ff;
  border-color: #0066cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.15);
}

.class-item:hover::before {
  left: 100%;
}

.class-item.selected {
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  color: white;
  border-color: #0066cc;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.3);
}

.class-item.selected::after {
  content: '✓';
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 16px;
  font-weight: bold;
  animation: checkmark 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes checkmark {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
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
  padding: 20px;
  border: 2px solid #e1e8ff;
  border-radius: 12px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: linear-gradient(135deg, #fff 0%, #fafbfc 100%);
  position: relative;
  overflow: hidden;
}

.paper-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 204, 0.05), transparent);
  transition: left 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.paper-item:hover {
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
  border-color: #0066cc;
  transform: translateY(-3px) translateX(5px);
  box-shadow: 0 8px 25px rgba(0, 102, 204, 0.15);
}

.paper-item:hover::before {
  left: 100%;
}

.paper-item.selected {
  background: linear-gradient(135deg, #e6f7ff 0%, #cce7ff 100%);
  border-color: #0066cc;
  transform: translateY(-2px) translateX(3px);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.2);
}

.paper-item.selected::after {
  content: '✓ 已选择';
  position: absolute;
  top: 15px;
  right: 15px;
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInRight {
  0% {
    transform: translateX(20px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.paper-info h3 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.paper-item:hover .paper-info h3 {
  color: #0066cc;
}

.paper-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.paper-item:hover .paper-info p {
  color: #0066cc;
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
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: none;
  letter-spacing: 0.5px;
}

.btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:active::before {
  width: 300px;
  height: 300px;
}

.btn:disabled {
  background-color: #ccc !important;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn:disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

.btn.primary {
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.2);
}

.btn.primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #0052a3 0%, #004090 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.3);
}

.btn.primary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

.btn.secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(108, 117, 125, 0.2);
}

.btn.secondary:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.3);
}

.btn.secondary:active {
  transform: translateY(0) scale(0.98);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 提示信息样式 */
.info-tooltip {
  position: relative;
  display: inline-block;
  margin-left: 5px;
  cursor: help;
}

.info-tooltip::before {
  content: '?';
  display: inline-block;
  width: 16px;
  height: 16px;
  background: #0066cc;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 16px;
  font-size: 12px;
  font-weight: bold;
}

.info-tooltip:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  max-width: 200px;
  white-space: normal;
}

/* 成功/错误提示 */
.message {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: fadeInUp 0.3s ease-out;
}

.message.success {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  color: #155724;
  border-left: 4px solid #28a745;
}

.message.error {
  background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.message.warning {
  background: linear-gradient(135deg, #fff3cd 0%, #ffeeba 100%);
  color: #856404;
  border-left: 4px solid #ffc107;
}

/* 进度条样式 */
.progress-bar {
  width: 100%;
  height: 6px;
  background: #e9ecef;
  border-radius: 3px;
  overflow: hidden;
  margin: 20px 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0066cc 0%, #0052a3 100%);
  border-radius: 3px;
  transition: width 0.3s ease-out;
  position: relative;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}
</style>