<template>
  <div class="login-container">
    <div class="login-header">
      <h1 class="title">在线考试平台</h1>
      <div class="logo-placeholder">conEdison标识</div>
    </div>
    
    <div class="login-form">
      <div class="form-group">
        <input 
          v-model="loginForm.username" 
          type="text" 
          placeholder="请输入帐号" 
          class="form-input"
          @focus="clearError"
        >
      </div>
      
      <div class="form-group password-group">
        <input 
          v-model="loginForm.password" 
          :type="showPassword ? 'text' : 'password'" 
          placeholder="请输入密码" 
          class="form-input"
          @focus="clearError"
        >
        <span class="toggle-password" @click="togglePasswordVisibility">
          {{ showPassword ? '隐藏' : '显示' }}
        </span>
      </div>
      
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      
      <button 
        @click="handleLogin" 
        :disabled="isLoading" 
        class="login-button"
      >
        {{ isLoading ? '登录中...' : '登录' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

// 表单数据
const loginForm = reactive({
  username: '',
  password: ''
})

// 控制状态
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')
const router = useRouter()

// 切换密码可见性
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

// 清除错误信息
const clearError = () => {
  errorMessage.value = ''
}

// 处理登录
const handleLogin = () => {
  // 重置错误信息
  errorMessage.value = ''
  
  // 验证输入
  if (!loginForm.username.trim() || !loginForm.password.trim()) {
    errorMessage.value = '请填写完整信息'
    return
  }
  
  // 设置加载状态
  isLoading.value = true
  
  // 模拟登录请求（实际项目中这里会是API调用）
  setTimeout(() => {
    console.log('登录信息:', {
      username: loginForm.username,
      password: loginForm.password
    })
    
    // 模拟登录成功
    // alert(`欢迎, ${loginForm.username}! 登录成功`)
    
    // 重置加载状态
    isLoading.value = false
    
    // 跳转到首页
    router.push('/home')
  }, 1500)
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.title {
  font-size: 22px;
  font-weight: bold;
  margin: 0 0 10px 0;
  color: #333;
}

.logo-placeholder {
  font-size: 14px;
  color: #666;
}

.login-form {
  width: 100%;
  max-width: 360px;
  padding: 30px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #0066cc;
}

.password-group {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #0066cc;
  user-select: none;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover:not(:disabled) {
  background-color: #0056b3;
}

.login-button:disabled {
  background-color: #b3b3b3;
  cursor: not-allowed;
}
</style>