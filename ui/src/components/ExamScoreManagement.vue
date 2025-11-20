<template>
  <div class="score-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><DataAnalysis /></el-icon>
        成绩管理
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总考试数" :value="totalExams" />
        <el-statistic title="待批阅" :value="pendingCount" />
        <el-statistic title="已批阅" :value="completedCount" />
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
          :disabled="!selectedExam"
          @click="exportScores"
          class="action-btn"
        >
          <el-icon><Download /></el-icon>
          导出成绩
        </el-button>
        <el-button 
          type="warning" 
          size="large"
          :disabled="!selectedExam"
          @click="batchGrade"
          class="action-btn"
        >
          <el-icon><EditPen /></el-icon>
          批量批阅
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索学生姓名或学号..."
          :prefix-icon="Search"
          class="search-input"
          clearable
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 默认显示所有考试列表 -->
    <div v-if="!selectedExam" class="exam-list-container animate__animated animate__fadeInUp">
      <div class="section-header">
        <h2>所有考试</h2>
        <el-radio-group v-model="viewMode" size="large">
          <el-radio-button label="table">表格视图</el-radio-button>
          <el-radio-button label="card">卡片视图</el-radio-button>
        </el-radio-group>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="table-view">
        <el-table
          :data="filteredExamList"
          stripe
          style="width: 100%"
          @selection-change="handleExamSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="考试名称" min-width="200" />
          <el-table-column prop="category" label="考试分类" width="120">
            <template #default="{ row }">
              <el-tag :type="getCategoryType(row.category)">{{ row.category }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="totalScore" label="总分" width="100" />
          <el-table-column prop="endTime" label="结束时间" width="180" />
          <el-table-column prop="creator" label="创建人" width="120" />
          <el-table-column prop="createTime" label="创建时间" width="180" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small"
                @click="selectExam(row)"
              >
                查看成绩
              </el-button>
              <el-dropdown>
                <el-button type="info" size="small">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="viewExamStats(row)">
                      <el-icon><DataAnalysis /></el-icon>统计分析
                    </el-dropdown-item>
                    <el-dropdown-item @click="exportExamScores(row)">
                      <el-icon><Download /></el-icon>导出成绩
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
            v-for="exam in filteredExamList" 
            :key="exam.id"
            :span="8"
            style="margin-bottom: 20px"
          >
            <el-card class="exam-card" shadow="hover" @click="selectExam(exam)">
              <div class="card-header">
                <h3>{{ exam.name }}</h3>
                <el-tag :type="getCategoryType(exam.category)">{{ exam.category }}</el-tag>
              </div>
              <div class="card-content">
                <div class="info-item">
                  <el-icon><User /></el-icon>
                  <span>创建人：{{ exam.creator }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Timer /></el-icon>
                  <span>结束时间：{{ exam.endTime }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Star /></el-icon>
                  <span>总分：{{ exam.totalScore }}</span>
                </div>
              </div>
              <div class="card-footer">
                <el-button type="primary" size="small" @click.stop="selectExam(exam)">
                  查看成绩
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    
    <!-- 选中的考试信息 -->
    <div v-else class="exam-details-container animate__animated animate__fadeInUp">
      <!-- 考试信息卡片 -->
      <el-card class="exam-info-card">
        <div class="exam-info">
          <div class="info-grid">
            <div class="info-item">
              <label>考试名称</label>
              <span>{{ selectedExam.name }}</span>
            </div>
            <div class="info-item">
              <label>创建人</label>
              <span>{{ selectedExam.creator }}</span>
            </div>
            <div class="info-item">
              <label>开始时间</label>
              <span>{{ selectedExam.startTime }}</span>
            </div>
            <div class="info-item">
              <label>结束时间</label>
              <span>{{ selectedExam.endTime }}</span>
            </div>
            <div class="info-item">
              <label>总分</label>
              <span>{{ selectedExam.totalScore }}</span>
            </div>
            <div class="info-item">
              <label>参考人数</label>
              <span>{{ studentScores.length }}</span>
            </div>
          </div>
        </div>
      </el-card>
      
      <!-- 成绩统计图表 -->
      <el-card class="stats-card">
        <div class="stats-header">
          <h3>成绩统计</h3>
        </div>
        <div class="stats-content">
          <el-row :gutter="20">
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ averageScore }}</div>
                <div class="stat-label">平均分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ highestScore }}</div>
                <div class="stat-label">最高分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ lowestScore }}</div>
                <div class="stat-label">最低分</div>
              </div>
            </el-col>
            <el-col :span="6">
              <div class="stat-item">
                <div class="stat-value">{{ passRate }}%</div>
                <div class="stat-label">及格率</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
      
      <!-- 学生成绩表格 -->
      <el-card class="score-table-card">
        <div class="table-header">
          <h3>学生成绩明细</h3>
          <div class="table-actions">
            <el-button type="success" size="small" @click="batchGrade">
              批量批阅
            </el-button>
            <el-button type="primary" size="small" @click="exportScores">
              导出成绩
            </el-button>
          </div>
        </div>
        
        <el-table
          :data="filteredStudentScores"
          stripe
          style="width: 100%"
          @selection-change="handleStudentSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="学号" width="120" />
          <el-table-column prop="name" label="姓名" width="100" />
          <el-table-column prop="class" label="班级" min-width="150" />
          <el-table-column prop="score" label="得分" width="100">
            <template #default="{ row }">
              <span :class="getScoreClass(row.score)">{{ row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitTime" label="提交时间" width="180" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small"
                @click="viewPaper(row)"
              >
                查看详情
              </el-button>
              <el-button 
                v-if="row.status === '待批阅'"
                type="success" 
                size="small"
                @click="gradePaper(row)"
              >
                批阅
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredStudentScores.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
      
      <!-- 返回按钮 -->
      <div class="form-actions">
        <el-button size="large" @click="backToExamList">
          <el-icon><ArrowLeft /></el-icon>
          返回考试列表
        </el-button>
      </div>
    </div>
    
    <!-- 考试搜索对话框 -->
    <el-dialog
      v-model="showExamSearchModal"
      title="选择考试"
      width="80%"
      :before-close="closeExamSearch"
      class="exam-search-dialog"
    >
      <div class="search-content">
        <!-- 搜索条件 -->
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
        
        <!-- 搜索结果 -->
        <div class="search-results">
          <el-table
            :data="filteredExamList"
            @selection-change="handleExamSelectionChange"
            highlight-current-row
            @current-change="selectExamInModal"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="考试名称" min-width="200" />
            <el-table-column prop="category" label="考试分类" width="120">
              <template #default="{ row }">
                <el-tag :type="getCategoryType(row.category)">{{ row.category }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="totalScore" label="总分" width="100" />
            <el-table-column prop="endTime" label="结束时间" width="180" />
            <el-table-column prop="creator" label="创建人" width="120" />
            <el-table-column prop="createTime" label="创建时间" width="180" />
          </el-table>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataAnalysis,
  Search,
  Download,
  EditPen,
  User,
  Timer,
  Star,
  ArrowLeft,
  ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const showExamSearchModal = ref(false)
const viewMode = ref('table')
const searchKeyword = ref('')
const selectedExam = ref(null)
const selectedExamInModal = ref(null)
const selectedExams = ref([])
const selectedStudents = ref([])
const currentPage = ref(1)
const pageSize = ref(20)

// 搜索参数
const searchParams = ref({
  examName: '',
  category: '',
  dateRange: []
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
    createTime: '2023-06-01'
  },
  {
    id: 2,
    name: 'React基础测试',
    category: '期中考试',
    totalScore: 120,
    startTime: '2023-06-14 10:00',
    endTime: '2023-06-14 11:30',
    creator: '李老师',
    createTime: '2023-05-28'
  },
  {
    id: 3,
    name: 'Java编程实战',
    category: '模拟考试',
    totalScore: 100,
    startTime: '2023-06-16 09:30',
    endTime: '2023-06-16 11:30',
    creator: '王老师',
    createTime: '2023-06-05'
  },
  {
    id: 4,
    name: '数据库原理考试',
    category: '期末考试',
    totalScore: 80,
    startTime: '2023-06-10 14:00',
    endTime: '2023-06-10 16:00',
    creator: '赵老师',
    createTime: '2023-05-25'
  }
])

// 学生成绩数据
const studentScores = ref([
  {
    id: '2023001',
    name: '张三',
    class: '计算机2023级1班',
    score: 85,
    submitTime: '2023-06-15 15:30',
    status: '已批阅',
    statusClass: 'completed'
  },
  {
    id: '2023002',
    name: '李四',
    class: '计算机2023级1班',
    score: 92,
    submitTime: '2023-06-15 15:45',
    status: '已批阅',
    statusClass: 'completed'
  },
  {
    id: '2023003',
    name: '王五',
    class: '计算机2023级2班',
    score: 78,
    submitTime: '2023-06-15 15:50',
    status: '待批阅',
    statusClass: 'pending'
  },
  {
    id: '2023004',
    name: '赵六',
    class: '软件2023级1班',
    score: 88,
    submitTime: '2023-06-15 15:55',
    status: '已批阅',
    statusClass: 'completed'
  },
  {
    id: '2023005',
    name: '钱七',
    class: '软件2023级2班',
    score: 95,
    submitTime: '2023-06-15 16:00',
    status: '已批阅',
    statusClass: 'completed'
  }
])

// 计算属性
const totalExams = computed(() => examList.value.length)

const pendingCount = computed(() => {
  return studentScores.value.filter(student => student.status === '待批阅').length
})

const completedCount = computed(() => {
  return studentScores.value.filter(student => student.status === '已批阅').length
})

const filteredExamList = computed(() => {
  let filtered = examList.value
  
  if (searchParams.value.examName) {
    filtered = filtered.filter(exam => 
      exam.name.toLowerCase().includes(searchParams.value.examName.toLowerCase())
    )
  }
  
  if (searchParams.value.category) {
    filtered = filtered.filter(exam => exam.category === searchParams.value.category)
  }
  
  return filtered
})

const filteredStudentScores = computed(() => {
  let filtered = studentScores.value
  
  if (searchKeyword.value) {
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      student.id.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  return filtered
})

const averageScore = computed(() => {
  const scores = studentScores.value.map(s => s.score)
  return scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0
})

const highestScore = computed(() => {
  const scores = studentScores.value.map(s => s.score)
  return scores.length ? Math.max(...scores) : 0
})

const lowestScore = computed(() => {
  const scores = studentScores.value.map(s => s.score)
  return scores.length ? Math.min(...scores) : 0
})

const passRate = computed(() => {
  const passed = studentScores.value.filter(s => s.score >= 60).length
  return studentScores.value.length ? Math.round((passed / studentScores.value.length) * 100) : 0
})

// 事件处理函数
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const getCategoryType = (category) => {
  const types = {
    '期末考试': 'danger',
    '期中考试': 'warning',
    '模拟考试': 'info'
  }
  return types[category] || 'primary'
}

const getStatusType = (status) => {
  return status === '已批阅' ? 'success' : 'warning'
}

const getScoreClass = (score) => {
  if (score >= 90) return 'score-excellent'
  if (score >= 80) return 'score-good'
  if (score >= 60) return 'score-pass'
  return 'score-fail'
}

const openExamSearch = () => {
  showExamSearchModal.value = true
  selectedExamInModal.value = null
}

const closeExamSearch = () => {
  showExamSearchModal.value = false
}

const selectExamInModal = (exam) => {
  selectedExamInModal.value = exam
}

const confirmExamSelection = () => {
  selectedExam.value = selectedExamInModal.value
  closeExamSearch()
}

const selectExam = (exam) => {
  selectedExam.value = exam
}

const backToExamList = () => {
  selectedExam.value = null
}

const viewPaper = (student) => {
  router.push('/exam-paper-review')
}

const gradePaper = (student) => {
  router.push('/exam-paper-review')
}

const handleExamSelectionChange = (selection) => {
  selectedExams.value = selection
}

const handleStudentSelectionChange = (selection) => {
  selectedStudents.value = selection
}

const handleSizeChange = (size) => {
  pageSize.value = size
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

const searchExams = () => {
  ElMessage.success('搜索完成')
}

const resetSearch = () => {
  searchParams.value = {
    examName: '',
    category: '',
    dateRange: []
  }
}

const exportScores = () => {
  ElMessage.success('成绩导出成功')
}

const batchGrade = () => {
  if (selectedStudents.value.length === 0) {
    ElMessage.warning('请选择要批阅的学生')
    return
  }
  ElMessageBox.confirm(
    `确定要批量批阅选中的 ${selectedStudents.value.length} 份试卷吗？`,
    '批量批阅',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('批量批阅成功')
  })
}

const viewExamStats = (exam) => {
  ElMessage.info('查看考试统计分析')
}

const exportExamScores = (exam) => {
  ElMessage.success(`${exam.name} 成绩导出成功`)
}

// 组件挂载
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.score-management {
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

/* 考试列表容器 */
.exam-list-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
}

/* 卡片视图 */
.card-view {
  margin-top: 20px;
}

.exam-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.exam-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
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
  text-align: right;
}

/* 考试详情容器 */
.exam-details-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.exam-info-card,
.stats-card,
.score-table-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.exam-info {
  padding: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-grid .info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-grid .info-item label {
  font-weight: 600;
  color: #909399;
  font-size: 14px;
}

.info-grid .info-item span {
  color: #303133;
  font-size: 16px;
  font-weight: 500;
}

/* 统计卡片 */
.stats-header {
  margin-bottom: 20px;
}

.stats-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.stats-content {
  padding: 8px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #409eff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

/* 成绩表格 */
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
  gap: 8px;
}

.score-excellent {
  color: #67c23a;
  font-weight: 700;
}

.score-good {
  color: #409eff;
  font-weight: 600;
}

.score-pass {
  color: #e6a23c;
  font-weight: 500;
}

.score-fail {
  color: #f56c6c;
  font-weight: 600;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
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

.search-content {
  max-height: 60vh;
  overflow-y: auto;
}

.search-filters {
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 20px;
}

.search-results {
  margin-top: 20px;
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
  
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .score-management {
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
  
  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .table-actions {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .exam-card {
    margin-bottom: 16px;
  }
}
</style>