import api from '../axios'

/**
 * 考试相关API服务
 */
const examService = {
  /**
   * 获取考试列表
   * @param {Object} params - 查询参数
   * @param {string} params.name - 考试名称（可选）
   * @param {string} params.status - 考试状态（可选）
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @returns {Promise} 考试列表
   */
  getExams: (params) => {
    return api.get('/exams', { params })
  },

  /**
   * 获取考试详情
   * @param {number} id - 考试ID
   * @returns {Promise} 考试详情
   */
  getExamDetail: (id) => {
    return api.get(`/exams/${id}`)
  },

  /**
   * 创建考试
   * @param {Object} examData - 考试数据
   * @returns {Promise} 创建结果
   */
  createExam: (examData) => {
    return api.post('/exams', examData)
  },

  /**
   * 更新考试
   * @param {number} id - 考试ID
   * @param {Object} examData - 考试数据
   * @returns {Promise} 更新结果
   */
  updateExam: (id, examData) => {
    return api.put(`/exams/${id}`, examData)
  },

  /**
   * 删除考试
   * @param {number} id - 考试ID
   * @returns {Promise} 删除结果
   */
  deleteExam: (id) => {
    return api.delete(`/exams/${id}`)
  },

  /**
   * 批量删除考试
   * @param {Array<number>} ids - 考试ID数组
   * @returns {Promise} 删除结果
   */
  batchDeleteExams: (ids) => {
    return api.delete('/exams/batch', { data: { ids } })
  },

  /**
   * 发布考试
   * @param {number} id - 考试ID
   * @returns {Promise} 发布结果
   */
  publishExam: (id) => {
    return api.put(`/exams/${id}/publish`)
  },

  /**
   * 获取考试统计信息
   * @returns {Promise} 统计信息
   */
  getExamStats: () => {
    return api.get('/exams/stats')
  }
}

export default examService