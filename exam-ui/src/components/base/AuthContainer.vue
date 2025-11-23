<template>
  <div class="auth-container">
    <!-- 条件渲染登录或注册页面，带有过渡效果 -->
    <transition name="auth-switch" mode="out-in">
      <LoginPage 
        v-if="showLogin"
        :key="'login'"
        @switch-to-register="switchToRegister"
      />
      <RegisterPage 
        v-else
        :key="'register'"
        @switch-to-login="switchToLogin"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginPage from './LoginPage.vue'
import RegisterPage from './RegisterPage.vue'

// 控制显示登录页面还是注册页面
const showLogin = ref(true)

// 切换到注册页面
const switchToRegister = () => {
  showLogin.value = false
}

// 切换到登录页面
const switchToLogin = () => {
  showLogin.value = true
}
</script>

<style scoped>
.auth-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

/* 定义页面切换的过渡动画 */
.auth-switch-enter-active,
.auth-switch-leave-active {
  transition: all 0.4s ease;
  position: absolute;
  width: 100%;
  min-height: 100vh;
}

.auth-switch-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.auth-switch-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
