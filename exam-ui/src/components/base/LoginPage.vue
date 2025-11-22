<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card animate__animated animate__fadeInDown">
      <!-- 头部 -->
      <div class="login-header">
        <div class="logo-section">
          <el-icon size="48" color="#409EFF" class="logo-icon"><Document /></el-icon>
          <h1 class="title">考试管理系统</h1>
          <p class="subtitle">专业、高效、安全的在线考试平台</p>
        </div>
      </div>

      <!-- 登录表单 -->
      <el-form 
        ref="loginFormRef" 
        :model="loginForm" 
        :rules="loginRules"
        class="login-form"
        size="large"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            :prefix-icon="User"
            clearable
            class="form-input"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
            :prefix-icon="Lock"
            :suffix-icon="showPassword ? View : Hide"
            @click-suffix="togglePasswordVisibility"
            class="form-input"
          />
        </el-form-item>

        <!-- 忘记密码 -->
        <div class="form-options">
          <el-button type="primary" link @click="forgotPassword">忘记密码？</el-button>
        </div>

        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="isLoading"
            @click="handleLogin"
            class="login-button"
          >
            {{ isLoading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>


      </el-form>

      <!-- 底部信息 -->
      <div class="login-footer">
        <p class="copyright">© 2024 考试管理系统. All rights reserved.</p>
        <div class="footer-links">
          <el-button type="primary" link>用户协议</el-button>
          <el-button type="primary" link>隐私政策</el-button>
          <el-button type="primary" link>帮助中心</el-button>
        </div>
      </div>
    </div>

    <!-- 右侧信息展示 -->
    <div class="info-section animate__animated animate__fadeInRight">
      <div class="info-content">
        <h2>欢迎使用考试管理系统</h2>
        <div class="feature-list">
          <div class="feature-item">
            <el-icon size="24" color="#409EFF"><Document /></el-icon>
            <div class="feature-text">
              <h3>智能组卷</h3>
              <p>支持多种题型，智能组卷算法</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon size="24" color="#67C23A"><DataAnalysis /></el-icon>
            <div class="feature-text">
              <h3>数据分析</h3>
              <p>全面的考试数据统计与分析</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon size="24" color="#E6A23C"><Lock /></el-icon>
            <div class="feature-text">
              <h3>安全可靠</h3>
              <p>多重安全防护，保障考试公平</p>
            </div>
          </div>
          <div class="feature-item">
            <el-icon size="24" color="#F56C6C"><Monitor /></el-icon>
            <div class="feature-text">
              <h3>实时监控</h3>
              <p>考试过程实时监控与管理</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Lock,
  View,
  Hide,
  Document,
  ChatDotRound,
  Promotion,
  Message,
  DataAnalysis,
  Monitor
} from '@element-plus/icons-vue'
import authService from '../../api/auth/auth.js'

const router = useRouter()
const loginFormRef = ref()

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 控制状态
const showPassword = ref(false)
const isLoading = ref(false)

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 忘记密码
const forgotPassword = () => {
  ElMessage.info('请联系管理员重置密码')
}

// 处理登录
const handleLogin = async () => {
    if (!loginFormRef.value) return
    
    isLoading.value = true
    
    try {
      // 表单验证
      await loginFormRef.value.validate()
      
      // 调用登录API
      const response = await authService.login({
        username: loginForm.username,
        password: loginForm.password
      })
      
      // 保存token到本地存储
      localStorage.setItem('token', response.token || 'mock-token-for-test')
      
      ElMessage.success('登录成功！')
      
      isLoading.value = false
      
      // 跳转到首页
      router.push('/home')
    } catch (error) {
      isLoading.value = false
      // 如果是表单验证错误，不显示额外消息
      if (error.name !== 'Error') {
        console.log('表单验证失败:', error)
      } else {
        ElMessage.error('登录失败，请检查用户名和密码')
        console.error('登录错误:', error)
      }
    }
  }


</script>

<style scoped>
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.circle-2 {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.circle-3 {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 登录卡片 */
.login-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  margin: 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-icon {
  margin-bottom: 16px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
  font-weight: 400;
}

/* 表单样式 */
.login-form {
  margin-bottom: 30px;
}

.form-input {
  margin-bottom: 8px;
}

.form-input :deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.form-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.form-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  border-color: #409EFF;
}

/* 表单选项 */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* 登录按钮 */
.login-button {
  width: 100%;
  height: 48px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

.login-button:active {
  transform: translateY(0);
}

/* 其他登录方式 */
.other-login {
  margin-top: 30px;
}

.divider-text {
  color: #909399;
  font-size: 12px;
  padding: 0 12px;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 20px;
}

.social-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #e4e7ed;
  background: #fff;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.social-btn.wechat:hover {
  border-color: #67C23A;
  color: #67C23A;
}

.social-btn.qq:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.social-btn.email:hover {
  border-color: #E6A23C;
  color: #E6A23C;
}

/* 底部信息 */
.login-footer {
  text-align: center;
  border-top: 1px solid #e4e7ed;
  padding-top: 20px;
  margin-top: 30px;
}

.copyright {
  font-size: 12px;
  color: #909399;
  margin: 0 0 12px 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.footer-links .el-button {
  font-size: 12px;
  padding: 0;
}

/* 右侧信息展示 */
.info-section {
  position: relative;
  z-index: 10;
  flex: 1;
  max-width: 500px;
  margin: 40px;
  color: white;
  display: none;
}

.info-content h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 40px;
  line-height: 1.2;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(10px);
}

.feature-text h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.feature-text p {
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
}

/* 响应式设计 */
@media (min-width: 1200px) {
  .login-container {
    justify-content: flex-start;
    padding: 0;
  }
  
  .info-section {
    display: block;
  }
  
  .login-card {
    margin: 40px;
    max-width: 420px;
  }
}

@media (max-width: 768px) {
  .login-card {
    margin: 16px;
    padding: 30px 24px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .info-section {
    display: none;
  }
  
  .social-login {
    gap: 12px;
  }
  
  .social-btn {
    width: 40px;
    height: 40px;
  }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .login-card {
    background: rgba(30, 30, 30, 0.95);
    color: #fff;
  }
  
  .title {
    color: #fff;
  }
  
  .subtitle {
    color: #ccc;
  }
  
  .form-input :deep(.el-input__wrapper) {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  
  .form-input :deep(.el-input__inner) {
    color: #fff;
  }
  
  .form-input :deep(.el-input__inner::placeholder) {
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
