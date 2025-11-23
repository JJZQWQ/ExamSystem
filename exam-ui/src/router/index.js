import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import AuthContainer from '../components/base/AuthContainer.vue'
import HomePage from '../components/base/HomePage.vue'  // 导入HomePage组件
// import Dashboard from '../components/home/Dashboard.vue'  // 注释掉Dashboard导入
import CreatePaper from '../components/home/CreatePaper.vue'
// import CreateExamAddPaper from '../components/home/CreateExamAddPaper.vue'
import AddPersonnel from '../components/home/AddPersonnel.vue'
import CreateExam from '../components/exam/CreateExam.vue'
import ExamInfoManagement from '../components/exam-management/ExamInfoManagement.vue'
import ExamScoreManagement from '../components/exam-management/ExamScoreManagement.vue'
import ExamPaperReview from '../components/exam/ExamPaperReview.vue'
import ExamAnalysis from '../components/exam-management/ExamAnalysis.vue'
import QuestionCategoryManagement from '../components/question-management/QuestionCategoryManagement.vue'
import QuestionBank from '../components/question-management/QuestionBank.vue'
import PaperBank from '../components/question-management/PaperBank.vue'
import PaperPreview from '../components/question/PaperPreview.vue'
import CreatePaperPage from '../components/question-management/CreatePaperPage.vue'
import StudentManagement from '../components/user-management/StudentManagement.vue'
import RoleManagement from '../components/system-management/RoleManagement.vue'
import CurrentExam from '../components/exam/CurrentExam.vue'
import HistoryExam from '../components/exam/HistoryExam.vue'

const routes = [
  {
    path: '/',
    redirect: '/home'  // 根路径重定向到/home
  },
  {
    path: '/login',  // 登录/注册路由
    name: 'Auth',
    component: AuthContainer
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,  // 使用HomePage替代Dashboard
    children: [
      {
        path: '',
        name: 'HomePage',
        component: () => import('../components/home/Dashboard.vue')  // 默认子路由使用Dashboard
      },
      {
        path: 'create-paper',
        name: 'CreatePaper',
        component: CreatePaper
      },
      {
        path: 'add-personnel',
        name: 'AddPersonnel',
        component: AddPersonnel
      },
      {
        path: 'examination',
        children: [
          {
            path: '',
            redirect: 'info'
          },
          {
            path: 'info',
            name: 'ExamInfoManagement',
            component: ExamInfoManagement
          },
          {
            path: 'create',
            name: 'CreateExam',
            component: CreateExam
          },
          {
            path: 'score',
            name: 'ExamScoreManagement',
            component: ExamScoreManagement
          },
          {
            path: 'review',
            name: 'ExamPaperReview',
            component: ExamPaperReview
          },
          {
            path: 'analysis',
            name: 'ExamAnalysis',
            component: ExamAnalysis
          }
        ]
      },
      {
        path: 'question',
        children: [
          {
            path: '',
            redirect: 'paper'
          },
          {
            path: 'category',
            name: 'QuestionCategoryManagement',
            component: QuestionCategoryManagement
          },
          {
            path: 'bank',
            name: 'QuestionBank',
            component: QuestionBank
          },
          {
            path: 'paper',
            name: 'PaperBank',
            component: PaperBank
          }
        ]
      },
      {
        path: 'user',
        children: [
          {
            path: '',
            redirect: 'student'
          },
          {
            path: 'student',
            name: 'StudentManagement',
            component: StudentManagement
          }
        ]
      },
      {
        path: 'system',
        children: [
          {
            path: '',
            redirect: 'role'
          },
          {
            path: 'role',
            name: 'RoleManagement',
            component: RoleManagement
          }
        ]
      },
      {
        path: 'exam',
        children: [
          {
            path: '',
            redirect: 'current'
          },
          {
            path: 'current',
            name: 'CurrentExam',
            component: CurrentExam
          },
          {
            path: 'history',
            name: 'HistoryExam',
            component: HistoryExam
          }
        ]
      }
    ]
  },
  {
    path: '/paper-preview',
    name: 'PaperPreview',
    component: PaperPreview
  },
  {
    path: '/exam-paper-review',
    name: 'ExamPaperReviewDirect',
    component: ExamPaperReview
  },
  {
    path: '/create-paper',
    name: 'CreatePaperPage',
    component: CreatePaperPage
  }
]

// 确保所有必要地导入路径正确
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫 - 检查认证状态
router.beforeEach((to, from, next) => {
  // 获取认证store实例
  const authStore = useAuthStore()
  
  // 不需要认证的路径
  const publicPaths = ['/login']
  const isPublicPath = publicPaths.includes(to.path)
  
  // 首先尝试从本地存储恢复认证状态
  authStore.checkAuth()
  
  // 如果是公共路径，直接放行
  if (isPublicPath) {
    // 如果已登录访问登录页，重定向到首页
    if (authStore.isAuthenticated) {
      next({ path: '/home' })
    } else {
      next()
    }
    return
  }
  
  // 对于需要认证的路径，检查登录状态
  if (!authStore.isAuthenticated) {
    ElMessage({
      message: '请先登录',
      type: 'warning',
      duration: 2000
    })
    // 保存当前路径，登录成功后可以跳转回原页面
    sessionStorage.setItem('redirectPath', to.fullPath)
    next({ path: '/login' })
    return
  }
  
  // 已认证用户，正常放行
  next()
})

// 监听认证过期事件
window.addEventListener('auth:session-expired', () => {
  const authStore = useAuthStore()
  // 清除认证状态
  authStore.logout()
  ElMessage({
    message: '登录已过期，请重新登录',
    type: 'warning',
    duration: 2000
  })
  router.push('/login')
})

export default router
