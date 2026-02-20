# 组件目录结构

## 重构方案

根据功能分类体系，组件目录结构按以下方式组织：

### 目录结构
```
/components/
├── base/             # 基础组件（登录页等）
│   ├── HomePage.vue  # 首页
│   └── LoginPage.vue # 登录页
├── home/             # 首页相关组件
│   ├── Dashboard.vue # 仪表盘
│   ├── CreatePaper.vue     # 创建试卷
│   ├── CreateExamAddPaper.vue # 创建考试添加试卷
│   └── AddPersonnel.vue    # 添加人员
├── exam-management/  # 考试管理相关组件
│   ├── ExamInfoManagement.vue    # 考试信息管理
│   ├── ExamScoreManagement.vue   # 成绩管理
│   └── ExamAnalysis.vue          # 考试分析
├── question-management/ # 试题管理相关组件
│   ├── QuestionCategoryManagement.vue # 试题分类管理
│   ├── QuestionBank.vue         # 试题库
│   ├── PaperBank.vue           # 试卷库
│   └── CreatePaperPage.vue      # 创建试卷页面
├── user-management/  # 用户管理相关组件
│   └── StudentManagement.vue    # 学生管理
├── system-management/ # 系统管理相关组件
│   └── RoleManagement.vue       # 角色管理
├── exam/             # 考试相关组件
│   ├── CreateExam.vue         # 创建考试
│   ├── CurrentExam.vue        # 当前考试
│   ├── ExamPaperReview.vue    # 试卷评审
│   └── HistoryExam.vue        # 历史考试
├── question/         # 试题相关组件
│   ├── CreatePaper.vue     # 创建试卷
│   └── PaperPreview.vue    # 试卷预览
├── system/           # 系统相关组件
│   └── RoleManagement.vue  # 角色管理
└── user/             # 用户相关组件
```

## 重构说明

1. 目录结构与导航菜单保持一致，便于查找和维护
2. 每个主要功能模块对应一个目录
3. 组件命名采用 PascalCase 规范
4. 组件名称应清晰反映其功能
5. system-management/ 和 user-management/ 目录目前包含基础功能组件，是为以后开发扩展功能预留的