import api from '../axios'

/**
 * 试卷相关API服务
 */
const paperService = {
  /**
   * 获取试卷列表
   * @param {Object} params - 查询参数
   * @param {string} params.name - 试卷名称（可选）
   * @param {number} params.page - 页码
   * @param {number} params.size - 每页大小
   * @returns {Promise} 试卷列表
   */
  getPapers: (params) => {
    return api.get('/papers', { params })
  },

  /**
   * 获取试卷详情
   * @param {number} id - 试卷ID
   * @returns {Promise} 试卷详情
   */
  getPaperDetail: (id) => {
    return api.get(`/papers/${id}`)
  },

  /**
   * 创建试卷
   * @param {Object} paperData - 试卷数据
   * @returns {Promise} 创建结果
   */
  createPaper: (paperData) => {
    return api.post('/papers', paperData)
  },

  /**
   * 更新试卷
   * @param {number} id - 试卷ID
   * @param {Object} paperData - 试卷数据
   * @returns {Promise} 更新结果
   */
  updatePaper: (id, paperData) => {
    return api.put(`/papers/${id}`, paperData)
  },

  /**
   * 删除试卷
   * @param {number} id - 试卷ID
   * @returns {Promise} 删除结果
   */
  deletePaper: (id) => {
    return api.delete(`/papers/${id}`)
  },

  /**
   * 批量删除试卷
   * @param {Array<number>} ids - 试卷ID数组
   * @returns {Promise} 删除结果
   */
  batchDeletePapers: (ids) => {
    return api.delete('/papers/batch', { data: { ids } })
  },

  /**
   * 预览试卷
   * @param {number} id - 试卷ID
   * @returns {Promise} 试卷预览数据
   */
  previewPaper: (id) => {
    return api.get(`/papers/${id}/preview`)
  },

  /**
   * 生成试卷（随机组卷）
   * @param {Object} params - 组卷参数
   * @param {number} params.categoryId - 分类ID
   * @param {number} params.totalScore - 总分
   * @param {Array} params.questionTypes - 试题类型配置
   * @returns {Promise} 生成的试卷数据
   */
  generatePaper: (params) => {
    return api.post('/papers/generate', params)
  }
}

export default paperService