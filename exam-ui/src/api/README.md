# 考试系统 API 服务文档

本文档详细介绍了考试系统前端API服务的结构、使用方法和最佳实践。

## API 服务架构

我们的API服务采用分层架构设计，包含以下几个核心部分：

1. **基础配置层** - 提供axios实例配置和拦截器
2. **服务层** - 按照业务模块组织的API服务集合
3. **工具层** - 提供通用API调用工具函数
4. **Mock层** - 开发环境中的模拟数据服务

## 目录结构

```
src/api/
├── axios.js                 # axios实例配置和拦截器
├── mock.js                  # Mock服务配置
├── README.md                # 本文档
├── auth/                    # 身份验证相关API
│   └── auth.js
├── exam/                    # 考试管理相关API
│   ├── exam.js
│   └── score.js
├── question/                # 试题相关API
│   ├── question.js
│   └── paper.js
└── user/                    # 用户管理相关API
    └── user.js
```

## 基础配置 (axios.js)

`axios.js` 提供了统一的HTTP客户端配置，包含以下功能：

- 统一的基础URL配置 (`/api`)
- 请求超时设置 (10秒)
- 请求拦截器（自动添加token、日志记录）
- 响应拦截器（统一错误处理、日志记录）
- 增强的错误处理机制

### 导出的API

- `instance` - 配置好的axios实例
- `api` - 封装的API调用工具函数集合

## 服务模块

### 1. 身份验证服务 (auth.js)

#### 主要方法
- `login(username, password)` - 用户登录
- `logout()` - 用户登出
- `getCurrentUser()` - 获取当前用户信息
- `refreshToken()` - 刷新访问令牌

### 2. 考试管理服务 (exam.js)

#### 主要方法
- `getExams(params)` - 获取考试列表
- `getExamDetail(id)` - 获取考试详情
- `createExam(data)` - 创建新考试
- `updateExam(id, data)` - 更新考试信息
- `deleteExam(id)` - 删除考试
- `publishExam(id)` - 发布考试
- `stopExam(id)` - 停止考试
- `getExamStatistics(id)` - 获取考试统计信息
- `exportExamData(id)` - 导出考试数据

### 3. 成绩管理服务 (score.js)

#### 主要方法
- `getScores(params)` - 获取成绩列表
- `getScoreDetail(id)` - 获取成绩详情
- `batchInputScores(data)` - 批量录入成绩
- `updateScore(id, data)` - 更新成绩
- `deleteScore(id)` - 删除成绩
- `exportScores(params)` - 导出成绩数据

### 4. 试题管理服务 (question.js)

#### 主要方法
- `getQuestions(params)` - 获取试题列表
- `createQuestion(data)` - 创建新试题
- `updateQuestion(id, data)` - 更新试题
- `deleteQuestion(id)` - 删除试题
- `batchImportQuestions(data)` - 批量导入试题
- `batchExportQuestions(params)` - 批量导出试题
- `getQuestionByType(type)` - 按类型获取试题
- `getQuestionStatistics()` - 获取试题统计信息

### 5. 试卷管理服务 (paper.js)

#### 主要方法
- `getPapers(params)` - 获取试卷列表
- `createPaper(data)` - 创建新试卷
- `updatePaper(id, data)` - 更新试卷
- `deletePaper(id)` - 删除试卷
- `getPaperDetail(id)` - 获取试卷详情
- `generatePaper(data)` - 自动生成试卷
- `previewPaper(id)` - 预览试卷
- `exportPaper(id)` - 导出试卷

### 6. 用户管理服务 (user.js)

#### 主要方法
- `getUsers(params)` - 获取用户列表
- `getUserDetail(id)` - 获取用户详情
- `createUser(data)` - 创建新用户
- `updateUser(id, data)` - 更新用户信息
- `deleteUser(id)` - 删除用户
- `updateUserRole(id, role)` - 更新用户角色
- `updateUserStatus(id, status)` - 更新用户状态
- `resetPassword(id)` - 重置用户密码
- `batchImportUsers(data)` - 批量导入用户

## Mock 服务 (mock.js)

Mock服务在开发环境中提供模拟数据，帮助前端开发人员在没有后端的情况下进行开发和测试。

### 功能特点
- 自动根据环境启用/禁用
- 模拟常见的API响应
- 支持错误状态码模拟
- 可自定义模拟延迟

### 使用方法
Mock服务会在开发环境下自动启动，无需手动配置。

## 使用示例

### 1. 基本API调用

```javascript
import { authService } from '@/api/auth/auth';

// 用户登录
try {
  const response = await authService.login('admin', 'password');
  console.log('登录成功:', response);
} catch (error) {
  console.error('登录失败:', error.message);
}
```

### 2. 获取列表数据

```javascript
import { examService } from '@/api/exam/exam';

// 获取考试列表
try {
  const params = {
    page: 1,
    pageSize: 10,
    keyword: '数学',
    status: 'active'
  };
  const response = await examService.getExams(params);
  console.log('考试列表:', response.list);
  console.log('总数:', response.total);
} catch (error) {
  console.error('获取考试列表失败:', error.message);
}
```

### 3. 创建/更新数据

```javascript
import { questionService } from '@/api/question/question';

// 创建新试题
try {
  const questionData = {
    content: '1 + 1 = ?',
    type: 'single_choice',
    options: ['1', '2', '3', '4'],
    answer: '2',
    score: 5,
    difficulty: 'easy'
  };
  const response = await questionService.createQuestion(questionData);
  console.log('创建试题成功:', response);
} catch (error) {
  console.error('创建试题失败:', error.message);
}
```

## 错误处理最佳实践

1. **使用 try/catch 捕获 API 错误**
2. **检查错误类型和错误码**
3. **提供友好的用户提示**
4. **处理特殊错误（如401未授权）**

```javascript
try {
  const response = await someApiService.someMethod();
  // 处理成功响应
} catch (error) {
  if (error.isApiError) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        // 处理登录过期
        showMessage('登录已过期，请重新登录');
        break;
      case 'FORBIDDEN':
        // 处理权限不足
        showMessage('您没有权限执行此操作');
        break;
      case 'VALIDATION_ERROR':
        // 处理数据验证错误
        showMessage(error.message);
        break;
      default:
        // 处理其他错误
        showMessage(`操作失败: ${error.message}`);
    }
  } else {
    // 处理非API错误
    showMessage('系统错误，请稍后重试');
  }
}
```

## 集成测试

我们提供了API集成测试脚本，可以在`tests/api/integration.test.js`中找到。该脚本可以验证API服务的基本功能。

### 运行测试

```bash
# 运行API集成测试
npm run test:api
```

## 注意事项

1. 所有API调用都应使用服务模块中提供的方法，而不是直接使用axios实例
2. 错误处理应遵循统一的模式
3. 开发环境中可以使用Mock服务进行测试
4. 生产环境中应确保正确配置API基础URL
5. 敏感操作前应验证用户权限

## 版本历史

- v1.0.0 (2024-04) - 初始版本，实现基础API服务架构