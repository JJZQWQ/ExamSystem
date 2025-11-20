<template>
  <div class="exam-analysis">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><DataAnalysis /></el-icon>
        考试分析
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总考试数" :value="totalExams" />
        <el-statistic title="已分析" :value="analyzedExams" />
        <el-statistic title="待分析" :value="pendingExams" />
      </div>
    </div>

    <!-- 顶部操作栏 -->
    <div class="toolbar animate__animated animate__fadeInDown">
      <div class="toolbar-left">
        <el-button 
          type="primary" 
          size="large"
          @click="openExamSearch"
          class="action-btn"
        >
          <el-icon><Search /></el-icon>
          选择考试
        </el-button>
        <el-button 
          type="success" 
          size="large"
          @click="exportAnalysis"
          :disabled="!selectedExam"
          class="action-btn"
        >
          <el-icon><Download /></el-icon>
          导出分析
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索考试名称..."
          :prefix-icon="Search"
          class="search-input"
          clearable
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 默认显示所有考试列表 -->
    <el-card v-if="!selectedExam" class="exam-list-card animate__animated animate__fadeInUp">
      <div class="card-header">
        <h3>考试列表</h3>
        <div class="view-controls">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="table">表格视图</el-radio-button>
            <el-radio-button label="card">卡片视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="table-view">
        <el-table
          :data="filteredExams"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="考试名称" min-width="200" />
          <el-table-column prop="category" label="考试分类" width="120">
            <template #default="{ row }">
              <el-tag :type="getCategoryTagType(row.category)" size="small">
                {{ row.category }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalScore" label="总分" width="100" />
          <el-table-column prop="endTime" label="结束时间" width="180" />
          <el-table-column prop="creator" label="创建人" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusTagType(row.status)" size="small">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small"
                @click="selectExam(row)"
              >
                <el-icon><View /></el-icon>
                查看分析
              </el-button>
              <el-dropdown>
                <el-button type="info" size="small">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="viewExamDetail(row)">
                      <el-icon><Document /></el-icon>考试详情
                    </el-dropdown-item>
                    <el-dropdown-item @click="editExam(row)">
                      <el-icon><Edit /></el-icon>编辑考试
                    </el-dropdown-item>
                    <el-dropdown-item @click="duplicateExam(row)">
                      <el-icon><CopyDocument /></el-icon>复制考试
                    </el-dropdown-item>
                    <el-dropdown-item 
                      @click="deleteExam(row)"
                      divided
                    >
                      <el-icon><Delete /></el-icon>删除考试
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 卡片视图 -->
      <div v-else class="card-view">
        <el-row :gutter="20">
          <el-col 
            v-for="exam in filteredExams" 
            :key="exam.id"
            :span="8"
            style="margin-bottom: 20px"
          >
            <el-card class="exam-card" shadow="hover">
              <div class="card-header">
                <div class="exam-info">
                  <h4>{{ exam.name }}</h4>
                  <p>{{ exam.category }}</p>
                </div>
                <el-tag :type="getStatusTagType(exam.status)">
                  {{ getStatusText(exam.status) }}
                </el-tag>
              </div>
              
              <div class="card-content">
                <div class="info-item">
                  <el-icon><Trophy /></el-icon>
                  <span>总分：{{ exam.totalScore }}分</span>
                </div>
                <div class="info-item">
                  <el-icon><Calendar /></el-icon>
                  <span>结束：{{ exam.endTime }}</span>
                </div>
                <div class="info-item">
                  <el-icon><User /></el-icon>
                  <span>创建人：{{ exam.creator }}</span>
                </div>
              </div>
              
              <div class="card-footer">
                <el-button type="primary" size="small" @click="selectExam(exam)">
                  查看分析
                </el-button>
                <el-button type="info" size="small" @click="viewExamDetail(exam)">
                  详情
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 选中的考试分析内容 -->
    <div v-else class="analysis-content">
      <!-- 考试信息卡片 -->
      <el-card class="exam-info-card animate__animated animate__fadeInDown">
        <div class="exam-header">
          <div class="exam-title">
            <h2>{{ selectedExam.name }}</h2>
            <el-tag :type="getCategoryTagType(selectedExam.category)" size="large">
              {{ selectedExam.category }}
            </el-tag>
          </div>
          <el-button 
            type="primary" 
            @click="backToExamList"
            class="back-btn"
          >
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
        </div>
        
        <el-descriptions :column="4" border>
          <el-descriptions-item label="考试ID">{{ selectedExam.id }}</el-descriptions-item>
          <el-descriptions-item label="总分">{{ selectedExam.totalScore }}分</el-descriptions-item>
          <el-descriptions-item label="创建人">{{ selectedExam.creator }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ selectedExam.createTime }}</el-descriptions-item>
          <el-descriptions-item label="开始时间">{{ selectedExam.startTime }}</el-descriptions-item>
          <el-descriptions-item label="结束时间">{{ selectedExam.endTime }}</el-descriptions-item>
          <el-descriptions-item label="考试时长">{{ getExamDuration(selectedExam) }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTagType(selectedExam.status)">
              {{ getStatusText(selectedExam.status) }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-card>

      <!-- 分析选项卡 -->
      <el-card class="analysis-tabs-card animate__animated animate__fadeInUp">
        <el-tabs v-model="analysisTab" type="border-card">
          <el-tab-pane label="成绩统计" name="score">
            <div class="score-analysis">
              <!-- 统计概览 -->
              <div class="stats-overview">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-card class="stat-card">
                      <el-statistic title="参考人数" :value="scoreStats.totalStudents">
                        <template #suffix>
                          <el-icon><User /></el-icon>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card class="stat-card">
                      <el-statistic title="平均分" :value="scoreStats.averageScore" :precision="1">
                        <template #suffix>
                          <span style="color: #409eff">分</span>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card class="stat-card">
                      <el-statistic title="最高分" :value="scoreStats.maxScore">
                        <template #suffix>
                          <span style="color: #67c23a">分</span>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                  <el-col :span="6">
                    <el-card class="stat-card">
                      <el-statistic title="最低分" :value="scoreStats.minScore">
                        <template #suffix>
                          <span style="color: #f56c6c">分</span>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                </el-row>
              </div>

              <!-- 图表区域 -->
              <div class="charts-section">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-card class="chart-card">
                      <div class="chart-title">成绩分布图</div>
                      <div class="chart-placeholder">
                        <el-empty description="图表组件待集成" />
                      </div>
                    </el-card>
                  </el-col>
                  <el-col :span="12">
                    <el-card class="chart-card">
                      <div class="chart-title">班级对比图</div>
                      <div class="chart-placeholder">
                        <el-empty description="图表组件待集成" />
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>

              <!-- 成绩详情表格 -->
              <el-card class="score-table-card">
                <div class="table-header">
                  <h3>成绩详情</h3>
                  <div class="table-actions">
                    <el-input
                      v-model="scoreSearchKeyword"
                      placeholder="搜索学号或姓名..."
                      :prefix-icon="Search"
                      size="small"
                      style="width: 200px"
                      clearable
                    />
                  </div>
                </div>
                
                <el-table
                  :data="filteredScores"
                  stripe
                  style="width: 100%"
                  @selection-change="handleScoreSelection"
                >
                  <el-table-column type="selection" width="55" />
                  <el-table-column prop="studentId" label="学号" width="120" />
                  <el-table-column prop="name" label="姓名" width="120" />
                  <el-table-column prop="class" label="班级" width="180" />
                  <el-table-column prop="score" label="得分" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getScoreTagType(row.score)" size="small">
                        {{ row.score }}分
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="rank" label="排名" width="80" />
                  <el-table-column prop="submitTime" label="提交时间" width="180" />
                  <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                      <el-button 
                        type="primary" 
                        size="small"
                        @click="viewStudentPaper(row)"
                      >
                        查看试卷
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="试题分析" name="question">
            <div class="question-analysis">
              <!-- 试题统计概览 -->
              <div class="question-stats-overview">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-card class="stat-card">
                      <el-statistic title="总题数" :value="questionStats.totalQuestions">
                        <template #suffix>
                          <el-icon><Document /></el-icon>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="stat-card">
                      <el-statistic title="平均正确率" :value="questionStats.averageAccuracy" :precision="1">
                        <template #suffix>
                          <span style="color: #409eff">%</span>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                  <el-col :span="8">
                    <el-card class="stat-card">
                      <el-statistic title="难度系数" :value="questionStats.difficulty" :precision="2">
                        <template #suffix>
                          <span style="color: #e6a23c">级</span>
                        </template>
                      </el-statistic>
                    </el-card>
                  </el-col>
                </el-row>
              </div>

              <!-- 试题分析表格 -->
              <el-card class="question-table-card">
                <div class="table-header">
                  <h3>各题分析</h3>
                  <div class="table-actions">
                    <el-select v-model="questionFilter" placeholder="筛选题型" size="small" style="width: 120px">
                      <el-option label="全部" value="" />
                      <el-option label="单选题" value="single" />
                      <el-option label="多选题" value="multiple" />
                      <el-option label="判断题" value="judge" />
                      <el-option label="填空题" value="fill" />
                      <el-option label="简答题" value="essay" />
                    </el-select>
                  </div>
                </div>
                
                <el-table
                  :data="filteredQuestions"
                  stripe
                  style="width: 100%"
                >
                  <el-table-column prop="number" label="题号" width="80" />
                  <el-table-column prop="type" label="题型" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getQuestionTypeTagType(row.type)" size="small">
                        {{ row.type }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="content" label="题目内容" min-width="300" show-overflow-tooltip />
                  <el-table-column prop="fullScore" label="满分" width="80" />
                  <el-table-column prop="averageScore" label="平均得分" width="100" />
                  <el-table-column prop="accuracy" label="正确率" width="100">
                    <template #default="{ row }">
                      <el-progress 
                        :percentage="row.accuracy" 
                        :color="getAccuracyColor(row.accuracy)"
                        :stroke-width="6"
                      />
                    </template>
                  </el-table-column>
                  <el-table-column prop="difficulty" label="难度" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getDifficultyTagType(row.difficulty)" size="small">
                        {{ row.difficulty }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="120" fixed="right">
                    <template #default="{ row }">
                      <el-button 
                        type="primary" 
                        size="small"
                        @click="viewQuestionDetail(row)"
                      >
                        详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>

    <!-- 考试选择对话框 -->
    <el-dialog
      v-model="showExamSearchModal"
      title="选择考试"
      width="80%"
      :before-close="closeExamSearch"
      class="exam-search-dialog"
    >
      <div class="search-filters">
        <el-form :model="searchParams" inline>
          <el-form-item label="考试名称">
            <el-input
              v-model="searchParams.examName"
              placeholder="请输入考试名称"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="考试分类">
            <el-select 
              v-model="searchParams.category" 
              placeholder="全部分类"
              clearable
              style="width: 150px"
            >
              <el-option label="期末考试" value="期末考试" />
              <el-option label="期中考试" value="期中考试" />
              <el-option label="模拟考试" value="模拟考试" />
              <el-option label="随堂测试" value="随堂测试" />
            </el-select>
          </el-form-item>
          <el-form-item label="考试时间">
            <el-date-picker
              v-model="searchParams.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchExams">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <div class="search-results">
        <el-table
          :data="examList"
          stripe
          style="width: 100%"
          @selection-change="handleExamSelection"
          row-key="id"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="考试名称" min-width="200" />
          <el-table-column prop="category" label="考试分类" width="120" />
          <el-table-column prop="totalScore" label="总分" width="100" />
          <el-table-column prop="endTime" label="结束时间" width="180" />
          <el-table-column prop="creator" label="创建人" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
        </el-table>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeExamSearch">取消</el-button>
          <el-button 
            type="primary" 
            @click="confirmExamSelection" 
            :disabled="!selectedExamInModal"
          >
            确认选择
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataAnalysis,
  Search,
  Download,
  View,
  Document,
  Edit,
  Delete,
  CopyDocument,
  ArrowLeft,
  Trophy,
  Calendar,
  User,
  ArrowDown
} from '@element-plus/icons-vue'

// 响应式数据
const viewMode = ref('table')
const searchKeyword = ref('')
const scoreSearchKeyword = ref('')
const questionFilter = ref('')
const showExamSearchModal = ref(false)
const analysisTab = ref('score')
const selectedExam = ref(null)
const selectedExamInModal = ref(null)
const selectedExams = ref([])
const selectedScores = ref([])

// 搜索参数
const searchParams = reactive({
  examName: '',
  category: '',
  dateRange: null
})

// 考试列表数据
const examList = ref([
  {
    id: 1,
    name: 'Vue.js中级考试',
    category: '期末考试',
    totalScore: 100,
    startTime: '2023-06-15 14:00',
    endTime: '2023-06-15 16:00',
    creator: '张老师',
    createTime: '2023-06-01',
    status: 'completed'
  },
  {
    id: 2,
    name: 'React基础测试',
    category: '期中考试',
    totalScore: 120,
    startTime: '2023-06-14 10:00',
    endTime: '2023-06-14 11:30',
    creator: '李老师',
    createTime: '2023-05-28',
    status: 'completed'
  },
  {
    id: 3,
    name: 'Java编程实战',
    category: '模拟考试',
    totalScore: 100,
    startTime: '2023-06-16 09:30',
    endTime: '2023-06-16 11:30',
    creator: '王老师',
    createTime: '2023-06-05',
    status: 'in_progress'
  },
  {
    id: 4,
    name: '数据库原理考试',
    category: '期末考试',
    totalScore: 80,
    startTime: '2023-06-10 14:00',
    endTime: '2023-06-10 16:00',
    creator: '赵老师',
    createTime: '2023-05-25',
    status: 'completed'
  }
])

// 成绩统计数据
const scoreStats = reactive({
  totalStudents: 120,
  averageScore: 78.5,
  maxScore: 95,
  minScore: 42
})

// 试题统计数据
const questionStats = reactive({
  totalQuestions: 30,
  averageAccuracy: 75.6,
  difficulty: 2.8
})

// 成绩详情数据
const scoreDetails = ref([
  {
    studentId: '2023001',
    name: '张三',
    class: '计算机2023级1班',
    score: 85,
    rank: 15,
    submitTime: '2023-06-15 15:45:30'
  },
  {
    studentId: '2023002',
    name: '李四',
    class: '计算机2023级1班',
    score: 92,
    rank: 3,
    submitTime: '2023-06-15 15:30:15'
  },
  {
    studentId: '2023003',
    name: '王五',
    class: '计算机2023级2班',
    score: 78,
    rank: 32,
    submitTime: '2023-06-15 15:50:45'
  }
])

// 试题分析数据
const questionDetails = ref([
  {
    number: 1,
    type: '单选题',
    content: 'Vue.js的核心特性包括哪些？',
    fullScore: 2,
    averageScore: 1.8,
    accuracy: 90,
    difficulty: '简单'
  },
  {
    number: 2,
    type: '单选题',
    content: 'React Hooks的主要优势是什么？',
    fullScore: 2,
    averageScore: 1.5,
    accuracy: 75,
    difficulty: '中等'
  },
  {
    number: 3,
    type: '多选题',
    content: 'JavaScript的异步处理方式有哪些？',
    fullScore: 3,
    averageScore: 2.1,
    accuracy: 70,
    difficulty: '中等'
  }
])

// 计算属性
const totalExams = computed(() => examList.value.length)

const analyzedExams = computed(() => 
  examList.value.filter(exam => exam.status === 'completed').length
)

const pendingExams = computed(() => 
  examList.value.filter(exam => exam.status === 'in_progress').length
)

const filteredExams = computed(() => {
  if (!searchKeyword.value) return examList.value
  return examList.value.filter(exam => 
    exam.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

const filteredScores = computed(() => {
  if (!scoreSearchKeyword.value) return scoreDetails.value
  return scoreDetails.value.filter(score => 
    score.studentId.toLowerCase().includes(scoreSearchKeyword.value.toLowerCase()) ||
    score.name.toLowerCase().includes(scoreSearchKeyword.value.toLowerCase())
  )
})

const filteredQuestions = computed(() => {
  if (!questionFilter.value) return questionDetails.value
  return questionDetails.value.filter(question => 
    question.type === questionFilter.value
  )
})

// 辅助函数
const getCategoryTagType = (category) => {
  const typeMap = {
    '期末考试': 'danger',
    '期中考试': 'warning',
    '模拟考试': 'success',
    '随堂测试': 'info'
  }
  return typeMap[category] || 'info'
}

const getStatusTagType = (status) => {
  return status === 'completed' ? 'success' : 'warning'
}

const getStatusText = (status) => {
  return status === 'completed' ? '已完成' : '进行中'
}

const getScoreTagType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 80) return 'primary'
  if (score >= 60) return 'warning'
  return 'danger'
}

const getQuestionTypeTagType = (type) => {
  const typeMap = {
    '单选题': 'primary',
    '多选题': 'success',
    '判断题': 'warning',
    '填空题': 'info',
    '简答题': 'danger'
  }
  return typeMap[type] || 'info'
}

const getDifficultyTagType = (difficulty) => {
  const typeMap = {
    '简单': 'success',
    '中等': 'warning',
    '困难': 'danger'
  }
  return typeMap[difficulty] || 'info'
}

const getAccuracyColor = (accuracy) => {
  if (accuracy >= 90) return '#67c23a'
  if (accuracy >= 70) return '#409eff'
  if (accuracy >= 50) return '#e6a23c'
  return '#f56c6c'
}

const getExamDuration = (exam) => {
  const start = new Date(exam.startTime)
  const end = new Date(exam.endTime)
  const duration = (end - start) / (1000 * 60) // 分钟
  return `${Math.floor(duration / 60)}小时${duration % 60}分钟`
}

// 事件处理函数
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const handleSelectionChange = (selection) => {
  selectedExams.value = selection
}

const handleExamSelection = (selection) => {
  selectedExamInModal.value = selection[0]
}

const handleScoreSelection = (selection) => {
  selectedScores.value = selection
}

const openExamSearch = () => {
  showExamSearchModal.value = true
  selectedExamInModal.value = null
}

const closeExamSearch = () => {
  showExamSearchModal.value = false
}

const confirmExamSelection = () => {
  if (selectedExamInModal.value) {
    selectedExam.value = selectedExamInModal.value
    closeExamSearch()
  }
}

const selectExam = (exam) => {
  selectedExam.value = exam
}

const backToExamList = () => {
  selectedExam.value = null
}

const searchExams = () => {
  ElMessage.success('搜索完成')
}

const resetSearch = () => {
  searchParams.examName = ''
  searchParams.category = ''
  searchParams.dateRange = null
}

const exportAnalysis = () => {
  ElMessage.success('分析报告导出成功')
}

const viewExamDetail = (exam) => {
  ElMessage.info(`查看考试 ${exam.name} 的详细信息`)
}

const editExam = (exam) => {
  ElMessage.info(`编辑考试 ${exam.name}`)
}

const duplicateExam = (exam) => {
  ElMessage.info(`复制考试 ${exam.name}`)
}

const deleteExam = (exam) => {
  ElMessageBox.confirm(
    `确定要删除考试 ${exam.name} 吗？`,
    '删除考试',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = examList.value.findIndex(e => e.id === exam.id)
    if (index !== -1) {
      examList.value.splice(index, 1)
      ElMessage.success('考试删除成功')
    }
  })
}

const viewStudentPaper = (student) => {
  ElMessage.info(`查看学生 ${student.name} 的试卷`)
}

const viewQuestionDetail = (question) => {
  ElMessage.info(`查看题目 ${question.number} 的详细分析`)
}

// 组件挂载
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.exam-analysis {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 120px);
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.page-stats {
  display: flex;
  gap: 32px;
}

.page-stats :deep(.el-statistic__head) {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

.page-stats :deep(.el-statistic__content) {
  color: white;
  font-size: 24px;
  font-weight: 700;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.toolbar-left {
  display: flex;
  gap: 12px;
}

.action-btn {
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.search-input {
  width: 300px;
}

/* 卡片样式 */
.exam-list-card,
.analysis-tabs-card,
.exam-info-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

/* 考试卡片 */
.exam-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.exam-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.exam-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.exam-info h4 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.exam-info p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.card-content {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #606266;
  font-size: 14px;
}

.card-footer {
  display: flex;
  gap: 8px;
}

/* 考试信息 */
.exam-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.exam-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.exam-title h2 {
  margin: 0;
  color: #303133;
  font-size: 24px;
  font-weight: 700;
}

/* 分析内容 */
.score-analysis,
.question-analysis {
  padding: 20px 0;
}

.stats-overview,
.question-stats-overview {
  margin-bottom: 32px;
}

.stat-card {
  text-align: center;
  border-radius: 8px;
}

.charts-section {
  margin-bottom: 32px;
}

.chart-card {
  height: 320px;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.chart-placeholder {
  height: 240px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 表格样式 */
.score-table-card,
.question-table-card {
  margin-top: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.table-actions {
  display: flex;
  gap: 12px;
}

/* 对话框样式 */
:deep(.exam-search-dialog .el-dialog) {
  border-radius: 16px;
}

:deep(.exam-search-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
}

:deep(.exam-search-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.exam-search-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

.search-filters {
  margin-bottom: 24px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.search-results {
  max-height: 400px;
  overflow-y: auto;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-stats {
    gap: 20px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .exam-analysis {
    padding: 16px;
  }
  
  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-stats {
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
  
  .toolbar-left {
    flex-direction: column;
    gap: 8px;
  }
  
  .exam-header {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
  
  .exam-card {
    margin-bottom: 16px;
  }
}
</style>