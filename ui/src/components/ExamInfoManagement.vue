<template>
  <div class="exam-info-management">
   
    <!-- 顶部操作栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <button class="btn primary" @click="emitCreateExam">➕ 创建考试</button>
        <button class="btn secondary">⬇️ 导出考试</button>
        <button class="btn danger">🗑️ 删除考试</button>
      </div>
      <div class="toolbar-right">
        <div class="filter-group">
          <span class="filter-item">📚 考试分类：全部 ▼</span>
          <span class="filter-item">📊 状态：全部 ▼</span>
        </div>
      </div>
    </div>
    
    <!-- 主内容表格区 -->
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th width="5%"><input type="checkbox"></th>
            <th>考试名称</th>
            <th>试卷分类</th>
            <th>考试时间</th>
            <th>创建人</th>
            <th>创建时间</th>
            <th>状态</th>
            <th width="15%">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(exam, index) in examList" :key="exam.id" :class="{ 'even-row': index % 2 === 0 }">
            <td><input type="checkbox"></td>
            <td>{{ exam.name }}</td>
            <td>{{ exam.category }}</td>
            <td>{{ exam.startTime }}<br>{{ exam.endTime }}</td>
            <td>{{ exam.creator }}</td>
            <td>{{ exam.createTime }}</td>
            <td>
              <span :class="['status-tag', exam.statusClass]">{{ exam.status }}</span>
            </td>
            <td>
              <div class="action-icons">
                <span class="icon" title="配置考试">⚙️</span>
                <span class="icon" title="统计分析">📊</span>
                <span class="icon" title="成绩批改">📝</span>
                <span class="icon" title="试卷预览">👁️</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 分页组件 -->
      <div class="pagination">
        <div class="pagination-info">共 80 条</div>
        <div class="pagination-controls">
          <span>每页</span>
          <select class="page-size-select">
            <option>10</option>
            <option selected>20</option>
            <option>50</option>
            <option>100</option>
          </select>
          <span>条</span>
          <div class="page-nav">
            <button class="page-btn">‹</button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn">...</button>
            <button class="page-btn">23</button>
            <button class="page-btn">›</button>
          </div>
          <span>前往</span>
          <input type="number" class="page-input" min="1" max="23" value="1">
          <span>页</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 定义事件发射器
const emit = defineEmits(['create-exam'])

// 考试列表数据
const examList = ref([
  {
    id: 1,
    name: 'Vue.js中级考试',
    category: '前端开发',
    startTime: '2023-06-15 14:00',
    endTime: '2023-06-15 16:00',
    creator: '张老师',
    createTime: '2023-06-01',
    status: '正在考试',
    statusClass: 'running'
  },
  {
    id: 2,
    name: 'React基础测试',
    category: '前端开发',
    startTime: '2023-06-14 10:00',
    endTime: '2023-06-14 11:30',
    creator: '李老师',
    createTime: '2023-05-28',
    status: '已结束',
    statusClass: 'completed'
  },
  {
    id: 3,
    name: 'Java编程实战',
    category: '后端开发',
    startTime: '2023-06-16 09:30',
    endTime: '2023-06-16 11:30',
    creator: '王老师',
    createTime: '2023-06-05',
    status: '未开始',
    statusClass: 'pending'
  },
  {
    id: 4,
    name: '数据库原理考试',
    category: '数据库',
    startTime: '2023-06-10 14:00',
    endTime: '2023-06-10 16:00',
    creator: '赵老师',
    createTime: '2023-05-25',
    status: '已结束',
    statusClass: 'completed'
  },
  {
    id: 5,
    name: 'Python数据分析',
    category: '数据科学',
    startTime: '2023-06-18 10:00',
    endTime: '2023-06-18 12:00',
    creator: '陈老师',
    createTime: '2023-06-08',
    status: '未开始',
    statusClass: 'pending'
  }
])

// 发射创建考试事件
const emitCreateExam = () => {
  emit('create-exam')
}
</script>

<style scoped>
.exam-info-management {
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100% - 20px);
}

.exam-info-management h1 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
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

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.filter-group {
  display: flex;
  gap: 15px;
}

.filter-item {
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #f8f9fa;
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-item:hover {
  background-color: #e9ecef;
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

.even-row {
  background-color: #f8f9fa;
}

.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-tag.running {
  background-color: #d4edda;
  color: #155724;
}

.status-tag.completed {
  background-color: #cce5ff;
  color: #004085;
}

.status-tag.pending {
  background-color: #fff3cd;
  color: #856404;
}

.action-icons {
  display: flex;
  gap: 10px;
}

.icon {
  cursor: pointer;
  font-size: 16px;
}

.icon:hover {
  opacity: 0.8;
}

/* 分页组件 */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #dee2e6;
}

.pagination-info {
  font-size: 14px;
  color: #666;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.page-size-select {
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-nav {
  display: flex;
  gap: 5px;
  align-items: center;
}

.page-btn {
  padding: 5px 10px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn:hover {
  background-color: #f8f9fa;
}

.page-btn.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

.page-input {
  width: 50px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}
</style>