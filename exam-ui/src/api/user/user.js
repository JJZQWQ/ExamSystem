import api from '../axios'

/**
 * 用户相关API服务
 */
const userService = {
  /**
   * 获取用户列表
   * @param {Object} params - 查询参数
   * @param {string} params.name - 用户名（可选）
   * @param {string} params.role - 用户角色（可选）
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @returns {Promise} 用户列表
   */
  getUsers: (params) => {
    return api.get('/users', { params })
  },

  /**
   * 获取用户详情
   * @param {number} id - 用户ID
   * @returns {Promise} 用户详情
   */
  getUserDetail: (id) => {
    return api.get(`/users/${id}`)
  },

  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   * @returns {Promise} 创建结果
   */
  createUser: (userData) => {
    return api.post('/users', userData)
  },

  /**
   * 更新用户
   * @param {number} id - 用户ID
   * @param {Object} userData - 用户数据
   * @returns {Promise} 更新结果
   */
  updateUser: (id, userData) => {
    return api.put(`/users/${id}`, userData)
  },

  /**
   * 删除用户
   * @param {number} id - 用户ID
   * @returns {Promise} 删除结果
   */
  deleteUser: (id) => {
    return api.delete(`/users/${id}`)
  },

  /**
   * 批量删除用户
   * @param {Array<number>} ids - 用户ID数组
   * @returns {Promise} 删除结果
   */
  batchDeleteUsers: (ids) => {
    return api.delete('/users/batch', { data: { ids } })
  },

  /**
   * 重置用户密码
   * @param {number} id - 用户ID
   * @param {string} newPassword - 新密码
   * @returns {Promise} 重置结果
   */
  resetPassword: (id, newPassword) => {
    return api.put(`/users/${id}/reset-password`, { newPassword })
  },

  /**
   * 导入用户
   * @param {FormData} formData - 包含用户文件的FormData
   * @returns {Promise} 导入结果
   */
  importUsers: (formData) => {
    return api.post('/users/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 导出用户
   * @param {Object} params - 导出参数
   * @returns {Promise} 导出文件
   */
  exportUsers: (params) => {
    return api.get('/users/export', { 
      params, 
      responseType: 'blob' 
    })
  }
}

export default userService