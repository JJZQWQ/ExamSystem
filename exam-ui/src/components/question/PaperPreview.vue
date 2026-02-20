<template>
  <div class="paper-preview">
    <!-- 顶部区域 -->
    <div class="top-bar">
      <div class="platform-info">
        <span class="platform-name">在线考试平台</span>
        <span class="paper-name">示例试卷 1</span>
      </div>
      <div class="top-actions">
        <span class="notification">🔔<span class="badge">4</span></span>
        <button class="btn secondary" @click="exitPreview">退出</button>
      </div>
    </div>

    <div class="preview-content">
      <!-- 左侧答题卡导航区 -->
      <div class="navigation-panel">
        <div class="section-nav">
          <div class="section-item" 
               :class="{ active: activeSection === 'single' }"
               @click="switchSection('single')">
            <div class="section-title">单选题</div>
            <div class="section-info">10 题，20 分</div>
          </div>
          <div class="section-item" 
               :class="{ active: activeSection === 'multiple' }"
               @click="switchSection('multiple')">
            <div class="section-title">多选题</div>
            <div class="section-info">10 题，20 分</div>
          </div>
          <div class="section-item" 
               :class="{ active: activeSection === 'judge' }"
               @click="switchSection('judge')">
            <div class="section-title">判断题</div>
            <div class="section-info">10 题，20 分</div>
          </div>
        </div>

        <div class="question-nav">
          <div class="question-grid">
            <div 
              v-for="i in 10" 
              :key="i"
              class="question-number"
              :class="{ active: activeQuestion === i }"
              @click="jumpToQuestion(i)"
            >
              {{ i }}
            </div>
          </div>
        </div>
      </div>

      <!-- 中间试题内容区 -->
      <div class="question-content">
        <div class="section-header">
          <h2>单选题（共 10 题，合计 20 分）</h2>
        </div>

        <div class="question-list">
          <div 
            v-for="i in 3" 
            :key="i"
            class="question-item"
          >
            <div class="question-stem">
              {{ i }}. Vue.js是一个用于构建用户界面的渐进式框架，它的核心库只关注视图层。
            </div>
            <div class="question-options">
              <div class="option-item">
                <input type="radio" :id="'optionA' + i" :name="'question' + i" value="A">
                <label :for="'optionA' + i">A. 正确</label>
              </div>
              <div class="option-item">
                <input type="radio" :id="'optionB' + i" :name="'question' + i" value="B">
                <label :for="'optionB' + i">B. 错误</label>
              </div>
              <div class="option-item">
                <input type="radio" :id="'optionC' + i" :name="'question' + i" value="C">
                <label :for="'optionC' + i">C. 不确定</label>
              </div>
              <div class="option-item">
                <input type="radio" :id="'optionD' + i" :name="'question' + i" value="D">
                <label :for="'optionD' + i">D. 以上都不对</label>
              </div>
            </div>

            <div class="answer-analysis">
              <div class="answer">
                <span class="label">正确答案：</span>
                <span class="value">A</span>
              </div>
              <div class="analysis">
                <span class="label">解释说明：</span>
                <span class="value">Vue.js确实是一个用于构建用户界面的渐进式框架，它的核心库只关注视图层。</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧时间与进度区 -->
      <div class="sidebar">
        <div class="time-panel">
          <div class="time-label">剩余时间</div>
          <div class="time-display">00:59:59</div>
        </div>

        <div class="progress-panel">
          <div class="progress-label">答题进度</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: '30%' }"></div>
          </div>
          <div class="progress-text">3/10</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前激活的题型区域
const activeSection = ref('single')

// 当前激活的题目
const activeQuestion = ref(1)

// 切换题型区域
const switchSection = (section) => {
  activeSection.value = section
}

// 跳转到指定题目
const jumpToQuestion = (questionNumber) => {
  activeQuestion.value = questionNumber
}

// 退出预览
const exitPreview = () => {
  // 返回到试卷库页面
  router.push('/home/question/paperBank')
}
</script>

<style scoped>
.paper-preview {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

/* 顶部区域 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0 20px;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.platform-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.paper-name {
  font-size: 16px;
  color: #666;
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

.btn.secondary {
  background-color: #6c757d;
  color: white;
}

.btn.secondary:hover {
  background-color: #5a6268;
}

/* 主内容区域 */
.preview-content {
  flex: 1;
  display: flex;
  padding: 20px;
  gap: 20px;
  overflow: hidden;
}

/* 左侧导航面板 */
.navigation-panel {
  width: 250px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.section-nav {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.section-item {
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.2s;
}

.section-item:last-child {
  margin-bottom: 0;
}

.section-item:hover {
  background-color: #f8f9fa;
}

.section-item.active {
  background-color: #0066cc;
  color: white;
}

.section-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.section-info {
  font-size: 12px;
  opacity: 0.8;
}

.question-nav {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.question-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.question-number:hover {
  background-color: #f8f9fa;
  border-color: #0066cc;
}

.question-number.active {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}

/* 中间试题内容区 */
.question-content {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.section-header h2 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.question-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.question-item {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.question-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.question-stem {
  font-weight: bold;
  margin-bottom: 15px;
  line-height: 1.5;
}

.question-options {
  margin-bottom: 20px;
}

.option-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.option-item input[type="radio"] {
  width: 16px;
  height: 16px;
}

.option-item label {
  cursor: pointer;
  user-select: none;
}

.answer-analysis {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 15px;
}

.answer, .analysis {
  margin-bottom: 10px;
  display: flex;
}

.answer:last-child, .analysis:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: bold;
  width: 80px;
  color: #333;
}

.value {
  flex: 1;
  color: #666;
}

/* 右侧侧边栏 */
.sidebar {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.time-panel, .progress-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  padding: 20px;
}

.time-label, .progress-label {
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.time-display {
  font-size: 24px;
  font-weight: bold;
  color: #0066cc;
  text-align: center;
}

.progress-bar {
  height: 10px;
  background-color: #eee;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #0066cc;
  border-radius: 5px;
}

.progress-text {
  text-align: center;
  font-size: 14px;
  color: #666;
}
</style>