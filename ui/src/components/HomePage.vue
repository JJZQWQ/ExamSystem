<template>
  <div class="home-container">
    <!-- 左侧导航栏 -->
    <div class="left-sidebar">
      <!-- 一级导航 -->
      <div class="primary-nav">
        <div 
          v-for="item in navItems" 
          :key="item.id"
          class="nav-item"
          :class="{ active: activePrimary === item.id }"
          @click="setPrimaryNav(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
      
      <!-- 二级导航 -->
      <div class="secondary-nav">
        <div 
          v-for="item in subNavItems[activePrimary]" 
          :key="item.id"
          class="sub-nav-item"
          :class="{ active: activeSecondary === item.id }"
          @click="setSecondaryNav(item.id)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="right-content">
      <!-- 顶部功能栏 -->
      <header class="top-bar">
        <div class="platform-name">在线考试平台</div>
        <div class="user-section">
          <span class="notification">🔔<span class="badge">3</span></span>
          <span class="user-info">
            <span>管理员</span>
            <span class="avatar">👤</span>
          </span>
        </div>
      </header>

      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 首页内容 -->
        <div v-if="activePrimary === 'home'" class="page-content">
          <div class="dashboard">
            <div class="stats-cards">
              <div class="stat-card">
                <h3>今日考试</h3>
                <p class="stat-number">5</p>
                <p class="stat-desc">正在进行</p>
              </div>
              <div class="stat-card">
                <h3>待批阅试卷</h3>
                <p class="stat-number">12</p>
                <p class="stat-desc">需要处理</p>
              </div>
              <div class="stat-card">
                <h3>用户总数</h3>
                <p class="stat-number">1,248</p>
                <p class="stat-desc">活跃用户</p>
              </div>
            </div>

            <div class="quick-actions">
              <h2>快捷操作</h2>
              <div class="action-grid">
                <div class="action-item" @click="navigateToCreatePaper">
                  <div class="action-icon">📄</div>
                  <div class="action-title">创建试卷</div>
                </div>
                <div class="action-item" @click="navigateToCreateExam">
                  <div class="action-icon">✏️</div>
                  <div class="action-title">创建考试</div>
                </div>
                <div class="action-item" @click="setSecondaryNav('addQuestions')">
                  <div class="action-icon">❓</div>
                  <div class="action-title">添加试题</div>
                </div>
                <div class="action-item" @click="setSecondaryNav('addUsers')">
                  <div class="action-icon">👤</div>
                  <div class="action-title">添加人员</div>
                </div>
              </div>
            </div>

            <div class="recent-exams">
              <h2>最近考试</h2>
              <table class="exams-table">
                <thead>
                  <tr>
                    <th>考试名称</th>
                    <th>时间</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Vue.js中级考试</td>
                    <td>2023-06-15 14:00</td>
                    <td><span class="status running">进行中</span></td>
                    <td><a href="#">查看详情</a></td>
                  </tr>
                  <tr>
                    <td>React基础测试</td>
                    <td>2023-06-14 10:00</td>
                    <td><span class="status completed">已完成</span></td>
                    <td><a href="#">查看成绩</a></td>
                  </tr>
                  <tr>
                    <td>Java编程实战</td>
                    <td>2023-06-16 09:30</td>
                    <td><span class="status pending">未开始</span></td>
                    <td><a href="#">配置考试</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 考试管理页面 -->
        <div v-else-if="activePrimary === 'exam'" class="page-content">
          <router-view />
        </div>

        <!-- 试题管理页面 -->
        <div v-else-if="activePrimary === 'question'" class="page-content">
          <router-view />
        </div>

        <!-- 用户管理页面 -->
        <div v-else-if="activePrimary === 'user'" class="page-content">
          <h1>用户管理</h1>
          <div v-if="activeSecondary === 'studentManage'">
            <h2>学生管理</h2>
            <p>这里是学生管理页面的内容...</p>
          </div>
        </div>

        <!-- 系统管理页面 -->
        <div v-else-if="activePrimary === 'system'" class="page-content">
          <h1>系统管理</h1>
          <div v-if="activeSecondary === 'roleManage'">
            <h2>角色管理</h2>
            <p>这里是角色管理页面的内容...</p>
          </div>
        </div>
      </div>

      <!-- 底部状态栏 -->
      <footer class="footer">
        <div class="footer-content">
          <span>当前用户：管理员</span>
          <a href="#" class="switch-account">切换账户</a>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 一级导航项
const navItems = [
  { id: 'home', name: '首页' },
  { id: 'exam', name: '考试管理' },
  { id: 'question', name: '试题管理' },
  { id: 'user', name: '用户管理' },
  { id: 'system', name: '系统管理' }
]

// 二级导航项（更新试题管理的二级导航，移除创建试卷）
const subNavItems = {
  home: [
    { id: 'createPaper', name: '创建试卷' },
    { id: 'createExam', name: '创建考试' },
    { id: 'addQuestions', name: '添加试题' },
    { id: 'addUsers', name: '添加人员' }
  ],
  exam: [
    { id: 'examInfo', name: '考试信息管理' },
    { id: 'scoreManagement', name: '成绩管理' },
    { id: 'examAnalysis', name: '考试分析' }
  ],
  question: [
    { id: 'questionCategory', name: '试题分类管理' },
    { id: 'questionBank', name: '试题库' },
    { id: 'paperBank', name: '试卷库' }
  ],
  user: [
    { id: 'studentManage', name: '学生管理' }
  ],
  system: [
    { id: 'roleManage', name: '角色管理' }
  ]
}

// 当前激活的一级和二级导航
const activePrimary = ref('question')
const activeSecondary = ref('paperBank')

// 设置一级导航
const setPrimaryNav = (id) => {
  activePrimary.value = id
  // 设置默认的二级导航
  if (subNavItems[id] && subNavItems[id].length > 0) {
    activeSecondary.value = subNavItems[id][0].id
  }
}

// 设置二级导航
const setSecondaryNav = (id) => {
  activeSecondary.value = id
  
  // 根据导航跳转到相应页面
  if (activePrimary.value === 'home') {
    if (id === 'createPaper') {
      router.push('/create-paper')
    } else if (id === 'createExam') {
      router.push('/home/exam/create')
    } else if (id === 'addQuestions') {
      router.push('/home/question/bank')
    } else if (id === 'addUsers') {
      // 可以添加用户管理路由
    }
  } else if (activePrimary.value === 'exam') {
    if (id === 'examInfo') {
      router.push('/home/exam/info')
    } else if (id === 'scoreManagement') {
      router.push('/home/exam/score')
    } else if (id === 'examAnalysis') {
      router.push('/home/exam/analysis')
    }
  } else if (activePrimary.value === 'question') {
    if (id === 'questionCategory') {
      router.push('/home/question/category')
    } else if (id === 'questionBank') {
      router.push('/home/question/bank')
    } else if (id === 'paperBank') {
      router.push('/home/question/paper')
    }
  }
}

// 导航到创建试卷页面
const navigateToCreatePaper = () => {
  router.push('/create-paper')
}

// 导航到创建考试页面
const navigateToCreateExam = () => {
  router.push('/home/exam/create')
}
</script>

<style scoped>
.home-container {
  display: flex;
  height: 90vh; /* 16:9 比例的高度 */
  width: 160vh; /* 16:9 比例的宽度 */
  max-width: 1600px;
  max-height: 900px;
  margin: 5vh auto; /* 居中显示 */
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* 左侧导航栏 */
.left-sidebar {
  display: flex;
  width: 300px;
  background-color: #333;
  color: white;
}

/* 一级导航 */
.primary-nav {
  width: 120px;
  padding: 20px 0;
  background-color: #222;
}

.nav-item {
  padding: 15px 20px;
  cursor: pointer;
  color: #ccc;
  font-size: 14px;
  transition: all 0.2s;
  white-space: nowrap;
}

.nav-item:hover {
  background-color: #444;
}

.nav-item.active {
  background-color: #0066cc;
  color: white;
}

/* 二级导航 */
.secondary-nav {
  flex: 1;
  padding: 20px 0;
}

.sub-nav-item {
  padding: 12px 20px;
  cursor: pointer;
  color: #aaa;
  font-size: 13px;
  transition: all 0.2s;
  white-space: nowrap;
}

.sub-nav-item:hover {
  background-color: #333;
  color: #fff;
}

.sub-nav-item.active {
  background-color: #0056b3;
  color: white;
}

/* 右侧内容区 */
.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部功能栏 */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 0 20px;
}

.platform-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.user-section {
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

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
}

.avatar {
  font-size: 20px;
}

/* 主内容区 */
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
}

.page-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: calc(100% - 20px);
}

.page-content h1 {
  margin-top: 0;
  color: #333;
}

.page-content h2 {
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-top: 0;
}

.dashboard {
  padding: 10px 0;
}

/* 统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #0066cc;
  margin: 8px 0;
}

.stat-desc {
  color: #666;
  margin: 0;
  font-size: 13px;
}

/* 快捷操作 */
.quick-actions {
  margin-bottom: 25px;
}

.quick-actions h2 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.action-item {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.action-item:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.action-icon {
  font-size: 20px;
  margin-bottom: 8px;
}

.action-title {
  font-weight: bold;
  color: #333;
  font-size: 13px;
}

/* 最近考试表格 */
.recent-exams {
  margin-top: 25px;
}

.recent-exams h2 {
  margin-bottom: 15px;
  color: #333;
  font-size: 18px;
}

.exams-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.exams-table th,
.exams-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.exams-table th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

.status {
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: bold;
}

.status.running {
  background-color: #d4edda;
  color: #155724;
}

.status.completed {
  background-color: #cce5ff;
  color: #004085;
}

.status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.exams-table a {
  color: #0066cc;
  text-decoration: none;
  font-size: 13px;
}

.exams-table a:hover {
  text-decoration: underline;
}

/* 底部状态栏 */
.footer {
  height: 40px;
  background-color: #fff;
  border-top: 1px solid #dee2e6;
  display: flex;
  align-items: center;
}

.footer-content {
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.switch-account {
  color: #0066cc;
  text-decoration: none;
  font-size: 12px;
}

.switch-account:hover {
  text-decoration: underline;
}

/* 响应式调整 */
@media (max-width: 1200px) {
  .home-container {
    width: 95vw;
    height: calc(95vw * 9 / 16);
    margin: 2.5vh auto;
  }
}
</style>