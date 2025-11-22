import axios from './axios';

/**
 * API Mock服务
 * 在开发环境中模拟后端API响应
 */
class ApiMockService {
  constructor() {
    // 检查是否需要启用Mock
    this.isEnabled = process.env.NODE_ENV === 'development';
    
    // 模拟数据
    this.mockData = {
      currentUser: {
        id: 1,
        username: 'admin',
        name: '管理员',
        role: 'admin',
        permissions: ['all']
      },
      exams: [
        {
          id: 1,
          name: '2024春季数学期中考试',
          subject: '数学',
          grade: '高一年级',
          time: '2024-04-20T10:00:00',
          duration: 90,
          status: 'scheduled',
          totalParticipants: 45
        },
        {
          id: 2,
          name: '2024春季英语期中考试',
          subject: '英语',
          grade: '高一年级',
          time: '2024-04-21T14:00:00',
          duration: 120,
          status: 'scheduled',
          totalParticipants: 45
        }
      ],
      users: [
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          role: 'admin',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 'active'
        },
        {
          id: 2,
          username: 'teacher1',
          name: '张老师',
          role: 'teacher',
          email: 'teacher1@example.com',
          phone: '13900139000',
          status: 'active'
        },
        {
          id: 3,
          username: 'student1',
          name: '李同学',
          role: 'student',
          email: 'student1@example.com',
          phone: '13700137000',
          status: 'active'
        }
      ],
      notifications: [
        {
          id: 1,
          type: 'system',
          title: '系统更新通知',
          description: '考试系统已于今日完成更新，新增了多项功能',
          time: '2024-04-15T09:00:00',
          read: false
        },
        {
          id: 2,
          type: 'exam',
          title: '考试安排通知',
          description: '2024春季期中考试将于下周一正式开始，请做好准备',
          time: '2024-04-14T14:00:00',
          read: false
        }
      ],
      stats: {
        totalExams: 15,
        totalUsers: 120,
        totalQuestions: 500,
        activeExams: 3
      }
    };
  }

  /**
   * 启动Mock服务
   * 拦截axios请求并返回模拟数据
   */
  start() {
    if (!this.isEnabled) {
      console.log('API Mock服务已禁用，当前为非开发环境');
      return;
    }

    console.log('启动API Mock服务...');

    // 请求拦截器 - 模拟API响应
    axios.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么 - 检查是否需要返回mock数据
        console.log('拦截API请求:', config.method?.toUpperCase(), config.url);
        
        // 根据URL和方法返回相应的模拟数据
        const mockResponse = this.getMockResponse(config.method, config.url, config.data);
        if (mockResponse) {
          // 创建一个Promise来模拟异步响应
          return Promise.resolve({
            ...config,
            adapter: async () => {
              // 模拟网络延迟
              await new Promise(resolve => setTimeout(resolve, 300));
              return {
                data: mockResponse.data,
                status: mockResponse.status,
                statusText: mockResponse.statusText || 'OK',
                headers: mockResponse.headers || {},
                config
              };
            }
          });
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    console.log('API Mock服务启动完成');
  }

  /**
   * 根据请求方法和URL返回模拟响应
   */
  getMockResponse(method, url, requestData) {
    const path = url?.split('?')[0]; // 去除查询参数
    
    // 健康检查
    if (path === '/api/health') {
      return {
        status: 200,
        data: { status: 'ok', message: 'Exam System API is running' }
      };
    }

    // 认证相关
    if (path === '/api/auth/login') {
      if (method === 'post' && requestData?.username === 'admin' && requestData?.password === 'password') {
        return {
          status: 200,
          data: {
            token: 'mock-jwt-token-123456',
            user: this.mockData.currentUser
          }
        };
      }
      return {
        status: 401,
        data: { error: '用户名或密码错误' }
      };
    }

    if (path === '/api/auth/me') {
      return {
        status: 200,
        data: this.mockData.currentUser
      };
    }

    // 考试相关
    if (path === '/api/exams' && method === 'get') {
      return {
        status: 200,
        data: {
          list: this.mockData.exams,
          total: this.mockData.exams.length
        }
      };
    }

    // 用户相关
    if (path === '/api/users' && method === 'get') {
      return {
        status: 200,
        data: {
          list: this.mockData.users,
          total: this.mockData.users.length
        }
      };
    }

    // 统计数据
    if (path === '/api/stats' && method === 'get') {
      return {
        status: 200,
        data: this.mockData.stats
      };
    }

    // 通知相关
    if (path === '/api/notifications' && method === 'get') {
      return {
        status: 200,
        data: this.mockData.notifications
      };
    }

    // 未匹配到的请求
    return null;
  }

  /**
   * 停止Mock服务
   */
  stop() {
    // 清除拦截器
    axios.interceptors.request.clear();
    console.log('API Mock服务已停止');
  }
}

// 创建单例实例
const mockService = new ApiMockService();

// 自动启动Mock服务
export const startMockService = () => {
  mockService.start();
};

export default mockService;