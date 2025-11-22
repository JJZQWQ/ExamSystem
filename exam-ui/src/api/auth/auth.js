import { api } from '../axios'

/**
 * 认证相关API服务
 */
const authService = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @returns {Promise} 登录结果
   */
  login: (credentials) => {
    return api.post('/auth/login', credentials)
  },

  /**
   * 用户登出
   * @returns {Promise} 登出结果
   */
  logout: () => {
    return api.post('/auth/logout')
  },

  /**
   * 获取当前用户信息
   * @returns {Promise} 用户信息
   */
  getCurrentUser: () => {
    return api.get('/auth/user')
  },

  /**
   * 刷新token
   * @returns {Promise} 新token
   */
  refreshToken: () => {
    return api.post('/auth/refresh')
  }
}

export default authService