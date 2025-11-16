import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import HomePage from '../components/HomePage.vue'
import ExamInfoManagement from '../components/ExamInfoManagement.vue'
import CreateExam from '../components/CreateExam.vue'
import ExamScoreManagement from '../components/ExamScoreManagement.vue'
import ExamPaperReview from '../components/ExamPaperReview.vue'
import ExamAnalysis from '../components/ExamAnalysis.vue'
import QuestionCategoryManagement from '../components/QuestionCategoryManagement.vue'
import QuestionBank from '../components/QuestionBank.vue'
import PaperBank from '../components/PaperBank.vue'
import PaperPreview from '../components/PaperPreview.vue'
import CreatePaperPage from '../components/CreatePaperPage.vue'

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