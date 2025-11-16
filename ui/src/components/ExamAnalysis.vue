<template>
  <div class="exam-analysis">
    <h1>考试分析</h1>
    
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn primary" @click="openExamSearch">选择考试</button>
      </div>
      <div class="toolbar-right">
        <button 
          class="btn secondary" 
          :class="{ active: analysisTab === 'score' }"
          @click="switchAnalysisTab('score')"
        >
          成绩统计
        </button>
        <button 
          class="btn secondary" 
          :class="{ active: analysisTab === 'question' }"
          @click="switchAnalysisTab('question')"
        >
          试题分析
        </button>
      </div>
    </div>
    
    <!-- 默认显示所有考试列表 -->
    <div v-if="!selectedExam" class="all-exams">
      <h2>所有考试</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>考试名称</th>
              <th>考试分类</th>
              <th>总分</th>
              <th>结束时间</th>
              <th>创建人</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exam in examList" :key="exam.id">
              <td>{{ exam.name }}</td>
              <td>{{ exam.category }}</td>
              <td>{{ exam.totalScore }}</td>
              <td>{{ exam.endTime }}</td>
              <td>{{ exam.creator }}</td>
              <td>{{ exam.createTime }}</td>
              <td>
                <button class="btn small primary" @click="selectExam(exam)">查看</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 选中的考试信息 -->
    <div v-else>
      <div class="selected-exam-info">
        <div class="info-row">
          <span class="label">考试名称：</span>
          <span>{{ selectedExam.name }}</span>
        </div>
        <div class="info-row">
          <span class="label">考试分类：</span>
          <span>{{ selectedExam.category }}</span>
        </div>
        <div class="info-row">
          <span class="label">创建人：</span>
          <span>{{ selectedExam.creator }}</span>
        </div>
      </div>
      
      <!-- 成绩统计内容 -->
      <div v-if="analysisTab === 'score'">
        <div class="analysis-content">
          <h2>成绩统计</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>参考人数</h3>
              <p class="stat-number">120</p>
            </div>
            <div class="stat-card">
              <h3>平均分</h3>
              <p class="stat-number">78.5</p>
            </div>
            <div class="stat-card">
              <h3>最高分</h3>
              <p class="stat-number">95</p>
            </div>
            <div class="stat-card">
              <h3>最低分</h3>
              <p class="stat-number">42</p>
            </div>
          </div>
          
          <div class="chart-container">
            <h3>成绩分布图</h3>
            <div class="chart-placeholder">
              <!-- 这里可以放置图表组件 -->
              <p>成绩分布图表占位符</p>
            </div>
          </div>
          
          <div class="score-table">
            <h3>成绩详情</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>学号</th>
                  <th>姓名</th>
                  <th>班级</th>
                  <th>得分</th>
                  <th>排名</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2023001</td>
                  <td>张三</td>
                  <td>计算机2023级1班</td>
                  <td>85</td>
                  <td>15</td>
                </tr>
                <tr>
                  <td>2023002</td>
                  <td>李四</td>
                  <td>计算机2023级1班</td>
                  <td>92</td>
                  <td>3</td>
                </tr>
                <tr>
                  <td>2023003</td>
                  <td>王五</td>
                  <td>计算机2023级2班</td>
                  <td>78</td>
                  <td>32</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 返回按钮 -->
          <div class="form-actions">
            <button class="btn secondary" @click="backToExamList">返回考试列表</button>
          </div>
        </div>
      </div>
      
      <!-- 试题分析内容 -->
      <div v-else-if="analysisTab === 'question'">
        <div class="analysis-content">
          <h2>试题分析</h2>
          <div class="question-stats">
            <div class="stat-card">
              <h3>总题数</h3>
              <p class="stat-number">30</p>
            </div>
            <div class="stat-card">
              <h3>平均正确率</h3>
              <p class="stat-number">75.6%</p>
            </div>
          </div>
          
          <div class="question-analysis-table">
            <h3>各题分析</h3>
            <table class="data-table">
              <thead>
                <tr>
                  <th>题号</th>
                  <th>题型</th>
                  <th>满分</th>
                  <th>平均得分</th>
                  <th>正确率</th>
                  <th>难度系数</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>单选题</td>
                  <td>2</td>
                  <td>1.8</td>
                  <td>90%</td>
                  <td>简单</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>单选题</td>
                  <td>2</td>
                  <td>1.5</td>
                  <td>75%</td>
                  <td>中等</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>多选题</td>
                  <td>3</td>
                  <td>2.1</td>
                  <td>70%</td>
                  <td>中等</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 返回按钮 -->
          <div class="form-actions">
            <button class="btn secondary" @click="backToExamList">返回考试列表</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 考试搜索模态框 -->
    <div v-if="showExamSearchModal" class="modal-overlay" @click="closeExamSearch">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>选择考试</h3>
          <button class="close-btn" @click="closeExamSearch">×</button>
        </div>
        
        <div class="modal-body">
          <!-- 搜索条件 -->
          <div class="search-filters">
            <div class="filter-group">
              <label>考试名称</label>
              <input 
                type="text" 
                v-model="searchParams.examName" 
                placeholder="请输入考试名称"
                class="form-input"
              >
            </div>
            
            <div class="filter-group">
              <label>考试分类</label>
              <select v-model="searchParams.category" class="form-select">
                <option value="">全部分类</option>
                <option value="期末考试">期末考试</option>
                <option value="期中考试">期中考试</option>
                <option value="模拟考试">模拟考试</option>
              </select>
            </div>
            
            <div class="filter-group">
              <label>考试时间</label>
              <div class="time-range">
                <input 
                  type="date" 
                  v-model="searchParams.startTime"
                  class="form-input"
                >
                <span>至</span>
                <input 
                  type="date" 
                  v-model="searchParams.endTime"
                  class="form-input"
                >
              </div>
            </div>
            
            <div class="filter-actions">
              <button class="btn primary" @click="searchExams">搜索</button>
            </div>
          </div>
          
          <!-- 搜索结果 -->
          <div class="search-results">
            <table class="data-table">
              <thead>
                <tr>
                  <th width="5%"></th>
                  <th>考试名称</th>
                  <th>考试分类</th>
                  <th>总分</th>
                  <th>结束时间</th>
                  <th>创建人</th>
                  <th>创建时间</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(exam, index) in examList" 
                  :key="exam.id"
                  :class="{ selected: selectedExamInModal && selectedExamInModal.id === exam.id }"
                  @click="selectExamInModal(exam)"
                >
                  <td>
                    <input 
                      type="radio" 
                      :checked="selectedExamInModal && selectedExamInModal.id === exam.id"
                      @click.stop="selectExamInModal(exam)"
                    >
                  </td>
                  <td>{{ exam.name }}</td>
                  <td>{{ exam.category }}</td>
                  <td>{{ exam.totalScore }}</td>
                  <td>{{ exam.endTime }}</td>
                  <td>{{ exam.creator }}</td>
                  <td>{{ exam.createTime }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="modal-footer">
          <button class="btn secondary" @click="closeExamSearch">返回</button>
          <button 
            class="btn primary" 
            @click="confirmExamSelection" 
            :disabled="!selectedExamInModal"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 控制模态框显示
const showExamSearchModal = ref(false)

// 分析选项卡（成绩统计/试题分析）
const analysisTab = ref('score')

// 搜索参数
const searchParams = ref({
  examName: '',
  category: '',
  startTime: '',
  endTime: ''
})

// 选中的考试（模态框中）
const selectedExamInModal = ref(null)

// 选中的考试（主页面中）
const selectedExam = ref(null)

// 考试列表数据
const examList = ref([
  {
    id: 1,
    name: 'Vue.js中级考试',
    category: '期末考试',
    totalScore: 100,
    startTime: '2023-06-15 14:00',
    endTime: '2023-06-15 16:00',
    creator: '张老师',
    createTime: '2023-06-01'
  },
  {
    id: 2,
    name: 'React基础测试',
    category: '期中考试',
    totalScore: 120,
    startTime: '2023-06-14 10:00',
    endTime: '2023-06-14 11:30',
    creator: '李老师',
    createTime: '2023-05-28'
  },
  {
    id: 3,
    name: 'Java编程实战',
    category: '模拟考试',
    totalScore: 100,
    startTime: '2023-06-16 09:30',
    endTime: '2023-06-16 11:30',
    creator: '王老师',
    createTime: '2023-06-05'
  },
  {
    id: 4,
    name: '数据库原理考试',
    category: '期末考试',
    totalScore: 80,
    startTime: '2023-06-10 14:00',
    endTime: '2023-06-10 16:00',
    creator: '赵老师',
    createTime: '2023-05-25'
  }
])

// 打开考试搜索模态框
const openExamSearch = () => {
  showExamSearchModal.value = true
  selectedExamInModal.value = null
}

// 关闭考试搜索模态框
const closeExamSearch = () => {
  showExamSearchModal.value = false
}

// 在模态框中选择考试
const selectExamInModal = (exam) => {
  selectedExamInModal.value = exam
}

// 确认选择考试
const confirmExamSelection = () => {
  selectedExam.value = selectedExamInModal.value
  closeExamSearch()
}

// 直接选择考试（点击查看按钮）
const selectExam = (exam) => {
  selectedExam.value = exam
}

// 返回考试列表
const backToExamList = () => {
  selectedExam.value = null
}

// 搜索考试
const searchExams = () => {
  // 在实际应用中，这里会调用API进行搜索
  console.log('搜索参数:', searchParams.value)
  // 模拟搜索结果
  alert('搜索完成，请查看结果')
}

// 切换分析选项卡
const switchAnalysisTab = (tab) => {
  analysisTab.value = tab
}
</script>

<style scoped>
.exam-analysis {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100% - 20px);
}

.exam-analysis h1 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.exam-analysis h2 {
  color: #333;
  margin: 20px 0;
}

/* 顶部操作栏 */
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
  gap: 10px;
}

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

.btn.secondary.active {
  background-color: #0066cc;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn.secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

/* 所有考试列表 */
.all-exams {
  margin-top: 20px;
}

/* 选中的考试信息 */
.selected-exam-info {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.info-row {
  margin-bottom: 8px;
  display: flex;
}

.info-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: bold;
  width: 100px;
  color: #333;
}

/* 分析内容 */
.analysis-content {
  margin-top: 20px;
}

.analysis-content h2 {
  margin-bottom: 20px;
  color: #333;
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.question-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #0066cc;
  margin: 0;
}

/* 图表容器 */
.chart-container {
  margin-bottom: 30px;
}

.chart-container h3 {
  margin-bottom: 15px;
  color: #333;
}

.chart-placeholder {
  height: 300px;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

/* 表格 */
.score-table,
.question-analysis-table {
  margin-bottom: 30px;
}

.score-table h3,
.question-analysis-table h3 {
  margin-bottom: 15px;
  color: #333;
}

/* 表格容器 */
.table-container {
  overflow-x: auto;
}

/* 数据表格 */
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

.data-table tbody tr.selected {
  background-color: #e6f7ff;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
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
  max-width: 800px;
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

/* 搜索过滤器 */
.search-filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.filter-group label {
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

.time-range {
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-range span {
  white-space: nowrap;
}

.filter-actions {
  display: flex;
  align-items: flex-end;
}

/* 搜索结果 */
.search-results {
  margin-top: 20px;
}
</style>