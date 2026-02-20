<template>
  <div class="student-management">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title animate__animated animate__fadeInLeft">
        <el-icon><User /></el-icon>
        学生管理
      </h1>
      <div class="page-stats animate__animated animate__fadeInRight">
        <el-statistic title="总学生数" :value="totalStudents" />
        <el-statistic title="班级数量" :value="totalClasses" />
        <el-statistic title="今日新增" :value="todayNewStudents" />
      </div>
    </div>

    <!-- 顶部操作栏 -->
    <div class="toolbar animate__animated animate__fadeInDown">
      <div class="toolbar-left">
        <el-button 
          type="primary" 
          size="large"
          @click="showAddStudentModal"
          class="action-btn"
        >
          <el-icon><Plus /></el-icon>
          添加学生
        </el-button>
        <el-button 
          type="success" 
          size="large"
          @click="importStudents"
          class="action-btn"
        >
          <el-icon><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button 
          type="warning" 
          size="large"
          @click="exportStudents"
          class="action-btn"
        >
          <el-icon><Download /></el-icon>
          导出学生
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索学号、姓名或班级..."
          :prefix-icon="Search"
          class="search-input"
          clearable
          @input="handleSearch"
        />
      </div>
    </div>

    <!-- 高级搜索区域 -->
    <el-card class="search-card animate__animated animate__fadeInUp">
      <div class="search-header">
        <h3>高级搜索</h3>
        <el-button 
          type="text" 
          @click="toggleSearchPanel"
          class="toggle-btn"
        >
          {{ showSearchPanel ? '收起' : '展开' }}
          <el-icon>
            <component :is="showSearchPanel ? 'ArrowUp' : 'ArrowDown'" />
          </el-icon>
        </el-button>
      </div>
      
      <div v-show="showSearchPanel" class="search-content">
        <el-form :model="searchParams" inline>
          <el-form-item label="学号">
            <el-input
              v-model="searchParams.id"
              placeholder="请输入学号"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              v-model="searchParams.name"
              placeholder="请输入姓名"
              clearable
              style="width: 200px"
            />
          </el-form-item>
          <el-form-item label="班级">
            <el-select 
              v-model="searchParams.class" 
              placeholder="全部班级"
              clearable
              style="width: 200px"
            >
              <el-option 
                v-for="cls in classOptions" 
                :key="cls" 
                :label="cls" 
                :value="cls" 
              />
            </el-select>
          </el-form-item>
          <el-form-item label="性别">
            <el-select 
              v-model="searchParams.gender" 
              placeholder="全部性别"
              clearable
              style="width: 120px"
            >
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="searchStudents">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!-- 学生列表 -->
    <el-card class="student-table-card animate__animated animate__fadeInUp">
      <div class="table-header">
        <h3>学生列表</h3>
        <div class="table-actions">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button label="table">表格视图</el-radio-button>
            <el-radio-button label="card">卡片视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="table-view">
        <el-table
          :data="filteredStudents"
          stripe
          style="width: 100%"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="学号" width="120" />
          <el-table-column prop="name" label="姓名" width="120">
            <template #default="{ row }">
              <div class="student-name-cell">
                <el-avatar :size="32" :src="row.avatar">
                  {{ row.name.charAt(0) }}
                </el-avatar>
                <span>{{ row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别" width="80">
            <template #default="{ row }">
              <el-tag :type="row.gender === 'male' ? 'primary' : 'success'" size="small">
                {{ row.gender === 'male' ? '男' : '女' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="class" label="班级" width="180" />
          <el-table-column prop="email" label="邮箱" min-width="200" />
          <el-table-column prop="phone" label="电话" width="150" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
                {{ row.status === 'active' ? '正常' : '停用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="enrollDate" label="入学日期" width="120" />
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="{ row }">
              <el-button 
                type="primary" 
                size="small"
                @click="viewStudentDetail(row)"
              >
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button 
                type="warning" 
                size="small"
                @click="editStudent(row)"
              >
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-dropdown>
                <el-button type="info" size="small">
                  更多<el-icon class="el-icon--right"><arrow-down /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="resetPassword(row)">
                      <el-icon><Key /></el-icon>重置密码
                    </el-dropdown-item>
                    <el-dropdown-item @click="viewExamHistory(row)">
                      <el-icon><Document /></el-icon>考试记录
                    </el-dropdown-item>
                    <el-dropdown-item @click="sendMessage(row)">
                      <el-icon><Message /></el-icon>发送消息
                    </el-dropdown-item>
                    <el-dropdown-item 
                      @click="deleteStudent(row)"
                      divided
                    >
                      <el-icon><Delete /></el-icon>删除学生
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
            v-for="student in filteredStudents" 
            :key="student.id"
            :span="8"
            style="margin-bottom: 20px"
          >
            <el-card class="student-card" shadow="hover">
              <div class="card-header">
                <div class="student-info">
                  <el-avatar :size="48" :src="student.avatar">
                    {{ student.name.charAt(0) }}
                  </el-avatar>
                  <div class="student-details">
                    <h4>{{ student.name }}</h4>
                    <p>{{ student.id }}</p>
                  </div>
                </div>
                <el-tag :type="student.status === 'active' ? 'success' : 'danger'">
                  {{ student.status === 'active' ? '正常' : '停用' }}
                </el-tag>
              </div>
              
              <div class="card-content">
                <div class="info-item">
                  <el-icon><User /></el-icon>
                  <span>{{ student.gender === 'male' ? '男' : '女' }}</span>
                </div>
                <div class="info-item">
                  <el-icon><School /></el-icon>
                  <span>{{ student.class }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Message /></el-icon>
                  <span>{{ student.email }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Phone /></el-icon>
                  <span>{{ student.phone }}</span>
                </div>
                <div class="info-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ student.enrollDate }}</span>
                </div>
              </div>
              
              <div class="card-footer">
                <el-button type="primary" size="small" @click="viewStudentDetail(student)">
                  查看详情
                </el-button>
                <el-button type="warning" size="small" @click="editStudent(student)">
                  编辑
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="showStudentModal"
      :title="editingStudent ? '编辑学生信息' : '添加学生'"
      width="600px"
      :before-close="closeStudentModal"
      class="student-dialog"
    >
      <el-form 
        :model="currentStudent" 
        :rules="studentRules"
        ref="studentFormRef"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" prop="id">
              <el-input
                v-model="currentStudent.id"
                placeholder="请输入学号"
                :disabled="editingStudent"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input
                v-model="currentStudent.name"
                placeholder="请输入姓名"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="currentStudent.gender">
                <el-radio label="male">男</el-radio>
                <el-radio label="female">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="班级" prop="class">
              <el-select 
                v-model="currentStudent.class" 
                placeholder="请选择班级"
                style="width: 100%"
              >
                <el-option 
                  v-for="cls in classOptions" 
                  :key="cls" 
                  :label="cls" 
                  :value="cls" 
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="currentStudent.email"
                placeholder="请输入邮箱"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电话" prop="phone">
              <el-input
                v-model="currentStudent.phone"
                placeholder="请输入电话"
              />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-form-item label="入学日期" prop="enrollDate">
          <el-date-picker
            v-model="currentStudent.enrollDate"
            type="date"
            placeholder="请选择入学日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeStudentModal">取消</el-button>
          <el-button type="primary" @click="saveStudent">
            {{ editingStudent ? '更新' : '添加' }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <el-dialog
      v-model="showImportModal"
      title="批量导入学生"
      width="600px"
      :before-close="closeImportModal"
      class="import-dialog"
    >
      <div class="import-content">
        <el-alert
          title="导入说明"
          type="info"
          description="请上传包含学生信息的Excel文件，文件格式要求：学号、姓名、性别、班级、邮箱、电话、入学日期"
          show-icon
          :closable="false"
        />
        
        <div class="import-area">
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileUpload"
            :limit="1"
            accept=".xlsx,.xls"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                只能上传 xlsx/xls 文件，且不超过 10MB
              </div>
            </template>
          </el-upload>
        </div>
        
        <div class="template-download">
          <el-button type="text" @click="downloadTemplate">
            <el-icon><Download /></el-icon>
            下载导入模板
          </el-button>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeImportModal">取消</el-button>
          <el-button type="primary" @click="confirmImport" :disabled="!selectedFile">
            开始导入
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
  User,
  Plus,
  Upload,
  Download,
  Search,
  ArrowUp,
  ArrowDown,
  View,
  Edit,
  Key,
  Document,
  Message,
  Delete,
  School,
  Phone,
  Calendar,
  UploadFilled
} from '@element-plus/icons-vue'

// 响应式数据
const viewMode = ref('table')
const searchKeyword = ref('')
const showSearchPanel = ref(false)
const showStudentModal = ref(false)
const showImportModal = ref(false)
const editingStudent = ref(false)
const selectedStudents = ref([])
const selectedFile = ref(null)
const studentFormRef = ref()

// 搜索参数
const searchParams = reactive({
  id: '',
  name: '',
  class: '',
  gender: ''
})

// 当前编辑的学生
const currentStudent = reactive({
  id: '',
  name: '',
  gender: 'male',
  class: '',
  email: '',
  phone: '',
  enrollDate: '',
  status: 'active'
})

// 学生表单验证规则
const studentRules = {
  id: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{8,12}$/, message: '学号应为8-12位数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  class: [
    { required: true, message: '请选择班级', trigger: 'change' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 班级选项
const classOptions = ref([
  '2020 产品 1 班',
  '2020 产品 2 班',
  '2021 产品 1 班',
  '2021 产品 2 班',
  '2022 产品 1 班',
  '2022 产品 2 班'
])

// 学生列表数据
const students = ref([
  {
    id: '202001001',
    name: '张三',
    gender: 'male',
    class: '2020 产品 1 班',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    status: 'active',
    enrollDate: '2020-09-01',
    avatar: ''
  },
  {
    id: '202001002',
    name: '李四',
    gender: 'female',
    class: '2020 产品 1 班',
    email: 'lisi@example.com',
    phone: '13800138002',
    status: 'active',
    enrollDate: '2020-09-01',
    avatar: ''
  },
  {
    id: '202001003',
    name: '王五',
    gender: 'male',
    class: '2020 产品 2 班',
    email: 'wangwu@example.com',
    phone: '13800138003',
    status: 'active',
    enrollDate: '2020-09-01',
    avatar: ''
  },
  {
    id: '202101001',
    name: '赵六',
    gender: 'female',
    class: '2021 产品 1 班',
    email: 'zhaoliu@example.com',
    phone: '13800138004',
    status: 'active',
    enrollDate: '2021-09-01',
    avatar: ''
  },
  {
    id: '202101002',
    name: '钱七',
    gender: 'male',
    class: '2021 产品 2 班',
    email: 'qianqi@example.com',
    phone: '13800138005',
    status: 'inactive',
    enrollDate: '2021-09-01',
    avatar: ''
  }
])

// 计算属性
const totalStudents = computed(() => students.value.length)

const totalClasses = computed(() => {
  const classes = new Set(students.value.map(student => student.class))
  return classes.size
})

const todayNewStudents = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return students.value.filter(student => student.enrollDate === today).length
})

const filteredStudents = computed(() => {
  let filtered = students.value
  
  if (searchKeyword.value) {
    filtered = filtered.filter(student => 
      student.id.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      student.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
      student.class.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }
  
  if (searchParams.id) {
    filtered = filtered.filter(student => 
      student.id.toLowerCase().includes(searchParams.id.toLowerCase())
    )
  }
  
  if (searchParams.name) {
    filtered = filtered.filter(student => 
      student.name.toLowerCase().includes(searchParams.name.toLowerCase())
    )
  }
  
  if (searchParams.class) {
    filtered = filtered.filter(student => student.class === searchParams.class)
  }
  
  if (searchParams.gender) {
    filtered = filtered.filter(student => student.gender === searchParams.gender)
  }
  
  return filtered
})

// 事件处理函数
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const toggleSearchPanel = () => {
  showSearchPanel.value = !showSearchPanel.value
}

const searchStudents = () => {
  ElMessage.success('搜索完成')
}

const resetSearch = () => {
  searchParams.id = ''
  searchParams.name = ''
  searchParams.class = ''
  searchParams.gender = ''
  searchKeyword.value = ''
}

const handleSelectionChange = (selection) => {
  selectedStudents.value = selection
}

const showAddStudentModal = () => {
  editingStudent.value = false
  Object.assign(currentStudent, {
    id: '',
    name: '',
    gender: 'male',
    class: '',
    email: '',
    phone: '',
    enrollDate: '',
    status: 'active'
  })
  showStudentModal.value = true
}

const editStudent = (student) => {
  editingStudent.value = true
  Object.assign(currentStudent, student)
  showStudentModal.value = true
}

const closeStudentModal = () => {
  showStudentModal.value = false
  studentFormRef.value?.resetFields()
}

const saveStudent = async () => {
  if (!studentFormRef.value) return
  
  try {
    await studentFormRef.value.validate()
    
    if (editingStudent.value) {
      const index = students.value.findIndex(s => s.id === currentStudent.id)
      if (index !== -1) {
        students.value[index] = { ...currentStudent }
      }
      ElMessage.success('学生信息更新成功')
    } else {
      const newStudent = { ...currentStudent }
      students.value.push(newStudent)
      ElMessage.success('学生添加成功')
    }
    
    closeStudentModal()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const deleteStudent = (student) => {
  ElMessageBox.confirm(
    `确定要删除学生 ${student.name} 吗？`,
    '删除学生',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = students.value.findIndex(s => s.id === student.id)
    if (index !== -1) {
      students.value.splice(index, 1)
      ElMessage.success('学生删除成功')
    }
  })
}

const viewStudentDetail = (student) => {
  ElMessage.info(`查看学生 ${student.name} 的详细信息`)
}

const resetPassword = (student) => {
  ElMessageBox.confirm(
    `确定要重置学生 ${student.name} 的密码吗？`,
    '重置密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('密码重置成功')
  })
}

const viewExamHistory = (student) => {
  ElMessage.info(`查看学生 ${student.name} 的考试记录`)
}

const sendMessage = (student) => {
  ElMessage.info(`向学生 ${student.name} 发送消息`)
}

const importStudents = () => {
  showImportModal.value = true
}

const closeImportModal = () => {
  showImportModal.value = false
  selectedFile.value = null
}

const handleFileUpload = (file) => {
  selectedFile.value = file
}

const confirmImport = () => {
  ElMessage.success('学生数据导入成功')
  closeImportModal()
}

const downloadTemplate = () => {
  ElMessage.success('模板下载成功')
}

const exportStudents = () => {
  ElMessage.success('学生数据导出成功')
}

// 组件挂载
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.student-management {
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

/* 搜索卡片 */
.search-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.search-header h3 {
  margin: 0;
  color: #303133;
  font-size: 18px;
  font-weight: 600;
}

.toggle-btn {
  color: #409eff;
}

.search-content {
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 学生表格卡片 */
.student-table-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
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

.student-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 卡片视图 */
.card-view {
  margin-top: 20px;
}

.student-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-details h4 {
  margin: 0 0 4px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.student-details p {
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

/* 对话框样式 */
:deep(.student-dialog .el-dialog),
:deep(.import-dialog .el-dialog) {
  border-radius: 16px;
}

:deep(.student-dialog .el-dialog__header),
:deep(.import-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px;
  border-radius: 16px 16px 0 0;
}

:deep(.student-dialog .el-dialog__title),
:deep(.import-dialog .el-dialog__title) {
  color: white;
  font-size: 18px;
  font-weight: 600;
}

:deep(.student-dialog .el-dialog__headerbtn .el-dialog__close),
:deep(.import-dialog .el-dialog__headerbtn .el-dialog__close) {
  color: white;
  font-size: 20px;
}

/* 导入对话框特定样式 */
.import-content {
  padding: 20px 0;
}

.import-area {
  margin: 20px 0;
}

.template-download {
  text-align: center;
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
}

@media (max-width: 768px) {
  .student-management {
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
  
  .table-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 20px;
  }
  
  .student-card {
    margin-bottom: 16px;
  }
}
</style>