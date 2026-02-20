import api from '../axios'

/**
 * 考试成绩相关API服务
 */
const scoreService = {
  /**
   * 获取考试成绩列表
   * @param {Object} params - 查询参数
   * @param {number} params.examId - 考试ID
   * @param {string} params.studentName - 学生姓名（可选）
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @returns {Promise} 成绩列表
   */
  getScores: (params) => {
    return api.get('/scores', { params })
  },

  /**
   * 获取学生考试成绩详情
   * @param {number} examId - 考试ID
   * @param {number} studentId - 学生ID
   * @returns {Promise} 成绩详情
   */
  getScoreDetail: (examId, studentId) => {
    return api.get(`/scores/exam/${examId}/student/${studentId}`)
  },

  /**
   * 批量录入成绩
   * @param {Object} data - 成绩数据
   * @param {number} data.examId - 考试ID
   * @param {Array} data.scores - 成绩数组
   * @returns {Promise} 录入结果
   */
  batchInputScores: (data) => {
    return api.post('/scores/batch', data)
  },

  /**
   * 更新成绩
   * @param {number} scoreId - 成绩ID
   * @param {Object} scoreData - 成绩数据
   * @returns {Promise} 更新结果
   */
  updateScore: (scoreId, scoreData) => {
    return api.put(`/scores/${scoreId}`, scoreData)
  },

  /**
   * 删除成绩
   * @param {number} scoreId - 成绩ID
   * @returns {Promise} 删除结果
   */
  deleteScore: (scoreId) => {
    return api.delete(`/scores/${scoreId}`)
  },

  /**
   * 导出考试成绩
   * @param {number} examId - 考试ID
   * @returns {Promise} 导出文件
   */
  exportScores: (examId) => {
    return api.get(`/scores/exam/${examId}/export`, { responseType: 'blob' })
  }
}

export default scoreService