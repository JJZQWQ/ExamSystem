import api from '../axios'

/**
 * 试题相关API服务
 */
const questionService = {
  /**
   * 获取试题列表
   * @param {Object} params - 查询参数
   * @param {string} params.type - 试题类型（可选）
   * @param {string} params.category - 试题分类（可选）
   * @param {string} params.keyword - 关键词搜索（可选）
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @returns {Promise} 试题列表
   */
  getQuestions: (params) => {
    return api.get('/questions', { params })
  },

  /**
   * 获取试题详情
   * @param {number} id - 试题ID
   * @returns {Promise} 试题详情
   */
  getQuestionDetail: (id) => {
    return api.get(`/questions/${id}`)
  },

  /**
   * 创建试题
   * @param {Object} questionData - 试题数据
   * @returns {Promise} 创建结果
   */
  createQuestion: (questionData) => {
    return api.post('/questions', questionData)
  },

  /**
   * 更新试题
   * @param {number} id - 试题ID
   * @param {Object} questionData - 试题数据
   * @returns {Promise} 更新结果
   */
  updateQuestion: (id, questionData) => {
    return api.put(`/questions/${id}`, questionData)
  },

  /**
   * 删除试题
   * @param {number} id - 试题ID
   * @returns {Promise} 删除结果
   */
  deleteQuestion: (id) => {
    return api.delete(`/questions/${id}`)
  },

  /**
   * 批量删除试题
   * @param {Array<number>} ids - 试题ID数组
   * @returns {Promise} 删除结果
   */
  batchDeleteQuestions: (ids) => {
    return api.delete('/questions/batch', { data: { ids } })
  },

  /**
   * 导入试题
   * @param {FormData} formData - 包含试题文件的FormData
   * @returns {Promise} 导入结果
   */
  importQuestions: (formData) => {
    return api.post('/questions/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  /**
   * 导出试题
   * @param {Object} params - 导出参数
   * @returns {Promise} 导出文件
   */
  exportQuestions: (params) => {
    return api.get('/questions/export', { 
      params, 
      responseType: 'blob' 
    })
  }
}

export default questionService