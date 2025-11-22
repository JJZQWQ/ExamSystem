import axios from 'axios'

// 创建axios实例
const instance = axios.create({
  baseURL: '/api', // 基础URL，可根据实际情况修改
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // 允许携带cookies
})

/**
 * 错误处理工具函数
 * @param {Error} error - 错误对象
 * @returns {Error} - 处理后的错误对象
 */
const handleApiError = (error) => {
  let errorMessage = '未知错误'
  let errorCode = null
  
  if (error.response) {
    // 服务器返回错误状态码
    const { status, data } = error.response
    
    switch (status) {
      case 401:
        // 未授权，清除token并跳转到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        errorMessage = '登录已过期，请重新登录'
        errorCode = 'UNAUTHORIZED'
        // 添加事件通知其他组件处理登录过期
        window.dispatchEvent(new CustomEvent('auth:session-expired'))
        break
      case 403:
        errorMessage = '您没有权限执行此操作'
        errorCode = 'FORBIDDEN'
        break
      case 404:
        errorMessage = '请求的资源不存在'
        errorCode = 'NOT_FOUND'
        break
      case 422:
        errorMessage = data.message || '数据验证失败'
        errorCode = 'VALIDATION_ERROR'
        break
      case 500:
      case 502:
      case 503:
      case 504:
        errorMessage = '服务器内部错误，请稍后重试'
        errorCode = 'SERVER_ERROR'
        break
      default:
        errorMessage = data.message || `请求错误: ${status}`
        errorCode = status.toString()
    }
  } else if (error.request) {
    // 请求已发送但没有收到响应
    errorMessage = '网络连接失败，请检查网络设置'
    errorCode = 'NETWORK_ERROR'
  } else {
    // 请求配置出错
    errorMessage = error.message || '请求配置错误'
    errorCode = 'CONFIG_ERROR'
  }
  
  // 增强错误对象
  error.message = errorMessage
  error.code = errorCode
  error.isApiError = true
  
  console.error(`[API错误] ${errorCode}: ${errorMessage}`)
  
  return error
}

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token') || ''
    // 如果token存在，添加到请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    // 添加请求时间戳，用于调试和缓存控制
    config.headers['X-Request-Time'] = new Date().toISOString()
    
    // 开发环境下打印请求信息
    if (import.meta.env.DEV) {
      console.log(`[API请求] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data
      })
    }
    
    return config
  },
  error => {
    const handledError = handleApiError(error)
    return Promise.reject(handledError)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 开发环境下打印响应信息
    if (import.meta.env.DEV) {
      console.log(`[API响应] ${response.config.url}`, {
        status: response.status,
        data: response.data
      })
    }
    
    // 直接返回响应数据
    return response.data
  },
  error => {
    const handledError = handleApiError(error)
    return Promise.reject(handledError)
  }
)

/**
 * API请求工具函数
 * 提供更友好的API调用方式和错误处理
 */
export const api = {
  /**
   * 发送GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - URL查询参数
   * @param {Object} config - 额外的配置
   * @returns {Promise} - 请求Promise
   */
  get(url, params = {}, config = {}) {
    return instance.get(url, { params, ...config })
  },
  
  /**
   * 发送POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求体数据
   * @param {Object} config - 额外的配置
   * @returns {Promise} - 请求Promise
   */
  post(url, data = {}, config = {}) {
    return instance.post(url, data, config)
  },
  
  /**
   * 发送PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求体数据
   * @param {Object} config - 额外的配置
   * @returns {Promise} - 请求Promise
   */
  put(url, data = {}, config = {}) {
    return instance.put(url, data, config)
  },
  
  /**
   * 发送DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} params - URL查询参数
   * @param {Object} config - 额外的配置
   * @returns {Promise} - 请求Promise
   */
  delete(url, params = {}, config = {}) {
    return instance.delete(url, { params, ...config })
  },
  
  /**
   * 发送PATCH请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求体数据
   * @param {Object} config - 额外的配置
   * @returns {Promise} - 请求Promise
   */
  patch(url, data = {}, config = {}) {
    return instance.patch(url, data, config)
  }
}

export default instance