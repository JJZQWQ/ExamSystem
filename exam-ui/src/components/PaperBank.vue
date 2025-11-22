<template>
  <div class="paper-bank">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><Document /></el-icon>
        试卷库
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总试卷数" :value="totalPapers" />
        <el-statistic title="已发布" :value="publishedPapers" />
        <el-statistic title="草稿" :value="draftPapers" />
      </div>
    </div>

    <!-- 顶部操作栏 -->
    <div class="toolbar animate__animated animate__fadeInDown">
      <div class="toolbar-left">
        <el-button 
          type="primary" 
          size="large"
          @click="showCreateModal"
          class="action-btn"
        >
          <el-icon><Plus /></el-icon>
          创建试卷
        </el-button>
        <el-button 
          type="success" 
          size="large"
          @click="showImportDialog"
          class="action-btn"
        >
          <el-icon><Upload /></el-icon>
          导入试卷
        </el-button>
        <el-button 
          type="danger" 
          size="large"
          @click="batchDeletePapers"
          :disabled="selectedPapers.length === 0"
          class="action-btn"
        >
          <el-icon><Delete /></el-icon>
          批量删除
        </el-button>
      </div>
      <div class="toolbar-right">
        <div class="search-filters">
          <el-input
            v-model="searchParams.keyword"
            placeholder="搜索试卷名称..."
            :prefix-icon="Search"
            class="search-input"
            clearable
            @input="handleSearch"
          />
          
          <el-select 
            v-model="searchParams.subject" 
            placeholder="科目" 
            clearable
            class="filter-select"
          >
            <el-option label="全部科目" value="" />
            <el-option label="计算机基础" value="计算机基础" />
            <el-option label="程序设计" value="程序设计" />
            <el-option label="数据结构" value="数据结构" />
            <el-option label="数据库" value="数据库" />
            <el-option label="网络技术" value="网络技术" />
          </el-select>
          
          <el-select 
            v-model="searchParams.difficulty" 
            placeholder="难度" 
            clearable
            class="filter-select"
          >
            <el-option label="全部难度" value="" />
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
          
          <el-select 
            v-model="searchParams.status" 
            placeholder="状态" 
            clearable
            class="filter-select"
          >
            <el-option label="全部状态" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </div>
      </div>
    </div>

    <!-- 试卷卡片网格 -->
    <div class="paper-grid animate__animated animate__fadeInUp">
      <div 
        v-for="paper in filteredPapers" 
        :key="paper.id"
        class="paper-card"
        :class="{ 'selected': selectedPapers.includes(paper.id) }"
        @click="toggleSelectPaper(paper.id)"
      >
        <div class="card-header">
          <div class="card-title">
            <el-icon class="paper-icon"><Document /></el-icon>
            <h3>{{ paper.title }}</h3>
          </div>
          <div class="card-actions">
            <el-checkbox 
              :checked="selectedPapers.includes(paper.id)"
              @change="toggleSelectPaper(paper.id)"
              @click.stop
            />
          </div>
        </div>
        
        <div class="card-content">
          <div class="paper-info">
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>{{ paper.subject }}</span>
            </div>
            <div class="info-item">
              <el-icon><Timer /></el-icon>
              <span>{{ paper.duration }}分钟</span>
            </div>
            <div class="info-item">
              <el-icon><Star /></el-icon>
              <span>{{ paper.difficulty }}</span>
            </div>
            <div class="info-item">
              <el-icon><QuestionFilled /></el-icon>
              <span>{{ paper.questionCount }}题</span>
            </div>
            <div class="info-item">
              <el-icon><Medal /></el-icon>
              <span>{{ paper.totalScore }}分</span>
            </div>
          </div>
          
          <div class="paper-description">
            {{ paper.description }}
          </div>
        </div>
        
        <div class="card-footer">
          <div class="status-tag">
            <el-tag 
              :type="paper.status === 'published' ? 'success' : 'warning'"
              size="small"
            >
              {{ paper.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </div>
          <div class="action-buttons">
            <el-tooltip content="预览试卷" placement="top">
              <el-button 
                type="success" 
                size="small" 
                circle
                @click.stop="previewPaper(paper)"
              >
                <el-icon><View /></el-icon>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="编辑试卷" placement="top">
              <el-button 
                type="primary" 
                size="small" 
                circle
                @click.stop="showEditModal(paper)"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="复制试卷" placement="top">
              <el-button 
                type="info" 
                size="small" 
                circle
                @click.stop="copyPaper(paper)"
              >
                <el-icon><CopyDocument /></el-icon>
              </el-button>
            </el-tooltip>
            
            <el-tooltip content="删除试卷" placement="top">
              <el-button 
                type="danger" 
                size="small" 
                circle
                @click.stop="deletePaper(paper)"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[9, 18, 36, 72]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
      />
    </div>

    <!-- 创建/编辑试卷对话框 -->
    <el-dialog
      v-model="showPaperModal"
      :title="paperModalType === 'create' ? '创建试卷' : '编辑试卷'"
      width="1000px"
      :before-close="closePaperModal"
      class="paper-dialog"
    >
      <el-form
        ref="paperFormRef"
        :model="paperForm"
        :rules="paperRules"
        label-width="100px"
      >
        <el-form-item label="试卷标题" prop="title">
          <el-input
            v-model="paperForm.title"
            placeholder="请输入试卷标题"
          />
        </el-form-item>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="科目" prop="subject">
              <el-select v-model="paperForm.subject" placeholder="请选择科目" style="width: 100%">
                <el-option label="计算机基础" value="计算机基础" />
                <el-option label="程序设计" value="程序设计" />
                <el-option label="数据结构" value="数据结构" />
                <el-option label="数据库" value="数据库" />
                <el-option label="网络技术" value="网络技术" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="paperForm.difficulty" placeholder="请选择难度" style="width: 100%">
                <el-option label="简单" value="简单" />
                <el-option label="中等" value="中等" />
                <el-option label="困难" value="困难" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="考试时长" prop="duration">
              <el-input-number 
                v-model="paperForm.duration" 
                :min="30" 
                :max="300" 
                :step="15"
                style="width: 100%"
              />
              <span style="margin-left: 8px; color: #909399;">分钟</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总分" prop="totalScore">
              <el-input-number 
                v-model="paperForm.totalScore" 
                :min="50" 
                :max="200" 
                :step="10"
                style="width: 100%"
              />
              <span style="margin-left: 8px; color: #909399;">分</span>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="试卷描述" prop="description">
          <el-input
            v-model="paperForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入试卷描述"
          />
        </el-form-item>
        
        <el-form-item label="试题配置">
          <div class="question-config">
            <div 
              v-for="(config, index) in paperForm.questionConfig" 
              :key="index"
              class="config-item"
            >
              <el-select v-model="config.type" placeholder="题型" style="width: 120px">
                <el-option label="单选题" value="单选题" />
                <el-option label="多选题" value="多选题" />
                <el-option label="判断题" value="判断题" />
                <el-option label="填空题" value="填空题" />
                <el-option label="简答题" value="简答题" />
              </el-select>
              
              <el-input-number 
                v-model="config.count" 
                :min="1" 
                :max="50" 
                placeholder="数量"
                style="width: 100px; margin: 0 10px;"
              />
              
              <el-input-number 
                v-model="config.score" 
                :min="1" 
                :max="20" 
                placeholder="分值"
                style="width: 100px; margin-right: 10px;"
              />
              
              <span style="color: #909399;">分/题</span>
              
              <el-button 
                v-if="paperForm.questionConfig.length > 1"
                type="danger" 
                size="small"
                @click="removeQuestionConfig(index)"
                style="margin-left: 10px;"
              >
                删除
              </el-button>
            </div>
            
            <el-button 
              type="primary" 
              plain 
              @click="addQuestionConfig"
              style="margin-top: 10px;"
            >
              添加题型配置
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closePaperModal">取消</el-button>
          <el-button type="primary" @click="savePaper">保存</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 试卷预览对话框 -->
    <el-dialog
      v-model="showPreviewDialog"
      title="试卷预览"
      width="900px"
      class="preview-dialog"
    >
      <div v-if="previewPaperData" class="paper-preview">
        <div class="preview-header">
          <h2>{{ previewPaperData.title }}</h2>
          <div class="preview-info">
            <el-tag>{{ previewPaperData.subject }}</el-tag>
            <el-tag type="warning">{{ previewPaperData.difficulty }}</el-tag>
            <span>考试时长：{{ previewPaperData.duration }}分钟</span>
            <span>总分：{{ previewPaperData.totalScore }}分</span>
          </div>
        </div>
        
        <div class="preview-content">
          <div class="question-sections">
            <div 
              v-for="(config, index) in previewPaperData.questionConfig" 
              :key="index"
              class="question-section"
            >
              <h4>{{ config.type }}（每题{{ config.score }}分，共{{ config.count }}题）</h4>
              <div class="sample-questions">
                <div v-for="i in Math.min(config.count, 2)" :key="i" class="sample-question">
                  <p>{{ i }}. {{ getSampleQuestion(config.type) }}</p>
                  <div v-if="config.type === '单选题'" class="sample-options">
                    <p>A. 选项A内容</p>
                    <p>B. 选项B内容</p>
                    <p>C. 选项C内容</p>
                    <p>D. 选项D内容</p>
                  </div>
                </div>
                <p v-if="config.count > 2" class="more-questions">
                  ... 还有 {{ config.count - 2 }} 题
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  Plus,
  Upload,
  Delete,
  Search,
  User,
  Timer,
  Star,
  QuestionFilled,
  Medal,
  View,
  Edit,
  CopyDocument
} from '@element-plus/icons-vue'

// 路由
const router = useRouter()

// 响应式数据
const selectedPapers = ref([])
const showPaperModal = ref(false)
const showImportDialogFlag = ref(false)
const showPreviewDialog = ref(false)
const paperModalType = ref('create')
const editingPaperId = ref(null)
const previewPaperData = ref(null)
const paperFormRef = ref()

// 搜索参数
const searchParams = reactive({
  keyword: '',
  subject: '',
  difficulty: '',
  status: ''
})

// 分页数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 9,
  total: 0
})

// 试卷表单
const paperForm = reactive({
  title: '',
  subject: '',
  difficulty: '',
  duration: 120,
  totalScore: 100,
  description: '',
  questionConfig: [
    { type: '', count: 1, score: 5 }
  ]
})

// 表单验证规则
const paperRules = {
  title: [
    { required: true, message: '请输入试卷标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请选择科目', trigger: 'change' }
  ],
  difficulty: [
    { required: true, message: '请选择难度', trigger: 'change' }
  ],
  duration: [
    { required: true, message: '请输入考试时长', trigger: 'blur' }
  ],
  totalScore: [
    { required: true, message: '请输入总分', trigger: 'blur' }
  ]
}

// 试卷数据
const papers = ref([
  {
    id: 1,
    title: 'Vue.js基础测试卷',
    subject: '程序设计',
    difficulty: '中等',
    duration: 120,
    questionCount: 20,
    totalScore: 100,
    status: 'published',
    description: '测试Vue.js基础知识，包括组件、路由、状态管理等内容。',
    createTime: '2023-06-01 10:00',
    questionConfig: [
      { type: '单选题', count: 10, score: 3 },
      { type: '多选题', count: 5, score: 5 },
      { type: '简答题', count: 2, score: 15 },
      { type: '判断题', count: 3, score: 2 }
    ]
  },
  {
    id: 2,
    title: 'JavaScript高级特性考试',
    subject: '程序设计',
    difficulty: '困难',
    duration: 150,
    questionCount: 25,
    totalScore: 150,
    status: 'published',
    description: '深入考察JavaScript的高级特性，包括闭包、原型链、异步编程等。',
    createTime: '2023-06-02 14:30',
    questionConfig: [
      { type: '单选题', count: 15, score: 4 },
      { type: '多选题', count: 5, score: 8 },
      { type: '简答题', count: 3, score: 20 },
      { type: '编程题', count: 2, score: 15 }
    ]
  },
  {
    id: 3,
    title: '计算机网络基础测试',
    subject: '网络技术',
    difficulty: '简单',
    duration: 90,
    questionCount: 15,
    totalScore: 75,
    status: 'draft',
    description: '计算机网络基础知识测试，包括TCP/IP协议、HTTP协议等。',
    createTime: '2023-06-03 09:15',
    questionConfig: [
      { type: '单选题', count: 10, score: 3 },
      { type: '多选题', count: 3, score: 5 },
      { type: '判断题', count: 2, score: 10 }
    ]
  },
  {
    id: 4,
    title: '数据库设计与SQL',
    subject: '数据库',
    difficulty: '中等',
    duration: 120,
    questionCount: 18,
    totalScore: 90,
    status: 'published',
    description: '数据库设计原理和SQL语言应用能力测试。',
    createTime: '2023-06-04 16:45',
    questionConfig: [
      { type: '单选题', count: 12, score: 3 },
      { type: '多选题', count: 4, score: 6 },
      { type: '简答题', count: 2, score: 15 }
    ]
  },
  {
    id: 5,
    title: '数据结构与算法',
    subject: '数据结构',
    difficulty: '困难',
    duration: 180,
    questionCount: 22,
    totalScore: 120,
    status: 'published',
    description: '数据结构基础知识和算法设计能力综合测试。',
    createTime: '2023-06-05 11:20',
    questionConfig: [
      { type: '单选题', count: 10, score: 3 },
      { type: '多选题', count: 5, score: 6 },
      { type: '填空题', count: 4, score: 4 },
      { type: '算法题', count: 3, score: 15 }
    ]
  }
])

// 计算属性
const totalPapers = computed(() => papers.value.length)
const publishedPapers = computed(() => papers.value.filter(p => p.status === 'published').length)
const draftPapers = computed(() => papers.value.filter(p => p.status === 'draft').length)

const filteredPapers = computed(() => {
  let filtered = papers.value

  if (searchParams.keyword) {
    const keyword = searchParams.keyword.toLowerCase()
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(keyword)
    )
  }

  if (searchParams.subject) {
    filtered = filtered.filter(p => p.subject === searchParams.subject)
  }

  if (searchParams.difficulty) {
    filtered = filtered.filter(p => p.difficulty === searchParams.difficulty)
  }

  if (searchParams.status) {
    filtered = filtered.filter(p => p.status === searchParams.status)
  }

  pagination.total = filtered.length
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filtered.slice(start, end)
})

// 事件处理函数
const handleSearch = () => {
  pagination.currentPage = 1
}

const toggleSelectPaper = (id) => {
  const index = selectedPapers.value.indexOf(id)
  if (index > -1) {
    selectedPapers.value.splice(index, 1)
  } else {
    selectedPapers.value.push(id)
  }
}

const handleSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
}

const handleCurrentChange = (page) => {
  pagination.currentPage = page
}

const showCreateModal = () => {
  // 跳转到创建试卷页面
  router.push('/create-paper')
}

const showEditModal = (paper) => {
  paperModalType.value = 'edit'
  editingPaperId.value = paper.id
  Object.assign(paperForm, {
    title: paper.title,
    subject: paper.subject,
    difficulty: paper.difficulty,
    duration: paper.duration,
    totalScore: paper.totalScore,
    description: paper.description,
    questionConfig: [...paper.questionConfig]
  })
  showPaperModal.value = true
}

const closePaperModal = () => {
  showPaperModal.value = false
  resetPaperForm()
}

const resetPaperForm = () => {
  Object.assign(paperForm, {
    title: '',
    subject: '',
    difficulty: '',
    duration: 120,
    totalScore: 100,
    description: '',
    questionConfig: [
      { type: '', count: 1, score: 5 }
    ]
  })
  if (paperFormRef.value) {
    paperFormRef.value.resetFields()
  }
}

const addQuestionConfig = () => {
  if (paperForm.questionConfig.length < 10) {
    paperForm.questionConfig.push({ type: '', count: 1, score: 5 })
  } else {
    ElMessage.warning('最多支持10种题型配置')
  }
}

const removeQuestionConfig = (index) => {
  if (paperForm.questionConfig.length > 1) {
    paperForm.questionConfig.splice(index, 1)
  }
}

const savePaper = () => {
  paperFormRef.value.validate((valid) => {
    if (valid) {
      ElMessage.success(paperModalType.value === 'create' ? '创建成功' : '编辑成功')
      closePaperModal()
    }
  })
}

const previewPaper = (paper) => {
  previewPaperData.value = paper
  showPreviewDialog.value = true
}

const copyPaper = (paper) => {
  ElMessage.success('复制试卷成功')
}

const deletePaper = (paper) => {
  ElMessageBox.confirm(
    `确定要删除试卷 "${paper.title}" 吗？`,
    '删除试卷',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const batchDeletePapers = () => {
  if (selectedPapers.value.length === 0) {
    ElMessage.warning('请选择要删除的试卷')
    return
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedPapers.value.length} 个试卷吗？`,
    '批量删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    selectedPapers.value = []
  }).catch(() => {})
}

const showImportDialog = () => {
  showImportDialogFlag.value = true
}

const getSampleQuestion = (type) => {
  const samples = {
    '单选题': '以下哪个选项是正确的？',
    '多选题': '以下哪些选项是正确的？（多选）',
    '判断题': '以下说法是否正确？',
    '填空题': '请填写正确答案：_____',
    '简答题': '请简要回答以下问题：',
    '编程题': '请编写代码实现以下功能：'
  }
  return samples[type] || '请回答以下问题：'
}

// 组件挂载
onMounted(() => {
  pagination.total = papers.value.length
})
</script>

<style scoped>
.paper-bank {
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.action-btn:active::before {
  width: 200px;
  height: 200px;
}

.action-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(-1px);
  transition: all 0.1s;
}

.search-filters {
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  width: 280px;
}

.filter-select {
  width: 140px;
}

/* 试卷卡片网格 */
.paper-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.paper-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 2px solid transparent;
}

.paper-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
  transition: left 0.6s;
}

.paper-card:hover::before {
  left: 100%;
}

.paper-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #409eff;
}

.paper-card:active {
  transform: translateY(-4px) scale(1.01);
  transition: all 0.1s;
}

.paper-card.selected {
  border-color: #409eff;
  background-color: #f0f9ff;
  transform: scale(1.02);
}

.paper-card.selected::after {
  content: '✓';
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background-color: #409eff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  animation: bounceIn 0.4s;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.paper-icon {
  color: #409eff;
  font-size: 20px;
}

.card-title h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
}

.card-content {
  margin-bottom: 16px;
}

.paper-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
}

.info-item .el-icon {
  font-size: 16px;
  color: #909399;
}

.paper-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.action-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-buttons .el-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-buttons .el-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s, height 0.4s;
}

.action-buttons .el-button:active::before {
  width: 40px;
  height: 40px;
}

.action-buttons .el-button:hover {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-buttons .el-button:active {
  transform: scale(1.05) rotate(2deg);
  transition: all 0.1s;
}

/* 分页 */
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  padding: 24px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

/* 对话框样式 */
:deep(.paper-dialog .el-dialog) {
  border-radius: 16px;
}

:deep(.paper-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
}

:deep(.paper-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.paper-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

/* 试题配置 */
.question-config {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  background-color: #fafafa;
}

.config-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e4e7ed;
}

.config-item:last-child {
  margin-bottom: 0;
}

/* 试卷预览 */
.paper-preview {
  padding: 16px 0;
}

.preview-header {
  text-align: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #e4e7ed;
}

.preview-header h2 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
}

.preview-info {
  display: flex;
  justify-content: center;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.preview-info span {
  color: #606266;
  font-size: 14px;
}

.preview-content {
  max-height: 500px;
  overflow-y: auto;
}

.question-sections {
  space-y: 24px;
}

.question-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.question-section h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.sample-questions {
  space-y: 12px;
}

.sample-question {
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #409eff;
}

.sample-question p {
  margin: 0 0 8px 0;
  line-height: 1.6;
  color: #303133;
}

.sample-options {
  margin-left: 20px;
}

.sample-options p {
  margin: 4px 0;
  color: #606266;
}

.more-questions {
  text-align: center;
  color: #909399;
  font-style: italic;
  margin: 12px 0 0 0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .paper-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .paper-bank {
    padding: 16px;
  }
  
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
  
  .paper-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .paper-info {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-wrap: wrap;
    gap: 4px;
  }
}

@media (max-width: 480px) {
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
  
  .search-input,
  .filter-select {
    width: 100%;
  }
  
  .preview-info {
    flex-direction: column;
    gap: 8px;
  }
}
</style>