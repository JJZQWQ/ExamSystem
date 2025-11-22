<template>
  <div class="exam-info-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><Management /></el-icon>
        考试信息管理
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总考试数" :value="totalExams" />
        <el-statistic title="进行中" :value="runningExams" />
        <el-statistic title="已完成" :value="completedExams" />
      </div>
    </div>

    <!-- 顶部操作栏 -->
    <div class="toolbar animate__animated animate__fadeInDown">
      <div class="toolbar-left">
        <el-button
          type="primary"
          size="large"
          @click="$router.push('/home/exam/create')"
          class="action-btn"
        >
          <el-icon><Plus /></el-icon>
          创建考试
        </el-button>
        <el-button
          type="success"
          size="large"
          @click="handleExportExams"
          class="action-btn"
        >
          <el-icon><Download /></el-icon>
          导出考试
        </el-button>
        <el-button
          type="danger"
          size="large"
          @click="handleBatchDelete"
          :disabled="selectedExams.length === 0"
          class="action-btn"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
      <div class="toolbar-right">
        <div class="search-filters">
          <el-select
            v-model="filters.category"
            placeholder="考试分类"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option label="期末考试" value="final" />
            <el-option label="期中考试" value="midterm" />
            <el-option label="模拟考试" value="mock" />
          </el-select>

          <el-select
            v-model="filters.status"
            placeholder="状态"
            clearable
            class="filter-select"
          >
            <el-option label="全部" value="" />
            <el-option label="进行中" value="running" />
            <el-option label="已结束" value="completed" />
            <el-option label="未开始" value="pending" />
          </el-select>

          <el-input
            v-model="filters.searchText"
            placeholder="搜索考试名称..."
            :prefix-icon="Search"
            class="search-input"
            clearable
            @input="handleSearch"
          />
        </div>
      </div>
    </div>

    <!-- 主内容表格区 -->
    <div class="table-container animate__animated animate__fadeInUp">
      <el-table
        :data="filteredExamList"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick"
        stripe
        highlight-current-row
        empty-text="暂无考试数据"
      >
        <el-table-column type="selection" width="80" align="center" />

        <el-table-column prop="name" label="考试名称" width="220" align="left">
          <template #default="scope">
            <div class="exam-name">
              <el-icon class="exam-icon"><Document /></el-icon>
              <div class="exam-info">
                <div class="name">{{ scope.row.name }}</div>
                <div class="category">{{ scope.row.category }}</div>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="subject" label="科目" width="120" align="center">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.subject }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="考试时间" width="180" align="center">
          <template #default="scope">
            <div class="exam-time">
              <div class="time-item">
                <el-icon><Clock /></el-icon>
                <span>{{ scope.row.startTime }}</span>
              </div>
              <div class="time-item">
                <el-icon><Clock /></el-icon>
                <span>{{ scope.row.endTime }}</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="participants" label="参与人数" width="100" align="center">
          <template #default="scope">
            <el-statistic :value="scope.row.participants" suffix="人" />
          </template>
        </el-table-column>

        <el-table-column prop="creator" label="创建人" width="120" align="center">
          <template #default="scope">
            <div class="creator-info">
              <el-avatar :size="24" :src="scope.row.creatorAvatar">{{ scope.row.creator.charAt(0) }}</el-avatar>
              <span>{{ scope.row.creator }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="140" align="center" />

        <el-table-column prop="status" label="状态" width="120" align="center">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
              effect="light"
              size="small"
              class="status-tag"
            >
              <el-icon><component :is="getStatusIcon(scope.row.status)" /></el-icon>
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220" align="center">
          <template #default="scope">
            <div class="action-buttons">
              <el-tooltip content="配置考试" placement="top">
                <el-button
                  type="primary"
                  size="small"
                  circle
                  @click.stop="handleConfigExam(scope.row)"
                >
                  <el-icon><Setting /></el-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip content="统计分析" placement="top">
                <el-button
                  type="success"
                  size="small"
                  circle
                  @click.stop="handleAnalyzeExam(scope.row)"
                >
                  <el-icon><TrendCharts /></el-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip content="成绩批改" placement="top">
                <el-button
                  type="warning"
                  size="small"
                  circle
                  @click.stop="handleGradeExam(scope.row)"
                  :disabled="scope.row.status !== '已完成'"
                >
                  <el-icon><EditPen /></el-icon>
                </el-button>
              </el-tooltip>

              <el-tooltip content="试卷预览" placement="top">
                <el-button
                  type="info"
                  size="small"
                  circle
                  @click.stop="handlePreviewExam(scope.row)"
                >
                  <el-icon><View /></el-icon>
                </el-button>
              </el-tooltip>

              <el-dropdown trigger="click" @command="(command) => handleMoreAction(command, scope.row)">
                <el-button size="small" circle>
                  <el-icon><MoreFilled /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="edit">
                      <el-icon><Edit /></el-icon>编辑考试
                    </el-dropdown-item>
                    <el-dropdown-item command="copy">
                      <el-icon><CopyDocument /></el-icon>复制考试
                    </el-dropdown-item>
                    <el-dropdown-item command="export">
                      <el-icon><Download /></el-icon>导出数据
                    </el-dropdown-item>
                    <el-dropdown-item divided command="delete">
                      <el-icon><Delete /></el-icon>删除考试
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Management,
  Plus,
  Download,
  Delete,
  Search,
  Document,
  Clock,
  Setting,
  TrendCharts,
  EditPen,
  View,
  MoreFilled,
  Edit,
  CopyDocument,
  Timer,
  SuccessFilled,
  Warning,
  InfoFilled
} from '@element-plus/icons-vue'

// 响应式数据
const selectedExams = ref([])

// 过滤条件
const filters = reactive({
  category: '',
  status: '',
  searchText: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 20,
  total: 0
})

// 考试列表数据
const examList = ref([
  {
    id: 1,
    name: 'Vue.js中级考试',
    subject: '前端开发',
    category: '期末考试',
    startTime: '2023-06-15 14:00',
    endTime: '2023-06-15 16:00',
    participants: 45,
    creator: '张老师',
    creatorAvatar: '',
    createTime: '2023-06-01',
    status: '进行中'
  },
  {
    id: 2,
    name: 'React基础测试',
    subject: '前端开发',
    category: '期中考试',
    startTime: '2023-06-14 10:00',
    endTime: '2023-06-14 11:30',
    participants: 32,
    creator: '李老师',
    creatorAvatar: '',
    createTime: '2023-05-28',
    status: '已完成'
  },
  {
    id: 3,
    name: 'Java编程实战',
    subject: '后端开发',
    category: '期末考试',
    startTime: '2023-06-16 09:30',
    endTime: '2023-06-16 11:30',
    participants: 28,
    creator: '王老师',
    creatorAvatar: '',
    createTime: '2023-06-05',
    status: '未开始'
  },
  {
    id: 4,
    name: '数据库原理考试',
    subject: '数据库',
    category: '期中考试',
    startTime: '2023-06-10 14:00',
    endTime: '2023-06-10 16:00',
    participants: 56,
    creator: '赵老师',
    creatorAvatar: '',
    createTime: '2023-05-25',
    status: '已完成'
  },
  {
    id: 5,
    name: 'Python数据分析',
    subject: '数据科学',
    category: '模拟考试',
    startTime: '2023-06-18 10:00',
    endTime: '2023-06-18 12:00',
    participants: 38,
    creator: '陈老师',
    creatorAvatar: '',
    createTime: '2023-06-08',
    status: '未开始'
  }
])

// 计算属性
const totalExams = computed(() => examList.value.length)
const runningExams = computed(() => examList.value.filter(exam => exam.status === '进行中').length)
const completedExams = computed(() => examList.value.filter(exam => exam.status === '已完成').length)

const filteredExamList = computed(() => {
  let filtered = examList.value

  if (filters.category) {
    filtered = filtered.filter(exam => exam.category === filters.category)
  }

  if (filters.status) {
    filtered = filtered.filter(exam => exam.status === filters.status)
  }

  if (filters.searchText) {
    const searchText = filters.searchText.toLowerCase()
    filtered = filtered.filter(exam =>
      exam.name.toLowerCase().includes(searchText) ||
      exam.subject.toLowerCase().includes(searchText)
    )
  }

  pagination.total = filtered.length
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filtered.slice(start, end)
})

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '进行中': 'success',
    '已完成': 'info',
    '未开始': 'warning'
  }
  return typeMap[status] || 'info'
}

// 获取状态图标
const getStatusIcon = (status) => {
  const iconMap = {
    '进行中': Timer,
    '已完成': SuccessFilled,
    '未开始': Warning
  }
  return iconMap[status] || InfoFilled
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

// 事件处理函数
const handleExportExams = () => {
  ElMessage.success('导出功能开发中...')
}

const handleBatchDelete = () => {
  if (selectedExams.value.length === 0) {
    ElMessage.warning('请选择要删除的考试')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedExams.value.length} 个考试吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    selectedExams.value = []
  }).catch(() => {})
}

const handleSelectionChange = (selection) => {
  selectedExams.value = selection
}

const handleRowClick = (row) => {
  ElMessage.info(`查看考试详情: ${row.name}`)
}

const handleSearch = () => {
  pagination.currentPage = 1
}

const handleConfigExam = (exam) => {
  ElMessage.info(`配置考试: ${exam.name}`)
}

const handleAnalyzeExam = (exam) => {
  ElMessage.info(`分析考试: ${exam.name}`)
}

const handleGradeExam = (exam) => {
  ElMessage.info(`批改考试: ${exam.name}`)
}

const handlePreviewExam = (exam) => {
  ElMessage.info(`预览考试: ${exam.name}`)
}

const handleMoreAction = (command, exam) => {
  switch (command) {
    case 'edit':
      handleEditExam(exam)
      break
    case 'copy':
      handleCopyExam(exam)
      break
    case 'export':
      handleExportExam(exam)
      break
    case 'delete':
      handleDeleteExam(exam)
      break
  }
}

const handleEditExam = (exam) => {
  ElMessage.info(`编辑考试: ${exam.name}`)
}

const handleCopyExam = (exam) => {
  ElMessage.success(`复制考试: ${exam.name}`)
}

const handleExportExam = (exam) => {
  ElMessage.success(`导出考试: ${exam.name}`)
}

const handleDeleteExam = (exam) => {
  ElMessageBox.confirm(
    `确定要删除考试 "${exam.name}" 吗？`,
    '删除考试',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
}

// 组件挂载
onMounted(() => {
  pagination.total = examList.value.length
})
</script>

<style scoped>
.exam-info-management {
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

.search-filters {
  display: flex;
  gap: 16px;
  align-items: center;
}

.filter-select {
  width: 140px;
}

.search-input {
  width: 240px;
}

/* 表格容器 */
.table-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow-x: auto;
}

/* 表格样式优化 */
:deep(.el-table) {
  width: 100% !important;
  table-layout: fixed !important;
  max-height: 500px;
}

:deep(.el-table__header th) {
  background-color: #fafafa !important;
  color: #606266;
  font-weight: 600;
  padding: 12px 8px !important;
  border-bottom: 1px solid #ebeef5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  vertical-align: middle;
}

:deep(.el-table__body td) {
  padding: 12px 8px !important;
  border-bottom: 1px solid #ebeef5;
  vertical-align: middle;
  text-align: center;
}

/* 选择框列特殊样式 */
:deep(.el-table__header th:first-child),
:deep(.el-table__body td:first-child) {
  text-align: center !important;
  vertical-align: middle !important;
  padding: 12px 4px !important;
}

/* 强制约束选择框列的样式 */
:deep(.el-table-column--selection .el-table__cell) {
  width: 60px !important;
  padding: 0 !important;
  text-align: center;
}

/* 缩小选择框本身的尺寸 */
:deep(.el-table-column--selection .el-checkbox) {
  transform: scale(0.8);
}

/* 考试名称列特殊样式 */
:deep(.el-table__header th:nth-child(2)) {
  text-align: left !important;
}

:deep(.el-table__body td:nth-child(2)) {
  text-align: left !important;
}

.exam-name {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  overflow: hidden;
  max-width: 230px;
}

.exam-icon {
  color: #409eff;
  font-size: 20px;
  flex-shrink: 0;
}

.exam-info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.exam-info .name {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.exam-info .category {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.exam-time {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.time-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.creator-info {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
  width: 100%;
}

.creator-info span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.status-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  transition: all 0.3s ease;
}

.action-buttons .el-button:hover {
  transform: scale(1.1);
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

/* 表格行样式 */
:deep(.running-row) {
  background-color: #f0f9ff !important;
}

:deep(.completed-row) {
  background-color: #f5f7fa !important;
}

:deep(.el-table__row) {
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
  transform: scale(1.005);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .page-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .search-filters {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .exam-info-management {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-stats {
    flex-direction: column;
    gap: 16px;
  }

  .toolbar-left {
    flex-direction: column;
    gap: 8px;
  }

  .search-filters {
    flex-direction: column;
    gap: 12px;
  }

  .filter-select,
  .search-input {
    width: 100%;
  }

  .action-buttons {
    flex-wrap: wrap;
    gap: 4px;
  }

  .action-buttons .el-button {
    margin: 2px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 16px;
  }

  .toolbar {
    padding: 16px;
  }

  .table-container {
    padding: 16px;
  }

  :deep(.el-table) {
    font-size: 12px;
  }

  :deep(.el-table__cell) {
    padding: 8px 4px;
  }
}

</style>
