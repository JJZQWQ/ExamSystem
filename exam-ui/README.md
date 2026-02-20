# 考试系统前端

考试系统是一个基于Vue 3和Vite的现代化Web应用，提供完整的在线考试管理功能。

## 项目概述

本项目是考试系统的前端部分，负责提供用户界面和与后端API的交互。系统支持用户管理、考试管理、试题管理、试卷管理和成绩管理等核心功能。

## 技术栈

- **框架**: Vue 3
- **构建工具**: Vite
- **UI组件库**: Element Plus
- **路由**: Vue Router
- **HTTP客户端**: Axios
- **动画库**: Animate.css

## API服务架构

系统采用分层架构设计的API服务，主要包括：

1. **基础配置层** - 提供统一的axios实例配置和拦截器
2. **服务层** - 按业务模块组织的API服务集合
3. **Mock层** - 开发环境的模拟数据服务

### API服务模块

- **auth**: 身份验证相关API（登录、登出、获取用户信息等）
- **exam**: 考试管理相关API（考试列表、详情、创建、更新等）
- **score**: 成绩管理相关API（成绩录入、查询、导出等）
- **question**: 试题管理相关API（试题增删改查、批量导入导出等）
- **paper**: 试卷管理相关API（试卷创建、生成、预览等）
- **user**: 用户管理相关API（用户列表、角色管理等）

## 项目结构

```
exam-ui/
├── public/             # 静态资源
├── src/                # 源代码
│   ├── api/            # API服务
│   ├── assets/         # 资源文件
│   ├── components/     # 组件
│   ├── router/         # 路由配置
│   ├── store/          # 状态管理
│   ├── utils/          # 工具函数
│   ├── views/          # 页面视图
│   ├── App.vue         # 根组件
│   ├── main.js         # 入口文件
│   └── style.css       # 全局样式
├── tests/              # 测试文件
├── .gitignore          # Git忽略文件
├── index.html          # HTML模板
├── package.json        # 项目配置
├── vite.config.js      # Vite配置
└── README.md           # 项目文档
```

## 安装和运行

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

开发环境下，系统会自动启动Mock服务，提供模拟数据用于前端开发测试。

### 构建生产版本

```bash
npm run build
```

## API使用说明

### 基本使用

```javascript
import { authService } from '@/api/auth/auth';
import { examService } from '@/api/exam/exam';

// 用户登录
try {
  const response = await authService.login('username', 'password');
  console.log('登录成功', response);
} catch (error) {
  console.error('登录失败', error.message);
}
```

### 错误处理

所有API服务都提供了统一的错误处理机制，包含错误代码和友好的错误消息：

```javascript
try {
  // API调用
} catch (error) {
  if (error.isApiError) {
    // 处理API错误
    console.log('错误代码:', error.code);
    console.log('错误消息:', error.message);
  }
}
```

## 集成测试

系统包含API集成测试脚本，可以验证API服务的功能：

```bash
# 运行API集成测试
node tests/api/integration.test.js
```

## 开发指南

### 添加新的API服务

1. 在对应的业务模块目录下创建服务文件
2. 遵循现有的API服务模式实现方法
3. 导出服务对象供组件使用

### 贡献指南

1. Fork本项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request

## 许可证

[MIT](https://opensource.org/licenses/MIT)

## 联系方式

如有问题或建议，请联系项目维护者。
