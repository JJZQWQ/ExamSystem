import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import HomePage from '../components/HomePage.vue'
import ExamInfoManagement from '../components/ExamInfoManagement.vue'
import CreateExam from '../components/CreateExam.vue'
import ExamScoreManagement from '../components/ExamScoreManagement.vue'
import ExamPaperReview from '../components/ExamPaperReview.vue'
import ExamAnalysis from '../components/ExamAnalysis.vue'
import QuestionCategoryManagement from '../components/question/QuestionCategoryManagement.vue'
import QuestionBank from '../components/QuestionBank.vue'
import PaperBank from '../components/question/PaperBank.vue'
import PaperPreview from '../components/question/PaperPreview.vue'
import CreatePaperPage from '../components/question/CreatePaperPage.vue'
import StudentManagement from '../components/user/StudentManagement.vue'
import RoleManagement from '../components/system/RoleManagement.vue'
import CurrentExam from '../components/CurrentExam.vue'
import HistoryExam from '../components/HistoryExam.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
    children: [
      {
        path: 'exam',
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
        path: 'examination',
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

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
