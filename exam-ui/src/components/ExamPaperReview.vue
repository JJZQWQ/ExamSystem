<template>
  <div class="exam-paper-review">
    <!-- 顶部信息栏 -->
    <div class="top-bar">
      <div class="platform-info">
        <h1>在线考试平台</h1>
        <h2>历史试卷 1</h2>
      </div>
      <div class="exam-data">
        <span class="score">考生得分：84 分</span>
        <span class="time">答题时间：55 分钟</span>
      </div>
      <div class="actions">
        <button class="btn secondary" @click="exitReview">退出</button>
        <span class="notification">🔔<span class="badge">4</span></span>
      </div>
    </div>

    <div class="main-content">
      <!-- 左侧答题卡导航区 -->
      <div class="left-sidebar">
        <div class="question-types">
          <div class="question-type">
            <h3>单选题（10 题，20 分）</h3>
            <div class="question-grid">
              <div 
                v-for="i in 10" 
                :key="i"
                class="question-item"
                :class="getQuestionStatus(i, 'single')"
                @click="jumpToQuestion(i, 'single')"
              >
                {{ i }}
              </div>
            </div>
          </div>
          
          <div class="question-type">
            <h3>多选题（10 题，20 分）</h3>
            <div class="question-grid">
              <div 
                v-for="i in 10" 
                :key="i+10"
                class="question-item"
                :class="getQuestionStatus(i+10, 'multiple')"
                @click="jumpToQuestion(i+10, 'multiple')"
              >
                {{ i+10 }}
              </div>
            </div>
          </div>
          
          <div class="question-type">
            <h3>判断题（10 题，20 分）</h3>
            <div class="question-grid">
              <div 
                v-for="i in 10" 
                :key="i+20"
                class="question-item"
                :class="getQuestionStatus(i+20, 'trueFalse')"
                @click="jumpToQuestion(i+20, 'trueFalse')"
              >
                {{ i+20 }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="legend">
          <div class="legend-item">
            <div class="legend-color not-answered"></div>
            <span>未答</span>
          </div>
          <div class="legend-item">
            <div class="legend-color correct"></div>
            <span>正确</span>
          </div>
          <div class="legend-item">
            <div class="legend-color incorrect"></div>
            <span>错误</span>
          </div>
        </div>
      </div>

      <!-- 中间试题内容区 -->
      <div class="content-area">
        <div class="question-header">
          <h2>单选题（共 10 题，合计 20 分）</h2>
        </div>
        
        <div class="question-content">
          <div class="question-stem">
            <p>1. Vue.js 是一个用于构建用户界面的渐进式框架，以下哪个选项不是 Vue 的核心特性？</p>
          </div>
          
          <div class="options">
            <div class="option">
              <input type="radio" id="optionA" name="question1" value="A">
              <label for="optionA">A. 响应式数据绑定</label>
            </div>
            <div class="option">
              <input type="radio" id="optionB" name="question1" value="B">
              <label for="optionB">B. 组件化开发</label>
            </div>
            <div class="option">
              <input type="radio" id="optionC" name="question1" value="C" checked>
              <label for="optionC">C. 服务器端渲染</label>
            </div>
            <div class="option">
              <input type="radio" id="optionD" name="question1" value="D">
              <label for="optionD">D. 虚拟 DOM</label>
            </div>
          </div>
          
          <div class="answer-section">
            <div class="student-answer">
              <span class="label">考生答案：</span>
              <span class="value incorrect">C</span>
            </div>
            <div class="correct-answer">
              <span class="label">正确答案：</span>
              <span class="value correct">A</span>
            </div>
            <div class="explanation">
              <span class="label">解释说明：</span>
              <span class="value">Vue.js 的核心特性包括响应式数据绑定、组件化开发和虚拟 DOM，而服务器端渲染是通过 Vue SSR 实现的，并非 Vue 的核心特性。</span>
            </div>
          </div>
          
          <div class="result-tag incorrect">错误</div>
        </div>
      </div>

      <!-- 右侧考生与操作区 -->
      <div class="right-sidebar">
        <div class="student-info">
          <h3>考生信息</h3>
          <div class="info-item">
            <span class="label">考生姓名：</span>
            <span class="value">学生 A</span>
          </div>
          <div class="info-item">
            <span class="label">答题时间：</span>
            <span class="value">00:55:49</span>
          </div>
          <div class="info-item">
            <span class="label">最终得分：</span>
            <span class="value">84 分</span>
          </div>
        </div>
        
        <div class="batch-operations">
          <h3>批量操作</h3>
          <div class="operation-buttons">
            <button class="btn secondary">上一个学生</button>
            <button class="btn secondary">下一个学生</button>
          </div>
          <div class="score-adjust">
            <label for="adjustedScore">调整分数：</label>
            <input type="number" id="adjustedScore" class="form-input" value="84">
            <button class="btn primary">保存分数</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// 获取题目状态（模拟数据）
const getQuestionStatus = (questionNumber, type) => {
  // 模拟一些答题状态
  const statuses = {
    1: 'correct',
    2: 'incorrect',
    3: 'correct',
    4: 'not-answered',
    5: 'correct',
    6: 'incorrect',
    7: 'correct',
    8: 'correct',
    9: 'incorrect',
    10: 'correct'
  }
  
  if (type === 'single') {
    return statuses[questionNumber] || 'not-answered'
  }
  return 'not-answered'
}

// 跳转到题目
const jumpToQuestion = (questionNumber, type) => {
  console.log(`跳转到${type}第${questionNumber}题`)
}

// 退出阅卷
const exitReview = () => {
  // 返回成绩管理页面
  router.push('/home')
}
</script>

<style scoped>
.exam-paper-review {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 顶部信息栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 100;
}

.platform-info h1 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.platform-info h2 {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #666;
}

.exam-data {
  display: flex;
  gap: 20px;
}

.exam-data span {
  font-size: 14px;
  color: #333;
}

.actions {
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

/* 主内容区 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧答题卡导航区 */
.left-sidebar {
  width: 250px;
  background-color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #eee;
}

.question-types {
  flex: 1;
  overflow-y: auto;
}

.question-type {
  margin-bottom: 20px;
}

.question-type h3 {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

.question-item {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.question-item:hover {
  background-color: #f0f0f0;
}

.question-item.correct {
  background-color: #d4edda;
  border-color: #c3e6cb;
}

.question-item.incorrect {
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.question-item.not-answered {
  background-color: #fff;
  border-color: #ddd;
}

.legend {
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  margin-right: 8px;
}

.legend-color.not-answered {
  background-color: #fff;
  border: 1px solid #ddd;
}

.legend-color.correct {
  background-color: #d4edda;
}

.legend-color.incorrect {
  background-color: #f8d7da;
}

/* 中间试题内容区 */
.content-area {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.question-header h2 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.question-content {
  position: relative;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
  flex: 1;
}

.question-stem p {
  margin: 0 0 15px 0;
  font-size: 16px;
  color: #333;
}

.options {
  margin-bottom: 20px;
}

.option {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.option input {
  margin-right: 10px;
}

.option label {
  font-size: 14px;
  color: #333;
}

.answer-section {
  background-color: #fff;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.answer-section .label {
  font-weight: bold;
  margin-right: 5px;
  color: #333;
}

.answer-section .value {
  color: #333;
}

.answer-section .incorrect {
  color: #dc3545;
  font-weight: bold;
}

.answer-section .correct {
  color: #28a745;
  font-weight: bold;
}

.explanation .value {
  color: #666;
}

.result-tag {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.result-tag.correct {
  background-color: #d4edda;
  color: #155724;
}

.result-tag.incorrect {
  background-color: #f8d7da;
  color: #721c24;
}

/* 右侧考生与操作区 */
.right-sidebar {
  width: 250px;
  background-color: #fff;
  padding: 20px;
  border-left: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.student-info h3,
.batch-operations h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.info-item {
  margin-bottom: 12px;
  display: flex;
}

.info-item .label {
  width: 80px;
  font-weight: bold;
  color: #333;
}

.info-item .value {
  flex: 1;
  color: #333;
}

.batch-operations {
  margin-top: 30px;
}

.operation-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.score-adjust {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.score-adjust label {
  font-weight: bold;
  color: #333;
}

.form-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 按钮样式 */
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

.btn.primary:hover {
  background-color: #0056b3;
}

.btn.secondary:hover {
  background-color: #5a6268;
}
</style>