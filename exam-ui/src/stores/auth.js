import { defineStore } from 'pinia'
import authService from '../api/auth/auth'
import { auth } from '../utils/auth'

/**
 * 认证状态管理Store
 * 管理用户登录、登出、认证状态等功能
 */
export const useAuthStore = defineStore('auth', {
  // 状态定义
  state: () => ({
    // 用户信息
    userInfo: null,
    // 认证令牌
    token: '',
    // 加载状态
    isLoading: false,
    // 错误信息
    error: '',
    // 认证状态更新时间戳
    lastUpdated: null
  }),

  // 计算属性
  getters: {
    /**
     * 判断用户是否已认证
     * @returns {boolean} 认证状态
     */
    isAuthenticated: (state) => {
      return !!state.token && !!state.userInfo
    },
    
    /**
     * 获取用户角色
     * @returns {string|null} 用户角色
     */
    userRole: (state) => {
      return state.userInfo?.role || null
    }
  },

  // 动作方法
  actions: {
    /**
     * 用户登录
     * @param {Object} credentials - 登录凭证
     * @param {string} credentials.username - 用户名
     * @param {string} credentials.password - 密码
     * @returns {Promise<Object>} 登录响应
     */
    async login(credentials) {
      this.isLoading = true
      this.error = ''
      
      try {
        const response = await authService.login(credentials)
        
        if (response.code === 1) {
          // 更新状态
            this.token = response.token || 'mock-token-for-test'
            this.userInfo = response.userInfo || { username: credentials.username }
            this.lastUpdated = Date.now()
            
            // 持久化存储
            auth.saveAuthData(response.token || 'mock-token-for-test', response.userInfo || { username: credentials.username })
          
          return response
        } else {
          this.error = response.message || '登录失败，请稍后重试'
          throw new Error(this.error)
        }
      } catch (error) {
        this.error = error.message || '登录失败，请检查网络连接或账号密码'
        throw error
      } finally {
        this.isLoading = false
      }
    },

    /**
     * 用户登出
     */
    logout() {
      // 清除状态
      this.token = ''
      this.userInfo = null
      this.lastUpdated = null
      
      // 清除持久化存储
      auth.clearAuthData()
    },

    /**
     * 检查并恢复认证状态
     * 从本地存储中恢复认证信息
     */
    checkAuth() {
      try {
        const authData = auth.getAuthData()
        if (authData && authData.token && authData.userInfo) {
          this.token = authData.token
          this.userInfo = authData.userInfo
          this.lastUpdated = Date.now()
          return true
        }
        return false
      } catch (error) {
        console.error('恢复认证状态失败:', error)
        this.logout() // 发生错误时清除状态
        return false
      }
    },

    /**
     * 刷新用户信息
     * @returns {Promise<Object>} 用户信息
     */
    async refreshUserInfo() {
      if (!this.token) {
        throw new Error('未认证，无法刷新用户信息')
      }
      
      try {
        const userInfo = await authService.getCurrentUser()
        this.userInfo = userInfo
        this.lastUpdated = Date.now()
        
        // 更新持久化存储
        if (this.token && this.userInfo) {
          auth.saveAuthData(this.token, this.userInfo)
        }
        
        return userInfo
      } catch (error) {
        console.error('刷新用户信息失败:', error)
        // 刷新失败时可能需要登出用户
        if (error.response?.status === 401) {
          this.logout()
        }
        throw error
      }
    },

    /**
     * 清除错误信息
     */
    clearError() {
      this.error = ''
    }
  }
})
