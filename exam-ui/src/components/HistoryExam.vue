<template>
  <div class="history-exam">
    <h1>历史考试</h1>
    <div class="search-filter">
      <div class="form-group">
        <label>考试名称</label>
        <input 
          type="text" 
          v-model="searchParams.name" 
          class="form-input"
          placeholder="请输入考试名称"
        >
      </div>
      <div class="form-group">
        <label>考试时间</label>
        <div class="date-range">
          <input type="date" v-model="searchParams.startDate" class="form-input">
          <span>至</span>
          <input type="date" v-model="searchParams.endDate" class="form-input">
        </div>
      </div>
      <div class="search-buttons">
        <button class="btn primary" @click="searchExams">搜索</button>
        <button class="btn secondary" @click="clearSearch">清除条件</button>
      </div>
    </div>
    
    <div class="exam-table">
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>考试名称</th>
              <th>试卷</th>
              <th>考试时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="exam in historyExams" :key="exam.id">
              <td>{{ exam.name }}</td>
              <td>{{ exam.paper }}</td>
              <td>{{ exam.time }}</td>
              <td>
                <span class="exam-status completed">{{ exam.status }}</span>
              </td>
              <td>
                <button class="btn-icon" @click="viewResults(exam)">
                  <span title="查看成绩">📊</span>
                </button>
                <button class="btn-icon" @click="reviewPaper(exam)">
                  <span title="试卷回顾">📖</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 搜索参数
const searchParams = reactive({
  name: '',
  startDate: '',
  endDate: ''
})

// 历史考试数据（示例）
const historyExams = ref([
  {
    id: 1,
    name: 'Vue.js中级考试',
    paper: 'Vue.js基础知识试卷',
    time: '2023-06-15 14:00 - 16:00',
    status: '已完成'
  },
  {
    id: 2,
    name: 'React基础测试',
    paper: 'React核心概念试卷',
    time: '2023-06-10 09:00 - 11:00',
    status: '已完成'
  },
  {
    id: 3,
    name: 'JavaScript高级编程',
    paper: 'JavaScript进阶试卷',
    time: '2023-06-05 10:00 - 12:00',
    status: '已完成'
  }
])

// 搜索考试
const searchExams = () => {
  console.log('搜索参数:', searchParams)
  // 实际应用中这里会调用API获取数据
}

// 清除搜索条件
const clearSearch = () => {
  searchParams.name = ''
  searchParams.startDate = ''
  searchParams.endDate = ''
}

// 查看成绩
const viewResults = (exam) => {
  console.log('查看成绩:', exam.name)
  // 实际应用中这里会跳转到成绩页面
}

// 试卷回顾
const reviewPaper = (exam) => {
  console.log('试卷回顾:', exam.name)
  // 实际应用中这里会跳转到试卷回顾页面
}
</script>

<style scoped>
.history-exam {
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-height: calc(100vh - 40px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.history-exam h1 {
  color: #1a1a1a;
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  padding-bottom: 16px;
}

.history-exam h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #0066cc 0%, #00a8ff 100%);
  border-radius: 2px;
}

.search-filter {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-end;
  border: 1px solid rgba(0, 102, 204, 0.1);
  animation: fadeInUp 0.6s ease-out;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 200px;
  flex: 1;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  letter-spacing: 0.3px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.form-group label::before {
  content: '';
  width: 4px;
  height: 4px;
  background-color: #0066cc;
  border-radius: 50%;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #ffffff;
}

.form-input:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  background-color: #f8faff;
}

.form-input:hover {
  border-color: #0066cc;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.date-range span {
  color: #6c757d;
  font-weight: 500;
  font-size: 14px;
  padding: 0 4px;
}

.search-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  font-family: inherit;
  letter-spacing: 0.3px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
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

.btn.primary {
  background: linear-gradient(135deg, #0066cc 0%, #0052a3 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.btn.primary:hover {
  background: linear-gradient(135deg, #0052a3 0%, #003d7a 100%);
  box-shadow: 0 6px 20px rgba(0, 102, 204, 0.4);
  transform: translateY(-2px);
}

.btn.primary:active {
  transform: translateY(0) scale(0.98);
}

.btn.secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn.secondary:hover {
  background: linear-gradient(135deg, #5a6268 0%, #495057 100%);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
  transform: translateY(-2px);
}

.btn.secondary:active {
  transform: translateY(0) scale(0.98);
}

.exam-table {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  border: 1px solid rgba(0, 102, 204, 0.1);
  animation: fadeInUp 0.8s ease-out;
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #ffffff;
  table-layout: fixed;
}

.data-table th,
.data-table td {
  padding: 16px 20px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  vertical-align: middle;
}

.data-table th:nth-child(1),
.data-table td:nth-child(1) {
  width: 25%;
}

.data-table th:nth-child(2),
.data-table td:nth-child(2) {
  width: 30%;
}

.data-table th:nth-child(3),
.data-table td:nth-child(3) {
  width: 25%;
}

.data-table th:nth-child(4),
.data-table td:nth-child(4) {
  width: 10%;
}

.data-table th:nth-child(5),
.data-table td:nth-child(5) {
  width: 10%;
  text-align: center;
}

.data-table th {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  border-bottom: 2px solid #0066cc;
  position: sticky;
  top: 0;
  z-index: 10;
}

.data-table th:first-child {
  border-top-left-radius: 12px;
}

.data-table th:last-child {
  border-top-right-radius: 12px;
}

.data-table tbody tr {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.data-table tbody tr::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #0066cc 0%, #00a8ff 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.data-table tbody tr:hover {
  background: linear-gradient(135deg, #f8faff 0%, #f0f8ff 100%);
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1);
}

.data-table tbody tr:hover::before {
  opacity: 1;
  width: 6px;
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table td {
  color: #495057;
  font-size: 14px;
  line-height: 1.5;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 8px;
  margin: 0 2px;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
}

.btn-icon:hover {
  background: linear-gradient(135deg, #f8faff 0%, #e9ecef 100%);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.2);
}

.btn-icon:active {
  transform: scale(0.95);
}

.exam-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
  overflow: hidden;
}

.exam-status.completed {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.exam-status.completed::before {
  content: '✓';
  font-weight: bold;
  font-size: 10px;
}

/* 动画效果 */
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-filter {
    gap: 20px;
    padding: 20px;
  }
  
  .form-group {
    min-width: 180px;
  }
}

@media (max-width: 768px) {
  .history-exam {
    padding: 20px;
    border-radius: 8px;
  }
  
  .history-exam h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 20px;
  }
  
  .form-group {
    min-width: auto;
    width: 100%;
  }
  
  .date-range {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .date-range span {
    text-align: center;
  }
  
  .search-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .exam-table {
    padding: 20px;
    border-radius: 12px;
  }
  
  .data-table th,
  .data-table td {
    padding: 12px 16px;
    font-size: 13px;
  }
  
  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }
  
  .btn-icon {
    font-size: 16px;
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .history-exam {
    padding: 16px;
  }
  
  .history-exam h1 {
    font-size: 20px;
    margin-bottom: 16px;
  }
  
  .search-filter {
    padding: 16px;
    gap: 12px;
  }
  
  .form-input {
    padding: 10px 12px;
  }
  
  .exam-table {
    padding: 16px;
  }
  
  .table-container {
    border-radius: 8px;
  }
  
  .data-table th,
  .data-table td {
    padding: 10px 12px;
    font-size: 12px;
  }
  
  .data-table th {
    font-size: 11px;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 12px;
    width: 100%;
    justify-content: center;
  }
  
  .search-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-icon {
    font-size: 14px;
    padding: 4px;
  }
}
</style>