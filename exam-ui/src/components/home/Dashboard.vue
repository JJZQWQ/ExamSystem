<template>
  <div class="home-container">
    <el-container class="layout-container">
      <!-- 侧边栏 -->
      <el-container class="main-container">
        <el-aside
          :width="isCollapse ? '64px' : '260px'"
          class="sidebar"
          :class="{ 'mobile-open': sidebarVisible }"
        >
          <!-- Logo部分 -->
          <div class="logo-section">
            <div class="logo">
              <el-icon :size="32" class="logo-icon">
                <TrendCharts />
              </el-icon>
              <span v-if="!isCollapse" class="logo-text">考试管理系统</span>
            </div>
          </div>

          <!-- 侧边菜单 -->
          <el-menu
            :collapse="isCollapse"
            :collapse-transition="!isMobile"
            :unique-opened="true"
            class="primary-menu"
            @select="handlePrimarySelect"
            :default-active="activePrimary"
            background-color="#304156"
            text-color="#ffffff"
            active-text-color="#409eff"
          >
            <!-- 首页 -->
            <el-menu-item index="home">
              <template #title>
                <span>首页</span>
              </template>
              <el-icon><House /></el-icon>
            </el-menu-item>

            <!-- 考试 -->
            <el-sub-menu index="examination">
              <template #title>
                <el-icon><Document /></el-icon>
                <span>考试</span>
              </template>
              <el-menu-item index="current-exam">当前考试</el-menu-item>
              <el-menu-item index="history-exam">历史考试</el-menu-item>
            </el-sub-menu>

            <!-- 考试管理 -->
            <el-sub-menu index="examManagement">
              <template #title>
                <el-icon><Management /></el-icon>
                <span>考试管理</span>
              </template>
              <el-menu-item index="create-exam">创建考试</el-menu-item>
              <el-menu-item index="manage-exams">管理考试</el-menu-item>
            </el-sub-menu>

            <!-- 试题管理 -->
            <el-sub-menu index="question">
              <template #title>
                <el-icon><QuestionFilled /></el-icon>
                <span>试题管理</span>
              </template>
              <el-menu-item index="question-bank">试题库</el-menu-item>
              <el-menu-item index="create-question">创建试题</el-menu-item>
            </el-sub-menu>

            <!-- 用户管理 -->
            <el-menu-item index="user">
              <template #title>
                <span>用户管理</span>
              </template>
              <el-icon><User /></el-icon>
            </el-menu-item>

            <!-- 系统管理 -->
            <el-menu-item index="system">
              <template #title>
                <span>系统管理</span>
              </template>
              <el-icon><Setting /></el-icon>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <!-- 主内容区 -->
        <el-container>
          <!-- 顶部导航栏 -->
          <el-header height="60px" class="header">
            <div class="header-left">
              <el-button
                size="small"
                class="collapse-btn"
                @click="toggleCollapse"
                :icon="isCollapse ? Expand : Fold"
              >
                <el-icon><component :is="isCollapse ? Expand : Fold" /></el-icon>
              </el-button>
              
              <!-- 面包屑导航 -->
              <el-breadcrumb separator="/" v-if="!isMobile">
                <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item v-if="currentPageName">{{ currentPageName }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>

            <div class="header-right">
              <!-- 全屏按钮 -->
              <el-button
                size="small"
                @click="toggleFullScreen"
                :icon="FullScreen"
              >
                <el-icon><FullScreen /></el-icon>
              </el-button>
              
              <!-- 主题切换 -->
              <el-button
                size="small"
                @click="toggleTheme"
                :icon="isDarkMode ? Sunny : Moon"
              >
                <el-icon><component :is="isDarkMode ? Sunny : Moon" /></el-icon>
              </el-button>
              
              <!-- 通知 -->
              <div class="notification-badge">
                <el-button
                  size="small"
                  @click="showNotifications"
                  :icon="Bell"
                >
                  <el-icon><Bell /></el-icon>
                  <el-badge
                    v-if="notificationCount > 0"
                    :value="notificationCount"
                    class="notification-count"
                    effect="dark"
                  />
                </el-button>
              </div>
              
              <!-- 用户信息 -->
              <el-dropdown @command="handleUserCommand">
                <div class="user-info">
                  <el-avatar :size="32" :src="userAvatar">
                    <el-icon><UserFilled /></el-icon>
                  </el-avatar>
                  <span class="username">{{ userName }}</span>
                  <el-icon><ArrowDown /></el-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                    <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-header>

          <!-- 主内容 -->
          <el-main class="main-content">
            <!-- 首页内容 -->
            <div v-if="activePrimary === 'home'" class="dashboard">
              <!-- 欢迎区域 -->
              <el-card class="welcome-card animate__animated animate__fadeIn">
                <div class="welcome-content">
                  <div class="welcome-text">
                    <h2>欢迎回来，{{ userName }}！</h2>
                    <p>今天是 {{ currentDate }}，祝您工作愉快！</p>
                  </div>
                  <div class="welcome-actions">
                    <el-button type="primary" @click="navigateToCreateExam">创建考试</el-button>
                    <el-button type="success" @click="navigateToQuestionBank">管理试题</el-button>
                  </div>
                </div>
              </el-card>

              <!-- 统计卡片 -->
              <el-row :gutter="20" class="stats-row">
                <el-col :xs="24" :sm="12" :lg="6" v-for="(stat, index) in statsData" :key="index">
                  <el-card class="stat-card animate__animated animate__fadeInUp" shadow="hover" @click="handleStatClick(stat)">
                    <div class="stat-content">
                      <div class="stat-icon" :class="stat.iconClass">
                        <el-icon :size="32"><component :is="stat.icon" /></el-icon>
                      </div>
                      <div class="stat-info">
                        <div class="stat-number">
                          <el-skeleton v-if="statsLoading" :rows="1" animated />
                          <template v-else>{{ stat.value }}</template>
                        </div>
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
                      <template v-if="notificationLoading">
                        <div v-for="i in 3" :key="i" class="notification-item">
                          <el-skeleton :rows="3" animated />
                        </div>
                      </template>
                      <template v-else>
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
                        <div v-if="notifications.length === 0" class="empty-notification">
                          暂无通知
                        </div>
                      </template>
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
                        class="search-input"
                        clearable
                      />
                      <el-button type="primary" size="small" class="view-all-btn">查看全部</el-button>
                    </div>
                  </div>
                </template>

                <el-table
                  v-loading="examLoading"
                  :data="filteredRecentExams"
                  style="width: 100%"
                  stripe
                  :row-class-name="tableRowClassName"
                  @row-click="handleRowClick"
                  :default-sort="{ prop: 'time', order: 'descending' }"
                  :flexible="true"
                  table-layout="auto"
                  empty-text="暂无考试数据"
                >
                  <el-table-column prop="name" label="考试名称" min-width="180" show-overflow-tooltip>
                    <template #default="scope">
                      <div class="exam-name">
                        <el-icon><Document /></el-icon>
                        <span>{{ scope.row.name }}</span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="subject" label="科目" width="100" />
                  <el-table-column prop="participants" label="参与人数" width="90" align="center" />
                  <el-table-column prop="time" label="考试时间" width="160" />
                  <el-table-column prop="status" label="状态" width="100" align="center">
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
                  <el-table-column label="操作" width="160" align="center" :fixed="!isMobile ? 'right' : false">
                    <template #default="scope">
                      <div class="table-actions">
                        <el-button
                          type="primary"
                          size="small"
                          link
                          @click.stop="viewExamDetail(scope.row)"
                        >
                          详情
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
                          成绩
                        </el-button>
                      </div>
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

    <!-- 移动端遮罩 -->
    <div
      v-if="sidebarVisible"
      class="mobile-overlay"
      @click="closeSidebar"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElSkeleton } from 'element-plus'
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

// 模拟服务 - 实际项目中需要使用真实的服务导入
const examService = {
  getTodayExams: async () => ({ data: { count: 5 } })
}

const scoreService = {
  getPendingScores: async () => ({ data: { count: 12 } })
}

const userService = {
  getTotalUsers: async () => ({ data: { count: 156 } })
}

const questionService = {
  getTotalQuestions: async () => ({ data: { count: 1280 } })
}

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
const notificationCount = ref(0)

// 数据加载状态
const loading = ref(false)
const statsLoading = ref(false)
const notificationLoading = ref(false)
const examLoading = ref(false)

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
const statsData = ref([])

// 通知数据
const notifications = ref([])

// 最近考试数据
const recentExams = ref([])

// 所有通知
const allNotifications = computed(() => notifications.value)

// 未读通知
const unreadNotifications = computed(() =>
  notifications.value.filter(n => !n.read)
)

// 快捷操作
const quickActions = ref([
  {
    title: '创建试卷',
    icon: Document,
    iconClass: 'create-paper',
    handler: () => navigateToCreatePaper(),
    hover: false
  },
  {
    title: '创建考试',
    icon: Plus,
    iconClass: 'create-exam',
    handler: () => navigateToCreateExam(),
    hover: false
  },
  {
    title: '添加试题',
    icon: QuestionFilled,
    iconClass: 'add-question',
    handler: () => navigateToQuestionBank(),
    hover: false
  },
  {
    title: '添加人员',
    icon: UserFilled,
    iconClass: 'add-user',
    handler: () => navigateToUserManagement(),
    hover: false
  }
])

// 获取统计数据
const fetchStatsData = async () => {
  statsLoading.value = true
  try {
    // 并行请求所有统计数据
    const [todayExamsRes, pendingScoresRes, totalUsersRes, totalQuestionsRes] = await Promise.all([
      examService.getTodayExams(),
      scoreService.getPendingScores(),
      userService.getTotalUsers(),
      questionService.getTotalQuestions()
    ])

    statsData.value = [
      {
        label: '今日考试',
        value: todayExamsRes.data.count || 0,
        description: '今日安排的考试数量',
        icon: Document,
        iconClass: 'today-exams',
        trend: '+12%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      },
      {
        label: '待评分',
        value: pendingScoresRes.data.count || 0,
        description: '等待教师评分的试卷',
        icon: EditPen,
        iconClass: 'pending-scores',
        trend: '+3%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      },
      {
        label: '总用户',
        value: totalUsersRes.data.count || 0,
        description: '系统中注册的用户总数',
        icon: UserFilled,
        iconClass: 'total-users',
        trend: '+8%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      },
      {
        label: '总试题',
        value: totalQuestionsRes.data.count || 0,
        description: '试题库中的试题总数',
        icon: QuestionFilled,
        iconClass: 'total-questions',
        trend: '+5%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      }
    ]
  } catch (error) {
    console.error('获取统计数据失败:', error)
    ElMessage.error('获取统计数据失败')
    
    // 提供模拟数据
    statsData.value = [
      {
        label: '今日考试',
        value: 5,
        description: '今日安排的考试数量',
        icon: Document,
        iconClass: 'today-exams',
        trend: '+12%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      },
      {
        label: '待评分',
        value: 12,
        description: '等待教师评分的试卷',
        icon: EditPen,
        iconClass: 'pending-scores',
        trend: '+3%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      },
      {
        label: '总用户',
        value: 156,
        description: '系统中注册的用户总数',
        icon: UserFilled,
        iconClass: 'total-users',
        trend: '+8%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      },
      {
        label: '总试题',
        value: 1280,
        description: '试题库中的试题总数',
        icon: QuestionFilled,
        iconClass: 'total-questions',
        trend: '+5%',
        trendClass: 'trend-up',
        trendIcon: ArrowUp
      }
    ]
  } finally {
    statsLoading.value = false
  }
}

// 获取通知数据
const fetchNotifications = async () => {
  notificationLoading.value = true
  try {
    // 模拟通知数据
    notifications.value = [
      {
        id: 1,
        title: '系统更新通知',
        description: '系统将于今晚22:00-23:00进行例行维护，请提前做好准备',
        time: '2小时前',
        read: false,
        type: 'warning',
        icon: Warning
      },
      {
        id: 2,
        title: '新考试创建成功',
        description: '您创建的"高等数学期中考试"已成功，将于明天上午10:00开始',
        time: '4小时前',
        read: false,
        type: 'success',
        icon: SuccessFilled
      },
      {
        id: 3,
        title: '新用户注册',
        description: '有3名新用户注册了系统：张三、李四、王五',
        time: '昨天',
        read: true,
        type: 'info',
        icon: InfoFilled
      }
    ]
    notificationCount.value = notifications.value.filter(n => !n.read).length
  } catch (error) {
    console.error('获取通知数据失败:', error)
    ElMessage.error('获取通知数据失败')
  } finally {
    notificationLoading.value = false
  }
}

// 获取最近考试数据
const fetchRecentExams = async () => {
  examLoading.value = true
  try {
    // 模拟最近考试数据
    recentExams.value = [
      {
        id: 1,
        name: '高等数学期中考试',
        subject: '数学',
        participants: 45,
        time: '2024-01-20 10:00',
        status: '即将开始'
      },
      {
        id: 2,
        name: '大学英语四级模拟考试',
        subject: '英语',
        participants: 120,
        time: '2024-01-19 14:30',
        status: '进行中'
      },
      {
        id: 3,
        name: '程序设计基础期末考试',
        subject: '计算机',
        participants: 89,
        time: '2024-01-18 09:00',
        status: '已完成'
      },
      {
        id: 4,
        name: '数据结构与算法期中考试',
        subject: '计算机',
        participants: 67,
        time: '2024-01-17 16:00',
        status: '已完成'
      },
      {
        id: 5,
        name: '线性代数期末考试',
        subject: '数学',
        participants: 56,
        time: '2024-01-16 10:00',
        status: '已完成'
      }
    ]
  } catch (error) {
    console.error('获取最近考试数据失败:', error)
    ElMessage.error('获取最近考试数据失败')
  } finally {
    examLoading.value = false
  }
}

// 过滤后的最近考试
const filteredRecentExams = computed(() => {
  if (!examSearchText.value) {
    return recentExams.value
  }
  return recentExams.value.filter(exam => 
    exam.name.toLowerCase().includes(examSearchText.value.toLowerCase()) ||
    exam.subject.toLowerCase().includes(examSearchText.value.toLowerCase()) ||
    exam.status.toLowerCase().includes(examSearchText.value.toLowerCase())
  )
})

// 处理统计卡片点击
const handleStatClick = (stat) => {
  switch (stat.label) {
    case '今日考试':
      router.push('/exams/today')
      break
    case '待评分':
      router.push('/scores/pending')
      break
    case '总用户':
      router.push('/users')
      break
    case '总试题':
      router.push('/questions')
      break
    default:
      break
  }
}

// 查看考试详情
const viewExamDetail = (exam) => {
  router.push(`/exam/${exam.id}/detail`)
}

// 监控考试
const monitorExam = (exam) => {
  router.push(`/exam/${exam.id}/monitor`)
}

// 查看成绩
const viewResults = (exam) => {
  router.push(`/exam/${exam.id}/results`)
}

// 处理表格行点击
const handleRowClick = (row) => {
  viewExamDetail(row)
}

// 表格行样式
const tableRowClassName = ({ row }) => {
  return {
    'exam-row-warning': row.status === '即将开始',
    'exam-row-success': row.status === '进行中',
    'exam-row-default': row.status === '已完成'
  }
}

// 获取状态类型
const getStatusType = (status) => {
  switch (status) {
    case '即将开始':
      return 'warning'
    case '进行中':
      return 'success'
    default:
      return 'default'
  }
}

// 显示通知
const showNotifications = () => {
  notificationDrawerVisible.value = true
}

// 切换主题
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  const body = document.body
  if (isDarkMode.value) {
    body.classList.add('dark-theme')
    body.classList.remove('light-theme')
  } else {
    body.classList.add('light-theme')
    body.classList.remove('dark-theme')
  }
  ElMessage.success(`主题已切换为${isDarkMode.value ? '深色' : '浅色'}模式`)
}

// 切换全屏
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      ElMessage.error(`全屏切换失败: ${err.message}`)
    })
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}

// 处理用户命令
const handleUserCommand = (command) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      handleLogout()
      break
    default:
      break
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '退出登录',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // 这里应该调用登出API，清除token等
    router.push('/login')
  } catch (error) {
    // 用户取消操作
  }
}

// 导航到创建考试
const navigateToCreateExam = () => {
  router.push('/exam/create')
}

// 导航到创建试卷
const navigateToCreatePaper = () => {
  router.push('/paper/create')
}

// 导航到试题库
const navigateToQuestionBank = () => {
  router.push('/questions')
}

// 导航到用户管理
const navigateToUserManagement = () => {
  router.push('/users')
}

// 处理一级菜单选择
const handlePrimarySelect = (key) => {
  activePrimary.value = key
  
  // 根据选择的菜单项进行路由跳转
  switch (key) {
    case 'home':
      router.push('/home')
      break
    case 'user':
      router.push('/users')
      break
    case 'system':
      router.push('/system')
      break
    case 'current-exam':
      router.push('/exams/current')
      break
    case 'history-exam':
      router.push('/exams/history')
      break
    case 'create-exam':
      router.push('/exam/create')
      break
    case 'manage-exams':
      router.push('/exams/manage')
      break
    case 'question-bank':
      router.push('/questions')
      break
    case 'create-question':
      router.push('/questions/create')
      break
    default:
      // 其他菜单项可能由子菜单处理
      break
  }
}

// 当前页面名称
const currentPageName = computed(() => {
  // 根据当前路由返回对应的页面名称
  const path = router.currentRoute.value.path
  if (path.includes('/exam/create')) return '创建考试'
  if (path.includes('/paper/create')) return '创建试卷'
  if (path.includes('/users')) return '用户管理'
  if (path.includes('/system')) return '系统管理'
  if (path.includes('/questions') && !path.includes('/create')) return '试题库'
  if (path.includes('/questions/create')) return '创建试题'
  if (path.includes('/exams/current')) return '当前考试'
  if (path.includes('/exams/history')) return '历史考试'
  if (path.includes('/exams/manage')) return '管理考试'
  return ''
})

// 组件挂载时执行
onMounted(() => {
  // 检查是否为移动端
  checkMobile()
  // 监听窗口大小变化
  window.addEventListener('resize', checkMobile)
  
  // 加载数据
  fetchStatsData()
  fetchNotifications()
  fetchRecentExams()
})

// 组件卸载时执行
onUnmounted(() => {
  // 移除窗口大小变化监听
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-container {
  height: 100%;
}

.main-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar {
  background-color: #304156;
  overflow-y: auto;
  height: 100%;
  transition: all 0.3s ease;
}

.sidebar.mobile-open {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  height: 100vh;
}

.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
}

.logo-section {
  padding: 20px;
  background-color: #20222a;
  border-bottom: 1px solid #304156;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.logo-icon {
  color: #409eff;
}

.logo-text {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
}

.primary-menu {
  border-right: none;
}

.header {
  background-color: #ffffff;
  border-bottom: 1px solid #ebeef5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.collapse-btn {
  color: #606266;
  border: none;
  background: none;
  font-size: 18px;
}

.collapse-btn:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.notification-badge {
  position: relative;
}

.notification-count {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-content {
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f7fa;
  flex: 1;
}

.dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.welcome-section {
  margin-bottom: 10px;
}

.welcome-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  overflow: hidden;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.welcome-text h2 {
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 500;
}

.welcome-text p {
  margin: 0;
  opacity: 0.9;
}

.welcome-actions {
  display: flex;
  gap: 10px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12), 0 3px 6px rgba(0, 0, 0, 0.08);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.today-exams {
  background-color: #ecf5ff;
  color: #409eff;
}

.stat-icon.pending-scores {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-icon.total-users {
  background-color: #f0f9ff;
  color: #67c23a;
}

.stat-icon.total-questions {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 2px;
}

.stat-desc {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.trend-up {
  color: #67c23a;
}

.stat-trend.trend-down {
  color: #f56c6c;
}

.quick-actions-card,
.notification-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  color: #303133;
}

.action-item {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.action-item:hover {
  background-color: #ecf5ff;
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.action-icon.create-paper {
  background-color: #ecf5ff;
  color: #409eff;
}

.action-icon.create-exam {
  background-color: #f0f9ff;
  color: #67c23a;
}

.action-icon.add-question {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.action-icon.add-user {
  background-color: #fef0f0;
  color: #f56c6c;
}

.action-title {
  font-size: 14px;
  color: #303133;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #ecf5ff;
}

.notification-item.unread {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon.success {
  background-color: #f0f9ff;
  color: #67c23a;
}

.notification-icon.warning {
  background-color: #fdf6ec;
  color: #e6a23c;
}

.notification-icon.info {
  background-color: #ecf5ff;
  color: #409eff;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
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

.empty-notification {
  text-align: center;
  padding: 40px;
  color: #909399;
  font-size: 14px;
}

.recent-exams-card {
  margin-top: 20px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.exam-name {
  display: flex;
  align-items: center;
  gap: 6px;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 5px;
}

.exam-row-warning {
  background-color: #fdf6ec;
}

.exam-row-success {
  background-color: #f0f9ff;
}

.notification-drawer {
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.notification-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -260px;
    top: 0;
    height: 100vh;
    z-index: 1000;
  }
  
  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  
  .welcome-actions {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .header {
    padding: 0 10px;
  }
  
  .header-right {
    gap: 5px;
  }
  
  .username {
    display: none;
  }
  
  .main-content {
    padding: 10px;
  }
  
  .stat-content {
    flex-direction: column;
    text-align: center;
  }
}

/* 深色主题样式 */
:deep(.dark-theme) .home-container {
  background-color: #1a1a1a;
  color: #e0e0e0;
}

:deep(.dark-theme) .sidebar {
  background-color: #2d2d2d;
}

:deep(.dark-theme) .logo-section {
  background-color: #1e1e1e;
}

:deep(.dark-theme) .header {
  background-color: #2d2d2d;
  border-bottom-color: #404040;
}

:deep(.dark-theme) .main-content {
  background-color: #242424;
}

:deep(.dark-theme) .stat-number {
  color: #e0e0e0;
}

:deep(.dark-theme) .stat-label,
:deep(.dark-theme) .stat-desc {
  color: #a0a0a0;
}

/* 滚动条样式 */
.sidebar::-webkit-scrollbar,
.main-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track,
.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar::-webkit-scrollbar-thumb,
.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover,
.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 深色主题滚动条 */
:deep(.dark-theme) .sidebar::-webkit-scrollbar-track,
:deep(.dark-theme) .main-content::-webkit-scrollbar-track {
  background: #333333;
}

:deep(.dark-theme) .sidebar::-webkit-scrollbar-thumb,
:deep(.dark-theme) .main-content::-webkit-scrollbar-thumb {
  background: #666666;
}

:deep(.dark-theme) .sidebar::-webkit-scrollbar-thumb:hover,
:deep(.dark-theme) .main-content::-webkit-scrollbar-thumb:hover {
  background: #777777;
}
</style>
