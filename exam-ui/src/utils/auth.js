import { ElMessage } from 'element-plus'
import router from '../router'
import authService from '../api/auth/auth'

/**
 * 认证管理工具
 */
export const auth = {
  /**
   * 保存认证信息到本地存储
   * @param {string} token - JWT令牌
   * @param {Object} userInfo - 用户信息
   */
  saveAuthData(token, userInfo) {
    localStorage.setItem('token', token)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  },

  /**
   * 从本地存储获取认证信息
   * @returns {Object} 认证信息对象
   */
  getAuthData() {
    return {
      token: localStorage.getItem('token'),
      userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
    }
  },

  /**
   * 清除本地存储中的认证信息
   */
  clearAuthData() {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  },

  /**
   * 检查用户是否已认证
   * @returns {boolean} 是否已认证
   */
  isAuthenticated() {
    const { token, userInfo } = this.getAuthData()
    return !!token && !!userInfo
  },

  /**
   * 退出登录
   * @param {boolean} showMessage - 是否显示消息提示，默认为true
   * @returns {Promise} 登出操作Promise
   */
  async logout(showMessage = true) {
    try {
      // 显示退出登录中提示
      let loadingInstance = null
      if (showMessage) {
        loadingInstance = ElMessage({
          message: '正在退出登录...',
          type: 'info',
          duration: 0, // 不自动关闭
          showClose: false
        })
      }
      
      // 调用后端登出接口
      const response = await authService.logout()
      
      // 检查后端响应
      let isBackendSuccess = false
      if (response && response.code === 1) {
        isBackendSuccess = true
      }
      
      // 清除本地认证信息
      this.clearAuthData()
      
      // 重定向到登录页
      router.push('/login')
      
      // 关闭加载提示并显示成功消息
      if (showMessage) {
        if (loadingInstance) {
          loadingInstance.close()
        }
        
        ElMessage({
          message: '退出登录成功',
          type: 'success',
          duration: 1500
        })
      }
      
      return Promise.resolve(true)
    } catch (error) {
      console.error('退出登录失败:', error)
      
      // 即使后端登出失败，也要清除本地认证信息并跳转
      this.clearAuthData()
      router.push('/login')
      
      // 显示错误消息
      if (showMessage) {
        ElMessage({
          message: error.message || '退出登录失败，请重试',
          type: 'error',
          duration: 2000
        })
      }
      
      return Promise.resolve(false)
    }
  }
}

export default auth