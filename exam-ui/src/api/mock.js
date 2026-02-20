import axios from './axios';

/**
 * API Mock服务
 * 在开发环境中模拟后端API响应
 */
class ApiMockService {
  constructor() {
    // 检查是否需要启用Mock
    this.isEnabled = process.env.NODE_ENV === 'development';

    // 模拟数据 - 扩展完整的数据集
    this.mockData = {
      // 当前用户信息
      currentUser: {
        id: 1,
        username: 'admin',
        name: '管理员',
        role: 'admin',
        permissions: ['all'],
        email: 'admin@example.com',
        phone: '13800138000',
        department: '信息中心',
        position: '系统管理员',
        lastLogin: '2023-06-15T08:30:00',
        avatar: ''
      },

      // 考试数据 - 支持多种状态和详细信息
      exams: [
        {
          id: 1,
          name: 'Vue.js中级考试',
          subject: '前端开发',
          category: '期末考试',
          startTime: '2023-06-15T14:00:00',
          endTime: '2023-06-15T16:00:00',
          participants: 45,
          actualParticipants: 42,
          passRate: 85.7,
          creator: '张老师',
          creatorId: 2,
          createTime: '2023-06-01T00:00:00',
          status: '进行中', // 兼容中文状态描述
          paperId: 1,
          description: '本次考试主要考察Vue.js框架的中级应用知识，包括组件通信、路由配置等内容。',
          isPublic: true,
          visibility: 'all',
          // 兼容旧格式
          grade: '计算机系',
          time: '2023-06-15T14:00:00',
          duration: 120,
          totalParticipants: 45
        },
        {
          id: 2,
          name: 'React基础测试',
          subject: '前端开发',
          category: '期中考试',
          startTime: '2023-06-14T10:00:00',
          endTime: '2023-06-14T11:30:00',
          participants: 32,
          actualParticipants: 30,
          passRate: 90.0,
          creator: '李老师',
          creatorId: 3,
          createTime: '2023-05-28T00:00:00',
          status: '已完成',
          paperId: 2,
          description: 'React基础知识测试，包括组件概念、JSX语法等内容。',
          isPublic: true,
          visibility: 'all',
          grade: '计算机系',
          time: '2023-06-14T10:00:00',
          duration: 90,
          totalParticipants: 32
        },
        {
          id: 3,
          name: 'Java编程实战',
          subject: '后端开发',
          category: '期末考试',
          startTime: '2023-06-16T09:30:00',
          endTime: '2023-06-16T11:30:00',
          participants: 28,
          actualParticipants: 0,
          passRate: 0,
          creator: '王老师',
          creatorId: 4,
          createTime: '2023-06-05T00:00:00',
          status: '未开始',
          paperId: 3,
          description: 'Java编程实战考试，重点考察面向对象编程和实际项目开发能力。',
          isPublic: true,
          visibility: 'all',
          grade: '计算机系',
          time: '2023-06-16T09:30:00',
          duration: 120,
          totalParticipants: 28
        },
        {
          id: 4,
          name: '数据库原理考试',
          subject: '数据库',
          category: '期中考试',
          startTime: '2023-06-10T14:00:00',
          endTime: '2023-06-10T16:00:00',
          participants: 56,
          actualParticipants: 54,
          passRate: 75.9,
          creator: '赵老师',
          creatorId: 5,
          createTime: '2023-05-25T00:00:00',
          status: '已完成',
          paperId: 4,
          description: '数据库原理考试，包括SQL查询、事务管理等内容。',
          isPublic: true,
          visibility: 'all',
          grade: '计算机系',
          time: '2023-06-10T14:00:00',
          duration: 120,
          totalParticipants: 56
        },
        {
          id: 5,
          name: 'Python数据分析',
          subject: '数据科学',
          category: '模拟考试',
          startTime: '2023-06-18T10:00:00',
          endTime: '2023-06-18T12:00:00',
          participants: 38,
          actualParticipants: 0,
          passRate: 0,
          creator: '陈老师',
          creatorId: 6,
          createTime: '2023-06-08T00:00:00',
          status: '未开始',
          paperId: 5,
          description: 'Python数据分析模拟考试，考察pandas、numpy等库的使用能力。',
          isPublic: true,
          visibility: 'all',
          grade: '计算机系',
          time: '2023-06-18T10:00:00',
          duration: 120,
          totalParticipants: 38
        }
      ],

      // 用户数据 - 包含教师和学生信息
      users: [
        {
          id: 1,
          username: 'admin',
          name: '管理员',
          role: 'admin',
          email: 'admin@example.com',
          phone: '13800138000',
          status: 'active',
          createTime: '2023-01-01T00:00:00',
          department: '信息中心',
          position: '系统管理员',
          lastLogin: '2023-06-15T08:30:00',
          avatar: ''
        },
        {
          id: 2,
          username: 'teacher1',
          name: '张老师',
          role: 'teacher',
          email: 'teacher1@example.com',
          phone: '13900139000',
          status: 'active',
          createTime: '2023-01-02T00:00:00',
          department: '计算机系',
          position: '讲师',
          lastLogin: '2023-06-14T15:20:00',
          avatar: ''
        },
        {
          id: 3,
          username: 'teacher2',
          name: '李老师',
          role: 'teacher',
          email: 'teacher2@example.com',
          phone: '13800138002',
          status: 'active',
          createTime: '2023-01-03T00:00:00',
          department: '计算机系',
          position: '副教授',
          lastLogin: '2023-06-15T09:45:00',
          avatar: ''
        },
        {
          id: 4,
          username: 'student1',
          name: '李同学',
          role: 'student',
          email: 'student1@example.com',
          phone: '13700137000',
          status: 'active',
          createTime: '2023-02-01T00:00:00',
          department: '计算机系',
          grade: '大三',
          class: '计科1班',
          lastLogin: '2023-06-15T10:15:00',
          avatar: ''
        },
        {
          id: 5,
          username: 'student2',
          name: '王同学',
          role: 'student',
          email: 'student2@example.com',
          phone: '13800138004',
          status: 'active',
          createTime: '2023-02-02T00:00:00',
          department: '计算机系',
          grade: '大三',
          class: '计科1班',
          lastLogin: '2023-06-14T20:30:00',
          avatar: ''
        },
        {
          id: 6,
          username: 'student3',
          name: '张同学',
          role: 'student',
          email: 'student3@example.com',
          phone: '13800138005',
          status: 'inactive',
          createTime: '2023-02-03T00:00:00',
          department: '计算机系',
          grade: '大三',
          class: '计科2班',
          lastLogin: '2023-06-01T14:20:00',
          avatar: ''
        }
      ],

      // 试题数据 - 包含多种题型
      questions: [
        {
          id: 1,
          stem: 'Vue.js是一个用于构建用户界面的渐进式框架，它的核心库只关注视图层。',
          category: '综合考试题库',
          type: '单选题',
          options: [
            { content: '正确' },
            { content: '错误' }
          ],
          answer: '正确',
          analysis: 'Vue.js的核心库确实只关注视图层，便于与第三方库或既有项目整合。',
          difficulty: 3,
          score: 5,
          status: 'active',
          createTime: '2023-06-01T10:00:00',
          creatorId: 1,
          usageCount: 12
        },
        {
          id: 2,
          stem: 'React是Facebook开发的一个用于构建用户界面的JavaScript库。',
          category: '拓展考试题库',
          type: '判断题',
          answer: '正确',
          analysis: 'React确实是由Facebook（现在的Meta）开发的JavaScript库，用于构建用户界面。',
          difficulty: 2,
          score: 3,
          status: 'active',
          createTime: '2023-06-02T14:30:00',
          creatorId: 2,
          usageCount: 8
        },
        {
          id: 3,
          stem: '请简述Vue.js的生命周期。',
          category: '在线测试题库',
          type: '简答题',
          answer: 'Vue.js的生命周期包括创建、挂载、更新和销毁四个阶段。创建阶段包括beforeCreate和created；挂载阶段包括beforeMount和mounted；更新阶段包括beforeUpdate和updated；销毁阶段包括beforeUnmount和unmounted。',
          analysis: 'Vue.js的生命周期钩子允许我们在组件的不同阶段执行特定的操作，掌握生命周期对于Vue.js开发非常重要。',
          difficulty: 4,
          score: 10,
          status: 'inactive',
          createTime: '2023-06-03T09:15:00',
          creatorId: 3,
          usageCount: 0
        },
        {
          id: 4,
          stem: 'JavaScript中的闭包是指什么？',
          category: '案例题库',
          type: '填空题',
          answer: '有权访问另一个函数作用域中变量的函数',
          analysis: '闭包是JavaScript的一个重要特性，它允许函数访问并操作其外部函数中声明的变量。',
          difficulty: 5,
          score: 8,
          status: 'active',
          createTime: '2023-06-04T16:45:00',
          creatorId: 1,
          usageCount: 6
        },
        {
          id: 5,
          stem: '以下哪些是Vue.js的指令？',
          category: '综合考试题库',
          type: '多选题',
          options: [
            { content: 'v-if' },
            { content: 'v-for' },
            { content: 'v-model' },
            { content: 'v-script' }
          ],
          answer: ['v-if', 'v-for', 'v-model'],
          analysis: 'Vue.js的核心指令包括v-if（条件渲染）、v-for（列表渲染）、v-model（双向绑定）等，而v-script不是Vue.js的标准指令。',
          difficulty: 3,
          score: 6,
          status: 'active',
          createTime: '2023-06-05T11:20:00',
          creatorId: 2,
          usageCount: 15
        },
        {
          id: 6,
          stem: 'CSS中的盒模型不包括以下哪个部分？',
          category: '综合考试题库',
          type: '单选题',
          options: [
            { content: '内容(content)' },
            { content: '内边距(padding)' },
            { content: '边框(border)' },
            { content: '装饰(decoration)' }
          ],
          answer: '装饰(decoration)',
          analysis: 'CSS盒模型包括内容(content)、内边距(padding)、边框(border)和外边距(margin)四个部分，装饰(decoration)不属于盒模型。',
          difficulty: 2,
          score: 4,
          status: 'active',
          createTime: '2023-06-06T14:00:00',
          creatorId: 3,
          usageCount: 20
        }
      ],

      // 试卷数据
      papers: [
        {
          id: 1,
          name: '前端开发期末试卷',
          examId: 1,
          questions: [1, 5, 6],
          totalScore: 100,
          duration: 120,
          createTime: '2023-06-01T00:00:00',
          creatorId: 1,
          lastUpdate: '2023-06-01T00:00:00',
          status: 'published',
          description: '前端开发期末综合测试卷，涵盖Vue.js、CSS等前端核心知识点。',
          questionCount: 3
        },
        {
          id: 2,
          name: 'React基础测试卷',
          examId: 2,
          questions: [2],
          totalScore: 50,
          duration: 90,
          createTime: '2023-05-28T00:00:00',
          creatorId: 2,
          lastUpdate: '2023-05-28T00:00:00',
          status: 'published',
          description: 'React基础知识测试卷，主要考察React核心概念。',
          questionCount: 1
        },
        {
          id: 3,
          name: 'Java编程实战试卷',
          examId: 3,
          questions: [],
          totalScore: 100,
          duration: 120,
          createTime: '2023-06-05T00:00:00',
          creatorId: 3,
          lastUpdate: '2023-06-05T00:00:00',
          status: 'draft',
          description: 'Java编程实战测试卷，重点考察面向对象编程和实际编码能力。',
          questionCount: 0
        }
      ],

      // 通知数据
      notifications: [
        {
          id: 1,
          type: 'system',
          title: '系统更新通知',
          description: '考试系统已于今日完成更新，新增了多项功能',
          time: '2024-04-15T09:00:00',
          read: false,
          createTime: '2024-04-15T09:00:00'
        },
        {
          id: 2,
          type: 'exam',
          title: '考试安排通知',
          description: '2024春季期中考试将于下周一正式开始，请做好准备',
          time: '2024-04-14T14:00:00',
          read: false,
          createTime: '2024-04-14T14:00:00'
        },
        {
          id: 3,
          type: 'exam',
          title: '考试即将开始',
          description: 'Vue.js中级考试将于今天下午2点开始，请做好准备。',
          time: '2023-06-15T10:00:00',
          read: false,
          createTime: '2023-06-15T10:00:00',
          relatedId: 1
        },
        {
          id: 4,
          type: 'system',
          title: '系统维护通知',
          description: '考试系统将于今晚12点进行例行维护，请提前做好安排。',
          time: '2023-06-14T18:00:00',
          read: true,
          createTime: '2023-06-14T18:00:00'
        },
        {
          id: 5,
          type: 'user',
          title: '新用户注册',
          description: '用户"student3"已完成注册，请及时审核。',
          time: '2023-06-15T09:15:00',
          read: false,
          createTime: '2023-06-15T09:15:00',
          relatedId: 6
        }
      ],

      // 统计数据 - Dashboard页面所需
      stats: {
        totalExams: 5,
        runningExams: 1,
        completedExams: 2,
        upcomingExams: 2,
        totalQuestions: 6,
        activeQuestions: 5,
        draftQuestions: 1,
        totalUsers: 6,
        activeUsers: 5,
        pendingUsers: 1,
        totalPapers: 3,
        publishedPapers: 2,
        draftPapers: 1,
        unreadNotifications: 3,
        // 兼容旧格式
        totalParticipants: 199,
        activeExams: 1
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

        // 使用扩展的请求拦截器逻辑
        const mockResponse = this.requestInterceptor(config);
        if (mockResponse) {
          // 创建一个Promise来模拟异步响应
          return Promise.resolve({
            ...config,
            adapter: async () => {
              // 模拟网络延迟
              await new Promise(resolve => setTimeout(resolve, 300));
              return {
                data: mockResponse.data,
                status: 200,
                statusText: 'OK',
                headers: {},
                config
              };
            }
          });
        }

        // 如果没有匹配的mock响应，尝试使用原来的getMockResponse方法
        const originalMockResponse = this.getMockResponse(config.method, config.url, config.data);
        if (originalMockResponse) {
          // 创建一个Promise来模拟异步响应
          return Promise.resolve({
            ...config,
            adapter: async () => {
              // 模拟网络延迟
              await new Promise(resolve => setTimeout(resolve, 300));
              return {
                data: originalMockResponse.data,
                status: originalMockResponse.status,
                statusText: originalMockResponse.statusText || 'OK',
                headers: originalMockResponse.headers || {},
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
   * 请求拦截器 - 扩展覆盖所有主要API端点
   */
  requestInterceptor(config) {
    const { url, method } = config;
    const path = url?.split('?')[0]; // 去除查询参数

    // 模拟登录请求
    if (path === '/api/auth/login' && method === 'post') {
      return {
        data: {
          success: true,
          token: 'mock-token-123456',
          user: this.mockData.currentUser
        }
      };
    }

    // 模拟退出登录
    if (path === '/api/auth/logout' && method === 'post') {
      return {
        data: {
          success: true,
          message: '退出成功'
        }
      };
    }

    // 模拟获取考试列表 - 支持分页和筛选
    if (path === '/api/exams' && method === 'get') {
      // 提取查询参数
      const params = this.extractParams(config);
      const page = parseInt(params.page) || 1;
      const pageSize = parseInt(params.pageSize) || 10;
      const search = params.search || '';
      const status = params.status;

      // 过滤和分页
      let filteredExams = [...this.mockData.exams];
      if (search) {
        filteredExams = filteredExams.filter(exam =>
          exam.name.toLowerCase().includes(search.toLowerCase()) ||
          exam.subject.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (status) {
        filteredExams = filteredExams.filter(exam => exam.status === status);
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedExams = filteredExams.slice(start, end);

      return {
        data: {
          success: true,
          data: paginatedExams,
          total: filteredExams.length,
          page: page,
          pageSize: pageSize
        }
      };
    }

    // 模拟获取单个考试详情
    if (path.match(/^\/api\/exams\/\d+$/) && method === 'get') {
      const examId = parseInt(path.split('/').pop());
      const exam = this.mockData.exams.find(e => e.id === examId);
      return {
        data: {
          success: true,
          data: exam || null
        }
      };
    }

    // 模拟获取用户列表
    if (path === '/api/users' && method === 'get') {
      const params = this.extractParams(config);
      const page = parseInt(params.page) || 1;
      const pageSize = parseInt(params.pageSize) || 10;
      const search = params.search || '';
      const role = params.role;

      // 过滤和分页
      let filteredUsers = [...this.mockData.users];
      if (search) {
        filteredUsers = filteredUsers.filter(user =>
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.username.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (role) {
        filteredUsers = filteredUsers.filter(user => user.role === role);
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedUsers = filteredUsers.slice(start, end);

      return {
        data: {
          success: true,
          data: paginatedUsers,
          total: filteredUsers.length,
          page: page,
          pageSize: pageSize
        }
      };
    }

    // 模拟获取当前用户信息
    if (path === '/api/auth/me' && method === 'get') {
      return {
        data: {
          success: true,
          data: this.mockData.currentUser
        }
      };
    }

    // 模拟获取通知列表
    if (path === '/api/notifications' && method === 'get') {
      const params = this.extractParams(config);
      const page = parseInt(params.page) || 1;
      const pageSize = parseInt(params.pageSize) || 10;
      const unreadOnly = params.unreadOnly === 'true';

      // 过滤和分页
      let filteredNotifications = [...this.mockData.notifications];
      if (unreadOnly) {
        filteredNotifications = filteredNotifications.filter(n => !n.read);
      }

      // 按时间倒序排序
      filteredNotifications.sort((a, b) =>
        new Date(b.createTime) - new Date(a.createTime)
      );

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedNotifications = filteredNotifications.slice(start, end);

      return {
        data: {
          success: true,
          data: paginatedNotifications,
          total: filteredNotifications.length,
          page: page,
          pageSize: pageSize
        }
      };
    }

    // 模拟标记通知已读
    if (path.match(/^\/api\/notifications\/\d+\/read$/) && method === 'put') {
      const notificationId = parseInt(path.split('/').slice(-2, -1)[0]);
      const notification = this.mockData.notifications.find(n => n.id === notificationId);
      if (notification) {
        notification.read = true;
      }
      return {
        data: {
          success: true,
          message: '标记成功'
        }
      };
    }

    // 模拟获取统计数据
    if (path === '/api/stats' && method === 'get') {
      return {
        data: {
          success: true,
          data: this.mockData.stats
        }
      };
    }

    // 模拟获取最近考试
    if (path === '/api/exams/recent' && method === 'get') {
      const recentExams = [...this.mockData.exams]
        .sort((a, b) => new Date(b.createTime) - new Date(a.createTime))
        .slice(0, 5);

      return {
        data: {
          success: true,
          data: recentExams
        }
      };
    }

    // 模拟获取试题列表
    if (path === '/api/questions' && method === 'get') {
      const params = this.extractParams(config);
      const page = parseInt(params.page) || 1;
      const pageSize = parseInt(params.pageSize) || 10;
      const search = params.search || '';
      const type = params.type;
      const category = params.category;
      const status = params.status;

      // 过滤和分页
      let filteredQuestions = [...this.mockData.questions];
      if (search) {
        filteredQuestions = filteredQuestions.filter(q =>
          q.stem.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (type) {
        filteredQuestions = filteredQuestions.filter(q => q.type === type);
      }
      if (category) {
        filteredQuestions = filteredQuestions.filter(q => q.category === category);
      }
      if (status) {
        filteredQuestions = filteredQuestions.filter(q => q.status === status);
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedQuestions = filteredQuestions.slice(start, end);

      return {
        data: {
          success: true,
          data: paginatedQuestions,
          total: filteredQuestions.length,
          page: page,
          pageSize: pageSize
        }
      };
    }

    // 模拟获取单个试题详情
    if (path.match(/^\/api\/questions\/\d+$/) && method === 'get') {
      const questionId = parseInt(path.split('/').pop());
      const question = this.mockData.questions.find(q => q.id === questionId);
      return {
        data: {
          success: true,
          data: question || null
        }
      };
    }

    // 模拟获取试卷列表
    if (path === '/api/papers' && method === 'get') {
      const params = this.extractParams(config);
      const page = parseInt(params.page) || 1;
      const pageSize = parseInt(params.pageSize) || 10;
      const search = params.search || '';
      const status = params.status;

      // 过滤和分页
      let filteredPapers = [...this.mockData.papers];
      if (search) {
        filteredPapers = filteredPapers.filter(p =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (status) {
        filteredPapers = filteredPapers.filter(p => p.status === status);
      }

      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedPapers = filteredPapers.slice(start, end);

      return {
        data: {
          success: true,
          data: paginatedPapers,
          total: filteredPapers.length,
          page: page,
          pageSize: pageSize
        }
      };
    }

    // 模拟获取单个试卷详情
    if (path.match(/^\/api\/papers\/\d+$/) && method === 'get') {
      const paperId = parseInt(path.split('/').pop());
      const paper = this.mockData.papers.find(p => p.id === paperId);
      if (paper) {
        // 补充试卷中的题目详情
        const detailedPaper = {
          ...paper,
          questionDetails: paper.questions.map(qId =>
            this.mockData.questions.find(q => q.id === qId)
          ).filter(Boolean)
        };
        return {
          data: {
            success: true,
            data: detailedPaper
          }
        };
      }
      return {
        data: {
          success: true,
          data: null
        }
      };
    }

    // 返回null表示没有匹配的mock响应
    return null;
  }

  /**
   * 辅助方法：提取URL参数
   */
  extractParams(config) {
    const params = {};
    if (config.url && config.url.includes('?')) {
      const queryString = config.url.split('?')[1];
      queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value);
      });
    }
    return params;
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
