import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/base/LoginPage.vue'
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
    path: '/login',  // 添加专门的登录路由
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,  // 使用HomePage替代Dashboard
    children: [
      {
        path: '',
        name: 'HomePage',
        component: HomePage  // 默认子路由也使用HomePage
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

export default router
