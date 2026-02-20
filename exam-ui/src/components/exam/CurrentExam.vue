<template>
  <div class="current-exam">
    <h1>当前考试</h1>
    <div class="exam-list">
      <div
        v-for="exam in currentExams"
        :key="exam.id"
        class="exam-card"
        @click="enterExam(exam)"
      >
        <div class="exam-header">
          <h3>{{ exam.name }}</h3>
          <span class="exam-status running">进行中</span>
        </div>
        <div class="exam-details">
          <p><strong>试卷：</strong>{{ exam.paper }}</p>
          <p><strong>时间：</strong>{{ exam.time }}</p>
          <p><strong>剩余时间：</strong>{{ exam.remainingTime }}</p>
        </div>
        <div class="exam-actions">
          <button class="btn primary">进入考试</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前考试数据（示例）
const currentExams = ref([
  {
    id: 1,
    name: 'Vue.js中级考试',
    paper: 'Vue.js基础知识试卷',
    time: '2023-06-15 14:00 - 16:00',
    remainingTime: '01:45:30'
  },
  {
    id: 2,
    name: 'React基础测试',
    paper: 'React核心概念试卷',
    time: '2023-06-16 09:00 - 11:00',
    remainingTime: '04:20:15'
  }
])

// 进入考试
const enterExam = (exam) => {
  // 实际应用中这里会跳转到考试页面
  console.log('进入考试:', exam.name)
}
</script>

<style scoped>
.current-exam {
  padding: 24px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  min-height: calc(100vh - 40px);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.current-exam h1 {
  color: #1a1a1a;
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  padding-bottom: 16px;
}

.current-exam h1::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(135deg, #0066cc 0%, #00a8ff 100%);
  border-radius: 2px;
}

.exam-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  animation: fadeInUp 0.6s ease-out;
}

.exam-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8faff 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.exam-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #0066cc, #00a8ff, #0066cc);
  background-size: 200% 100%;
  animation: shimmer 3s linear infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.exam-card:hover::before {
  opacity: 1;
}

.exam-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 102, 204, 0.15);
  border-color: #0066cc;
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
}

.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.exam-header h3 {
  margin: 0;
  color: #1a1a1a;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.3px;
  line-height: 1.3;
  flex: 1;
  margin-right: 12px;
}

.exam-status {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
}

.exam-status.running {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
}

.exam-status.running::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 8px;
  width: 6px;
  height: 6px;
  background-color: white;
  border-radius: 50%;
  transform: translateY(-50%);
  animation: pulse 2s infinite;
}

.exam-details {
  margin-bottom: 20px;
}

.exam-details p {
  margin: 12px 0;
  color: #6c757d;
  font-size: 14px;
  line-height: 1.6;
  display: flex;
  align-items: center;
  gap: 8px;
}

.exam-details strong {
  color: #2c3e50;
  font-weight: 600;
  min-width: 70px;
}

.exam-details p::before {
  content: '';
  width: 4px;
  height: 4px;
  background-color: #0066cc;
  border-radius: 50%;
  flex-shrink: 0;
}

.exam-actions {
  margin-top: 20px;
  text-align: right;
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
  letter-spacing: 1px;
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

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .exam-list {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .current-exam {
    padding: 20px;
    border-radius: 8px;
  }

  .current-exam h1 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .exam-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .exam-card {
    padding: 20px;
    border-radius: 12px;
  }

  .exam-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }

  .exam-header h3 {
    margin-right: 0;
    font-size: 18px;
  }

  .exam-status {
    align-self: flex-start;
  }

  .exam-details p {
    font-size: 13px;
    margin: 10px 0;
  }

  .btn {
    padding: 10px 20px;
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .current-exam {
    padding: 16px;
  }

  .current-exam h1 {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .exam-card {
    padding: 16px;
    border-radius: 8px;
  }

  .exam-header h3 {
    font-size: 16px;
  }

  .exam-details p {
    font-size: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .exam-details strong {
    min-width: auto;
  }

  .btn {
    padding: 8px 16px;
    font-size: 12px;
    width: 100%;
  }

  .exam-actions {
    text-align: center;
  }
}
</style>
