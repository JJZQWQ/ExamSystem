<template>
  <div class="home-container">
    <!-- 移动端遮罩层 -->
    <div
      v-if="isMobile && sidebarVisible"
      class="mobile-overlay"
      @click="closeSidebar"
    ></div>

    <!-- 左侧导航栏 -->
    <el-container class="layout-container">
      <el-aside width="260px" class="sidebar" :class="{ 'mobile-open': isMobile && sidebarVisible }">
        <div class="logo-section">
          <div class="logo">
            <el-icon size="28" color="#409EFF"><Document /></el-icon>
            <span class="logo-text">考试管理系统</span>
          </div>
        </div>

        <!-- 一级导航菜单 -->
        <el-menu
          :default-active="activePrimary"
          :collapse="isCollapse"
          :unique-opened="true"
          class="primary-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @select="handlePrimarySelect"
        >
          <el-menu-item index="home">
            <el-icon><House /></el-icon>
            <span>首页</span>
          </el-menu-item>

          <el-sub-menu index="exam">
            <template #title>
              <el-icon><Management /></el-icon>
              <span>考试管理</span>
            </template>
            <el-menu-item index="examInfo">考试信息管理</el-menu-item>
            <el-menu-item index="scoreManagement">成绩管理</el-menu-item>
            <el-menu-item index="examAnalysis">考试分析</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="question">
            <template #title>
              <el-icon><QuestionFilled /></el-icon>
              <span>试题管理</span>
            </template>
            <el-menu-item index="questionCategory">试题分类管理</el-menu-item>
            <el-menu-item index="questionBank">试题库</el-menu-item>
            <el-menu-item index="paperBank">试卷库</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>

          <el-menu-item index="system">
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </el-menu-item>

          <el-sub-menu index="examination">
            <template #title>
              <el-icon><Document /></el-icon>
              <span>考试</span>
            </template>
            <el-menu-item index="current">当前考试</el-menu-item>
            <el-menu-item index="history">历史考试</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </el-aside>

      <el-container class="main-container">
        <!-- 顶部导航栏 -->
        <el-header class="header">
          <div class="header-left">
            <el-button
              :icon="isCollapse ? Expand : Fold"
              @click="toggleCollapse"
              text
              size="large"
              class="collapse-btn"
            />
            <el-breadcrumb separator="/">
              <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-if="currentPageName">{{ currentPageName }}</el-breadcrumb-item>
            </el-breadcrumb>
          </div>

          <div class="header-right">
            <!-- 全屏切换 -->
            <el-tooltip content="全屏" placement="bottom">
              <el-button :icon="FullScreen" circle size="large" @click="toggleFullScreen" />
            </el-tooltip>

            <!-- 主题切换 -->
            <el-tooltip content="切换主题" placement="bottom">
              <el-button :icon="Sunny" circle size="large" @click="toggleTheme" />
            </el-tooltip>

            <!-- 通知 -->
            <el-badge :value="notificationCount" class="notification-badge">
              <el-button :icon="Bell" circle size="large" @click="showNotifications" />
            </el-badge>

            <!-- 用户信息 -->
            <el-dropdown @command="handleUserCommand">
              <div class="user-info">
                <el-avatar :size="36" :src="userAvatar" :icon="UserFilled" />
                <span class="username">{{ userName }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon><User /></el-icon>个人中心
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <el-icon><Setting /></el-icon>系统设置
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区 -->
        <el-main class="main-content">
          <!-- 首页仪表板 -->
          <div v-if="activePrimary === 'home'" class="dashboard">
            <!-- 欢迎区域 -->
            <div class="welcome-section animate__animated animate__fadeInDown">
              <el-card class="welcome-card" shadow="never">
                <div class="welcome-content">
                  <div class="welcome-text">
                    <h2>欢迎回来，{{ userName }}！</h2>
                    <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
                  </div>
                  <div class="welcome-actions">
                    <el-button type="primary" size="large" @click="navigateToCreateExam">
                      <el-icon><Plus /></el-icon>创建考试
                    </el-button>
                    <el-button size="large" @click="navigateToCreatePaper">
                      <el-icon><Document /></el-icon>创建试卷
                    </el-button>
                  </div>
                </div>
              </el-card>
            </div>

            <!-- 统计卡片 -->
            <el-row :gutter="20" class="stats-row">
              <el-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in statsData" :key="index">
                <el-card
                  class="stat-card animate__animated animate__fadeInUp"
                  shadow="hover"
                  :style="{ 'animation-delay': index * 0.1 + 's' }"
                  @click="handleStatClick(stat)"
                >
                  <div class="stat-content">
                    <div class="stat-icon" :class="stat.iconClass">
                      <el-icon :size="32"><component :is="stat.icon" /></el-icon>
                    </div>
                    <div class="stat-info">
                      <div class="stat-number">{{ stat.value }}</div>
                      <div class="stat-label">{{ stat.label }}</div>
                      <div class="stat-desc">{{ stat.description }}</div>
                      <div class="stat-trend" :class="stat.trendClass">
                        <el-icon><component :is="stat.trendIcon" /></el-icon>
                        <span>{{ stat.trend }}</span>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 快捷操作和最近考试 -->
            <el-row :gutter="20">
              <el-col :xs="24" :lg="12">
                <!-- 快捷操作 -->
                <el-card class="quick-actions-card animate__animated animate__fadeInLeft" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <span>快捷操作</span>
                      <el-button type="primary" size="small" text>自定义</el-button>
                    </div>
                  </template>

                  <el-row :gutter="16">
                    <el-col :span="12" v-for="(action, index) in quickActions" :key="index">
                      <div
                        class="action-item"
                        @click="action.handler"
                        :class="{ 'animate__animated animate__pulse': action.hover }"
                        @mouseenter="action.hover = true"
                        @mouseleave="action.hover = false"
                      >
                        <div class="action-icon" :class="action.iconClass">
                          <el-icon :size="24"><component :is="action.icon" /></el-icon>
                        </div>
                        <div class="action-title">{{ action.title }}</div>
                      </div>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>

              <el-col :xs="24" :lg="12">
                <!-- 系统通知 -->
                <el-card class="notification-card animate__animated animate__fadeInRight" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <span>系统通知</span>
                      <el-button type="primary" size="small" text>查看全部</el-button>
                    </div>
                  </template>

                  <div class="notification-list">
                    <div
                      v-for="(notification, index) in notifications"
                      :key="index"
                      class="notification-item"
                      :class="{ 'unread': !notification.read }"
                    >
                      <div class="notification-icon" :class="notification.type">
                        <el-icon><component :is="notification.icon" /></el-icon>
                      </div>
                      <div class="notification-content">
                        <div class="notification-title">{{ notification.title }}</div>
                        <div class="notification-desc">{{ notification.description }}</div>
                        <div class="notification-time">{{ notification.time }}</div>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>

            <!-- 最近考试 -->
            <el-card class="recent-exams-card animate__animated animate__fadeInUp" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>最近考试</span>
                  <div class="header-actions">
                    <el-input
                      v-model="examSearchText"
                      placeholder="搜索考试"
                      :prefix-icon="Search"
                      size="small"
                      style="width: 200px; margin-right: 12px;"
                      clearable
                    />
                    <el-button type="primary" size="small">查看全部</el-button>
                  </div>
                </div>
              </template>

              <el-table
                :data="filteredRecentExams"
                style="width: 100%"
                stripe
                :row-class-name="tableRowClassName"
                @row-click="handleRowClick"
              >
                <el-table-column prop="name" label="考试名称" min-width="200">
                  <template #default="scope">
                    <div class="exam-name">
                      <el-icon><Document /></el-icon>
                      <span>{{ scope.row.name }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="subject" label="科目" width="120" />
                <el-table-column prop="participants" label="参与人数" width="100" />
                <el-table-column prop="time" label="考试时间" width="180" />
                <el-table-column prop="status" label="状态" width="120">
                  <template #default="scope">
                    <el-tag
                      :type="getStatusType(scope.row.status)"
                      size="small"
                      effect="light"
                    >
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template #default="scope">
                    <el-button
                      type="primary"
                      size="small"
                      link
                      @click.stop="viewExamDetail(scope.row)"
                    >
                      查看详情
                    </el-button>
                    <el-button
                      v-if="scope.row.status === '进行中'"
                      type="success"
                      size="small"
                      link
                      @click.stop="monitorExam(scope.row)"
                    >
                      监控
                    </el-button>
                    <el-button
                      v-if="scope.row.status === '已完成'"
                      type="warning"
                      size="small"
                      link
                      @click.stop="viewResults(scope.row)"
                    >
                      查看成绩
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </div>

          <!-- 其他页面内容 -->
          <div v-else class="page-content">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>

    <!-- 通知抽屉 -->
    <el-drawer
      v-model="notificationDrawerVisible"
      title="系统通知"
      direction="rtl"
      size="400px"
    >
      <div class="notification-drawer">
        <div class="notification-tabs">
          <el-tabs v-model="activeNotificationTab">
            <el-tab-pane label="全部" name="all">
              <div class="notification-list">
                <div
                  v-for="(notification, index) in allNotifications"
                  :key="index"
                  class="notification-item"
                  :class="{ 'unread': !notification.read }"
                >
                  <div class="notification-icon" :class="notification.type">
                    <el-icon><component :is="notification.icon" /></el-icon>
                  </div>
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-desc">{{ notification.description }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="未读" name="unread">
              <div class="notification-list">
                <div
                  v-for="(notification, index) in unreadNotifications"
                  :key="index"
                  class="notification-item unread"
                >
                  <div class="notification-icon" :class="notification.type">
                    <el-icon><component :is="notification.icon" /></el-icon>
                  </div>
                  <div class="notification-content">
                    <div class="notification-title">{{ notification.title }}</div>
                    <div class="notification-desc">{{ notification.description }}</div>
                    <div class="notification-time">{{ notification.time }}</div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  House,
  Management,
  QuestionFilled,
  User,
  Setting,
  Document,
  Bell,
  UserFilled,
  ArrowDown,
  EditPen,
  Plus,
  Expand,
  Fold,
  FullScreen,
  Sunny,
  Moon,
  Search,
  TrendCharts,
  ArrowUp,
  SwitchButton,
  Warning,
  SuccessFilled,
  InfoFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const isCollapse = ref(false)
const activePrimary = ref('home')
const notificationDrawerVisible = ref(false)
const activeNotificationTab = ref('all')
const examSearchText = ref('')
const userName = ref('管理员')
const userAvatar = ref('')
const isDarkMode = ref(false)
const notificationCount = ref(3)

// 移动端相关
const isMobile = ref(false)
const sidebarVisible = ref(false)

// 检测是否为移动端
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  if (!isMobile.value) {
    sidebarVisible.value = false
  }
}

// 打开侧边栏
const openSidebar = () => {
  if (isMobile.value) {
    sidebarVisible.value = true
  }
}

// 关闭侧边栏
const closeSidebar = () => {
  sidebarVisible.value = false
}

// 切换侧边栏
const toggleCollapse = () => {
  if (isMobile.value) {
    sidebarVisible.value = !sidebarVisible.value
  } else {
    isCollapse.value = !isCollapse.value
  }
}

// 当前日期
const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 统计数据
const statsData = ref([
  {
    label: '今日考试',
    value: '5',
    description: '正在进行',
    icon: 'Document',
    iconClass: 'today-exam',
    trend: '+12%',
    trendIcon: 'ArrowUp',
    trendClass: 'trend-up',
    route: '/home/examination/current'
  },
  {
    label: '待批阅试卷',
    value: '12',
    description: '需要处理',
    icon: 'EditPen',
    iconClass: 'pending-review',
    trend: '+8%',
    trendIcon: 'ArrowUp',
    trendClass: 'trend-up',
    route: '/home/exam/score'
  },
  {
    label: '用户总数',
    value: '1,248',
    description: '活跃用户',
    icon: 'User',
    iconClass: 'total-users',
    trend: '+5%',
    trendIcon: 'ArrowUp',
    trendClass: 'trend-up',
    route: '/home/user/student'
  },
  {
    label: '试题总数',
    value: '3,567',
    description: '可用试题',
    icon: 'QuestionFilled',
    iconClass: 'total-questions',
    trend: '+15%',
    trendIcon: 'ArrowUp',
    trendClass: 'trend-up',
    route: '/home/question/bank'
  }
])

// 快捷操作
const quickActions = ref([
  {
    title: '创建试卷',
    icon: 'Document',
    iconClass: 'create-paper',
    handler: () => navigateToCreatePaper(),
    hover: false
  },
  {
    title: '创建考试',
    icon: 'Plus',
    iconClass: 'create-exam',
    handler: () => navigateToCreateExam(),
    hover: false
  },
  {
    title: '添加试题',
    icon: 'QuestionFilled',
    iconClass: 'add-question',
    handler: () => navigateToQuestionBank(),
    hover: false
  },
  {
    title: '添加人员',
    icon: 'UserFilled',
    iconClass: 'add-user',
    handler: () => navigateToUserManagement(),
    hover: false
  }
])

// 通知数据
const notifications = ref([
  {
    title: '新考试提醒',
    description: 'Vue.js中级考试将于明天14:00开始',
    time: '2小时前',
    type: 'warning',
    icon: 'Warning',
    read: false
  },
  {
    title: '系统维护通知',
    description: '系统将于今晚22:00-24:00进行维护',
    time: '5小时前',
    type: 'info',
    icon: 'InfoFilled',
    read: false
  },
  {
    title: '成绩发布',
    description: 'React基础测试成绩已发布',
    time: '1天前',
    type: 'success',
    icon: 'SuccessFilled',
    read: true
  }
])

// 所有通知
const allNotifications = computed(() => notifications.value)

// 未读通知
const unreadNotifications = computed(() =>
  notifications.value.filter(n => !n.read)
)

// 最近考试数据
const recentExams = ref([
  {
    name: 'Vue.js中级考试',
    subject: '前端开发',
    participants: 45,
    time: '2023-06-15 14:00',
    status: '进行中'
  },
  {
    name: 'React基础测试',
    subject: '前端开发',
    participants: 32,
    time: '2023-06-14 10:00',
    status: '已完成'
  },
  {
    name: 'Java编程实战',
    subject: '后端开发',
    participants: 28,
    time: '2023-06-16 09:30',
    status: '未开始'
  },
  {
    name: 'Python数据分析',
    subject: '数据科学',
    participants: 56,
    time: '2023-06-13 15:00',
    status: '已完成'
  }
])

// 过滤后的考试数据
const filteredRecentExams = computed(() => {
  if (!examSearchText.value) return recentExams.value
  return recentExams.value.filter(exam =>
    exam.name.toLowerCase().includes(examSearchText.value.toLowerCase()) ||
    exam.subject.toLowerCase().includes(examSearchText.value.toLowerCase())
  )
})

// 当前页面名称
const currentPageName = computed(() => {
  const nameMap = {
    home: '首页',
    examInfo: '考试信息管理',
    scoreManagement: '成绩管理',
    examAnalysis: '考试分析',
    questionCategory: '试题分类管理',
    questionBank: '试题库',
    paperBank: '试卷库',
    user: '用户管理',
    system: '系统管理',
    current: '当前考试',
    history: '历史考试'
  }
  return nameMap[activePrimary.value] || ''
})

// 切换全屏
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  // 这里可以添加主题切换逻辑
  ElMessage.info(isDarkMode.value ? '已切换到深色主题' : '已切换到浅色主题')
}

// 显示通知
const showNotifications = () => {
  notificationDrawerVisible.value = true
}

// 处理一级菜单选择
const handlePrimarySelect = (key) => {
  activePrimary.value = key

  const routeMap = {
    home: '/home',
    examInfo: '/home/exam/info',
    scoreManagement: '/home/exam/score',
    examAnalysis: '/home/exam/analysis',
    questionCategory: '/home/question/category',
    questionBank: '/home/question/bank',
    paperBank: '/home/question/paper',
    user: '/home/user/student',
    system: '/home/system/role',
    current: '/home/examination/current',
    history: '/home/examination/history'
  }

  if (routeMap[key]) {
    router.push(routeMap[key])
  }
}

// 处理用户下拉菜单命令
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人中心功能开发中...')
      break
    case 'settings':
      ElMessage.info('系统设置功能开发中...')
      break
    case 'logout':
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.push('/')
        ElMessage.success('已退出登录')
      }).catch(() => {})
      break
  }
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '进行中': 'success',
    '已完成': 'info',
    '未开始': 'warning'
  }
  return typeMap[status] || 'info'
}

// 处理统计卡片点击
const handleStatClick = (stat) => {
  // 添加点击反馈动画
  const card = event.currentTarget
  card.classList.add('animate__animated', 'animate__pulse')

  setTimeout(() => {
    card.classList.remove('animate__animated', 'animate__pulse')
  }, 600)

  // 显示提示信息
  ElMessage({
    message: `正在前往${stat.label}...`,
    type: 'success',
    duration: 1500,
    showClose: true
  })

  // 延迟跳转，让用户看到反馈
  setTimeout(() => {
    if (stat.route) {
      router.push(stat.route)
    }
  }, 300)
}

// 表格行样式
const tableRowClassName = ({ row, rowIndex }) => {
  if (row.status === '进行中') {
    return 'running-row'
  } else if (row.status === '已完成') {
    return 'completed-row'
  }
  return ''
}

// 处理行点击
const handleRowClick = (row) => {
  viewExamDetail(row)
}

// 快捷操作导航
const navigateToCreatePaper = () => {
  ElMessage({
    message: '正在前往创建试卷...',
    type: 'success',
    duration: 1500,
    showClose: true
  })
  setTimeout(() => {
    router.push('/create-paper')
  }, 300)
}

const navigateToCreateExam = () => {
  ElMessage({
    message: '正在前往创建考试...',
    type: 'success',
    duration: 1500,
    showClose: true
  })
  setTimeout(() => {
    router.push('/home/exam/create')
  }, 300)
}

const navigateToQuestionBank = () => {
  ElMessage({
    message: '正在前往试题库...',
    type: 'success',
    duration: 1500,
    showClose: true
  })
  setTimeout(() => {
    router.push('/home/question/bank')
  }, 300)
}

const navigateToUserManagement = () => {
  ElMessage({
    message: '正在前往用户管理...',
    type: 'success',
    duration: 1500,
    showClose: true
  })
  setTimeout(() => {
    router.push('/home/user/student')
  }, 300)
}

const viewExamDetail = (exam) => {
  ElMessage.info(`查看考试详情: ${exam.name}`)
}

const monitorExam = (exam) => {
  ElMessage.info(`监控考试: ${exam.name}`)
}

const viewResults = (exam) => {
  ElMessage.info(`查看成绩: ${exam.name}`)
}

// 组件挂载
onMounted(() => {
  // 检测移动端
  checkMobile()

  // 监听窗口大小变化
  window.addEventListener('resize', checkMobile)

  // 可以在这里初始化一些数据
})

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.home-container {
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100%;
}

.sidebar {
  background-color: #304156;
  overflow: hidden;
  transition: width 0.3s ease;
}

.logo-section {
  padding: 20px;
  border-bottom: 1px solid #434a50;
  background-color: #2b3a4b;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logo:hover {
  transform: scale(1.02);
}

.logo-icon {
  transition: transform 0.3s ease;
}

.logo:hover .logo-icon {
  transform: rotate(10deg);
}

.logo-text {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.primary-menu {
  border: none;
}

.main-container {
  background-color: #f0f2f5;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  transition: all 0.3s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  transition: all 0.3s ease;
}

.collapse-btn:hover {
  background-color: #f5f7fa;
  transform: scale(1.05);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.notification-badge {
  margin-right: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: #f5f7fa;
  transform: translateY(-1px);
}

.username {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.main-content {
  padding: 24px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.dashboard {
  max-width: 1400px;
  margin: 0 auto;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 24px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  position: relative;
  overflow: hidden;
}

.welcome-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
}

.welcome-card:hover::before {
  animation-duration: 3s;
}

.welcome-card :deep(.el-card__body) {
  padding: 32px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.welcome-text p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.welcome-actions {
  display: flex;
  gap: 12px;
}

.welcome-actions .el-button {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.welcome-actions .el-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  height: 140px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s;
}

.stat-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-card:hover::before {
  left: 100%;
}

.stat-card:hover::after {
  transform: scaleX(1);
}

.stat-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

.stat-card:active {
  transform: translateY(-4px) scale(1.01);
  transition: all 0.1s;
}

.stat-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 16px;
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.stat-icon::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transform: rotate(45deg);
  transition: all 0.6s ease;
}

.stat-card:hover .stat-icon::after {
  animation: shine 0.6s ease;
}

@keyframes shine {
  0% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  100% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.today-exam {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.pending-review {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.total-users {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.total-questions {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 2px;
  font-weight: 500;
}

.stat-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.trend-up {
  color: #67c23a;
}

.trend-down {
  color: #f56c6c;
}

/* 快捷操作和通知卡片 */
.quick-actions-card,
.notification-card {
  margin-bottom: 24px;
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.action-item::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background-color: rgba(64, 158, 255, 0.1);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-item:hover::before {
  width: 120px;
  height: 120px;
}

.action-item:hover {
  background-color: #409eff;
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
}

.action-item:hover .action-icon {
  background-color: #fff;
  color: #409eff;
  transform: scale(1.1) rotate(5deg);
}

.action-item:hover .action-title {
  color: #fff;
  transform: translateY(2px);
}

.action-item:active {
  transform: translateY(-2px);
  transition: all 0.1s;
}

.action-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 12px;
  position: relative;
  overflow: hidden;
}

.action-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  transform: scale(0);
  transition: transform 0.3s ease;
  border-radius: 50%;
}

.action-item:hover .action-icon::after {
  transform: scale(1.5);
}

.create-paper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.create-exam {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.add-question {
  background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
}

.add-user {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #666;
}

.action-title {
  font-size: 14px;
  color: #606266;
  text-align: center;
  font-weight: 500;
}

/* 通知列表 */
.notification-list {
  max-height: 320px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.notification-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.05), transparent);
  transition: left 0.4s;
}

.notification-item:hover::before {
  left: 100%;
}

.notification-item:hover {
  background-color: #f5f7fa;
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.notification-item.unread {
  background-color: #f0f9ff;
  border-left: 3px solid #409eff;
  position: relative;
}

.notification-item.unread::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 12px;
  width: 8px;
  height: 8px;
  background-color: #409eff;
  border-radius: 50%;
  transform: translateY(-50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

.notification-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.notification-icon.warning {
  background-color: #e6a23c;
}

.notification-icon.info {
  background-color: #909399;
}

.notification-icon.success {
  background-color: #67c23a;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-desc {
  font-size: 12px;
  color: #606266;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-time {
  font-size: 11px;
  color: #909399;
}

/* 最近考试表格 */
.recent-exams-card {
  margin-bottom: 24px;
}

.exam-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.exam-name .el-icon {
  color: #409eff;
}

/* 表格行样式 */
:deep(.running-row) {
  background-color: #f0f9ff !important;
  position: relative;
}

:deep(.running-row::after) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: #409eff;
}

:deep(.completed-row) {
  background-color: #f5f7fa !important;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

:deep(.el-table__row::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.02), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

:deep(.el-table__row:hover::before) {
  transform: translateX(100%);
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
  transform: scale(1.01);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

:deep(.el-table__row:active) {
  transform: scale(1.005);
  transition: all 0.1s;
}

/* 按钮涟漪效果 */
.el-button {
  position: relative;
  overflow: hidden;
}

.el-button::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.el-button:active::after {
  width: 300px;
  height: 300px;
}

/* 通知徽章动画 */
.notification-badge {
  position: relative;
}

.notification-badge .el-badge__content {
  animation: bounceIn 0.6s;
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* 侧边栏菜单项动画 */
.el-menu-item {
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.el-menu-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 0;
  background-color: #409eff;
  transition: width 0.3s;
}

.el-menu-item:hover::before {
  width: 3px;
}

.el-menu-item:hover {
  transform: translateX(4px);
  background-color: #f0f9ff;
}

/* 页面内容 */
.page-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  min-height: calc(100vh - 112px);
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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

/* 通知抽屉 */
.notification-drawer {
  height: 100%;
}

.notification-tabs {
  height: 100%;
}

.notification-drawer .notification-list {
  height: calc(100vh - 120px);
  padding: 0 16px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .welcome-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .welcome-actions {
    justify-content: center;
  }

  .sidebar {
    width: 220px !important;
  }
}

@media (max-width: 992px) {
  .sidebar {
    width: 200px !important;
  }

  .logo-text {
    font-size: 16px;
  }

  .stats-row .el-col {
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 0 16px;
  }

  .main-content {
    padding: 16px;
  }

  .username {
    display: none;
  }

  .stat-card {
    height: 120px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-number {
    font-size: 24px;
  }

  .welcome-text h2 {
    font-size: 24px;
  }

  .welcome-text p {
    font-size: 14px;
  }

  .header-actions {
    flex-direction: column;
    gap: 8px;
  }

  .header-actions .el-input {
    width: 100% !important;
  }

  .sidebar {
    position: fixed !important;
    z-index: 1000;
    height: 100vh;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .main-container {
    margin-left: 0 !important;
  }

  .mobile-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 260px !important;
  }

  .main-container {
    margin-left: 0;
  }

  .quick-actions-card,
  .notification-card {
    height: auto;
  }

  .action-item {
    padding: 16px;
  }

  .action-icon {
    width: 50px;
    height: 50px;
  }

  .welcome-actions .el-button {
    width: 100%;
    margin-bottom: 8px;
  }

  .header-right {
    gap: 8px;
  }

  .header-right .el-button {
    padding: 8px;
  }

  .user-info {
    padding: 4px 8px;
  }
}

/* 深色模式 */
@media (prefers-color-scheme: dark) {
  .main-container {
    background-color: #1a1a1a;
  }

  .main-content {
    background-color: #1a1a1a;
  }

  .header {
    background-color: #2d2d2d;
    border-bottom-color: #404040;
  }

  .page-content {
    background-color: #2d2d2d;
    color: #fff;
  }

  .action-item:hover {
    background-color: #404040;
  }

  .notification-item:hover {
    background-color: #404040;
  }
}
</style>
