# 考试系统数据库设计与实体类定义

## 一、数据库表结构设计

### 1.1 用户表(users)
```sql
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `password` varchar(255) NOT NULL COMMENT '密码（加密存储）',
  `name` varchar(50) NOT NULL COMMENT '真实姓名',
  `role` varchar(20) NOT NULL COMMENT '角色类型：admin/teacher/student',
  `email` varchar(100) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `status` varchar(20) NOT NULL COMMENT '状态：active/inactive',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `department` varchar(100) DEFAULT NULL COMMENT '所属部门',
  `position` varchar(100) DEFAULT NULL COMMENT '职位（教师字段）',
  `grade` varchar(50) DEFAULT NULL COMMENT '年级（学生字段）',
  `class_name` varchar(50) DEFAULT NULL COMMENT '班级（学生字段）',
  `last_login` datetime DEFAULT NULL COMMENT '最后登录时间',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 1.2 角色表(roles)
```sql
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `name` varchar(50) NOT NULL COMMENT '角色名称',
  `code` varchar(50) NOT NULL COMMENT '角色编码',
  `description` varchar(255) DEFAULT NULL COMMENT '角色描述',
  `is_system` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否系统角色',
  `type` varchar(20) NOT NULL COMMENT '角色类型：system/custom',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色表';
```

### 1.3 用户角色关联表(user_roles)
```sql
CREATE TABLE `user_roles` (
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `role_id` bigint NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `fk_user_role_role` (`role_id`),
  CONSTRAINT `fk_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';
```

### 1.4 考试表(exams)
```sql
CREATE TABLE `exams` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '考试ID',
  `name` varchar(100) NOT NULL COMMENT '考试名称',
  `subject` varchar(50) NOT NULL COMMENT '考试科目',
  `category` varchar(50) NOT NULL COMMENT '考试分类',
  `start_time` datetime NOT NULL COMMENT '开始时间',
  `end_time` datetime NOT NULL COMMENT '结束时间',
  `duration` int NOT NULL COMMENT '考试时长（分钟）',
  `creator_id` bigint NOT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `status` varchar(20) NOT NULL COMMENT '状态：未开始/进行中/已完成/已取消',
  `paper_id` bigint NOT NULL COMMENT '试卷ID',
  `description` varchar(500) DEFAULT NULL COMMENT '考试描述',
  `is_public` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否公开',
  `visibility` varchar(20) NOT NULL DEFAULT 'all' COMMENT '可见性',
  `grade` varchar(50) DEFAULT NULL COMMENT '年级',
  `total_participants` int NOT NULL DEFAULT '0' COMMENT '总参与人数',
  `actual_participants` int NOT NULL DEFAULT '0' COMMENT '实际参与人数',
  `pass_rate` decimal(5,2) DEFAULT '0.00' COMMENT '通过率',
  PRIMARY KEY (`id`),
  KEY `fk_exam_creator` (`creator_id`),
  KEY `fk_exam_paper` (`paper_id`),
  CONSTRAINT `fk_exam_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fk_exam_paper` FOREIGN KEY (`paper_id`) REFERENCES `papers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考试表';
```

### 1.5 试卷表(papers)
```sql
CREATE TABLE `papers` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '试卷ID',
  `name` varchar(100) NOT NULL COMMENT '试卷名称',
  `exam_id` bigint DEFAULT NULL COMMENT '关联考试ID',
  `total_score` int NOT NULL DEFAULT '100' COMMENT '总分',
  `duration` int NOT NULL DEFAULT '120' COMMENT '考试时长（分钟）',
  `creator_id` bigint NOT NULL COMMENT '创建者ID',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `last_update` datetime NOT NULL COMMENT '最后更新时间',
  `status` varchar(20) NOT NULL COMMENT '状态：draft/published',
  `description` varchar(500) DEFAULT NULL COMMENT '试卷描述',
  `question_count` int NOT NULL DEFAULT '0' COMMENT '试题数量',
  PRIMARY KEY (`id`),
  KEY `fk_paper_creator` (`creator_id`),
  CONSTRAINT `fk_paper_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试卷表';
```

### 1.6 试题表(questions)
```sql
CREATE TABLE `questions` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '试题ID',
  `stem` text NOT NULL COMMENT '题干',
  `category` varchar(50) NOT NULL COMMENT '试题分类',
  `type` varchar(20) NOT NULL COMMENT '试题类型：单选题/多选题/判断题/填空题/简答题',
  `options` longtext COMMENT '选项（JSON格式）',
  `answer` longtext NOT NULL COMMENT '答案（JSON格式）',
  `analysis` text COMMENT '解析',
  `difficulty` int NOT NULL COMMENT '难度（1-5）',
  `score` decimal(5,2) NOT NULL COMMENT '分值',
  `status` varchar(20) NOT NULL COMMENT '状态：active/inactive',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `creator_id` bigint NOT NULL COMMENT '创建者ID',
  `usage_count` int NOT NULL DEFAULT '0' COMMENT '使用次数',
  PRIMARY KEY (`id`),
  KEY `fk_question_creator` (`creator_id`),
  CONSTRAINT `fk_question_creator` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试题表';
```

### 1.7 试卷试题关联表(paper_questions)
```sql
CREATE TABLE `paper_questions` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `paper_id` bigint NOT NULL COMMENT '试卷ID',
  `question_id` bigint NOT NULL COMMENT '试题ID',
  `sort_order` int NOT NULL COMMENT '排序序号',
  `score` decimal(5,2) NOT NULL COMMENT '本题分值',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_paper_question` (`paper_id`,`question_id`),
  KEY `fk_paper_question_question` (`question_id`),
  CONSTRAINT `fk_paper_question_paper` FOREIGN KEY (`paper_id`) REFERENCES `papers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_paper_question_question` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='试卷试题关联表';
```

### 1.8 成绩表(scores)
```sql
CREATE TABLE `scores` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '成绩ID',
  `exam_id` bigint NOT NULL COMMENT '考试ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `score` decimal(6,2) NOT NULL COMMENT '得分',
  `start_time` datetime DEFAULT NULL COMMENT '开始答题时间',
  `submit_time` datetime DEFAULT NULL COMMENT '提交时间',
  `duration` int DEFAULT NULL COMMENT '实际答题时长（分钟）',
  `status` varchar(20) NOT NULL COMMENT '状态：未开始/进行中/已完成/已批改',
  `answers` longtext COMMENT '作答内容（JSON格式）',
  `is_passed` tinyint(1) DEFAULT NULL COMMENT '是否通过',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_exam_user` (`exam_id`,`user_id`),
  KEY `fk_score_user` (`user_id`),
  CONSTRAINT `fk_score_exam` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_score_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成绩表';
```

### 1.9 通知表(notifications)
```sql
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '通知ID',
  `type` varchar(20) NOT NULL COMMENT '通知类型：system/exam/user',
  `title` varchar(200) NOT NULL COMMENT '通知标题',
  `description` text NOT NULL COMMENT '通知内容',
  `time` datetime NOT NULL COMMENT '通知时间',
  `read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已读',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `related_id` bigint DEFAULT NULL COMMENT '关联ID（根据类型关联相应实体）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='通知表';
```

### 1.10 用户通知关联表(user_notifications)
```sql
CREATE TABLE `user_notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` bigint NOT NULL COMMENT '用户ID',
  `notification_id` bigint NOT NULL COMMENT '通知ID',
  `read` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否已读',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_notification` (`user_id`,`notification_id`),
  KEY `fk_user_notification_notification` (`notification_id`),
  CONSTRAINT `fk_user_notification_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_notification_notification` FOREIGN KEY (`notification_id`) REFERENCES `notifications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户通知关联表';
```

## 二、Java实体类定义

### 2.1 用户实体(User)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "users")
public class User implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;
    
    @Column(name = "password", nullable = false, length = 255)
    private String password;
    
    @Column(name = "name", nullable = false, length = 50)
    private String name;
    
    @Column(name = "role", nullable = false, length = 20)
    private String role; // admin/teacher/student
    
    @Column(name = "email", length = 100)
    private String email;
    
    @Column(name = "phone", length = 20)
    private String phone;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status; // active/inactive
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;
    
    @Column(name = "department", length = 100)
    private String department;
    
    @Column(name = "position", length = 100)
    private String position; // 教师字段
    
    @Column(name = "grade", length = 50)
    private String grade; // 学生字段
    
    @Column(name = "class_name", length = 50)
    private String className; // 学生字段
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "last_login")
    private Date lastLogin;
    
    @Column(name = "avatar", length = 255)
    private String avatar;
}
```

### 2.2 角色实体(Role)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "roles")
public class Role implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 50)
    private String name;
    
    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;
    
    @Column(name = "description", length = 255)
    private String description;
    
    @Column(name = "is_system", nullable = false, columnDefinition = "tinyint(1) default 0")
    private Boolean isSystem;
    
    @Column(name = "type", nullable = false, length = 20)
    private String type; // system/custom
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;
}
```

### 2.3 考试实体(Exam)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "exams")
public class Exam implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @Column(name = "subject", nullable = false, length = 50)
    private String subject;
    
    @Column(name = "category", nullable = false, length = 50)
    private String category;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_time", nullable = false)
    private Date startTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "end_time", nullable = false)
    private Date endTime;
    
    @Column(name = "duration", nullable = false)
    private Integer duration; // 考试时长（分钟）
    
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status; // 未开始/进行中/已完成/已取消
    
    @ManyToOne
    @JoinColumn(name = "paper_id", nullable = false)
    private Paper paper;
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "is_public", nullable = false, columnDefinition = "tinyint(1) default 1")
    private Boolean isPublic;
    
    @Column(name = "visibility", nullable = false, length = 20)
    private String visibility; // all
    
    @Column(name = "grade", length = 50)
    private String grade;
    
    @Column(name = "total_participants", nullable = false, columnDefinition = "int default 0")
    private Integer totalParticipants;
    
    @Column(name = "actual_participants", nullable = false, columnDefinition = "int default 0")
    private Integer actualParticipants;
    
    @Column(name = "pass_rate", precision = 5, scale = 2)
    private BigDecimal passRate;
}
```

### 2.4 试卷实体(Paper)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "papers")
public class Paper implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name;
    
    @OneToOne(mappedBy = "paper")
    private Exam exam;
    
    @Column(name = "total_score", nullable = false, columnDefinition = "int default 100")
    private Integer totalScore;
    
    @Column(name = "duration", nullable = false, columnDefinition = "int default 120")
    private Integer duration; // 考试时长（分钟）
    
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "last_update", nullable = false)
    private Date lastUpdate;
    
    @Column(name = "status", nullable = false, length = 20)
    private String status; // draft/published
    
    @Column(name = "description", length = 500)
    private String description;
    
    @Column(name = "question_count", nullable = false, columnDefinition = "int default 0")
    private Integer questionCount;
}
```

### 2.5 试题实体(Question)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "questions")
public class Question implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "stem", nullable = false, columnDefinition = "text")
    private String stem; // 题干
    
    @Column(name = "category", nullable = false, length = 50)
    private String category;
    
    @Column(name = "type", nullable = false, length = 20)
    private String type; // 单选题/多选题/判断题/填空题/简答题
    
    @Column(name = "options", columnDefinition = "longtext")
    private String options; // JSON格式存储选项
    
    @Column(name = "answer", nullable = false, columnDefinition = "longtext")
    private String answer; // JSON格式存储答案
    
    @Column(name = "analysis", columnDefinition = "text")
    private String analysis; // 解析
    
    @Column(name = "difficulty", nullable = false)
    private Integer difficulty; // 难度（1-5）
    
    @Column(name = "score", nullable = false, precision = 5, scale = 2)
    private BigDecimal score; // 分值
    
    @Column(name = "status", nullable = false, length = 20)
    private String status; // active/inactive
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;
    
    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;
    
    @Column(name = "usage_count", nullable = false, columnDefinition = "int default 0")
    private Integer usageCount;
}
```

### 2.6 试卷试题关联实体(PaperQuestion)
```java
package com.exam.model;

import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "paper_questions")
public class PaperQuestion implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "paper_id", nullable = false)
    private Paper paper;
    
    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;
    
    @Column(name = "sort_order", nullable = false)
    private Integer sortOrder;
    
    @Column(name = "score", nullable = false, precision = 5, scale = 2)
    private BigDecimal score; // 本题分值
}
```

### 2.7 成绩实体(Score)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "scores")
public class Score implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(name = "score", nullable = false, precision = 6, scale = 2)
    private BigDecimal score;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_time")
    private Date startTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "submit_time")
    private Date submitTime;
    
    @Column(name = "duration")
    private Integer duration; // 实际答题时长（分钟）
    
    @Column(name = "status", nullable = false, length = 20)
    private String status; // 未开始/进行中/已完成/已批改
    
    @Column(name = "answers", columnDefinition = "longtext")
    private String answers; // JSON格式存储作答内容
    
    @Column(name = "is_passed")
    private Boolean isPassed;
}
```

### 2.8 通知实体(Notification)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "notifications")
public class Notification implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "type", nullable = false, length = 20)
    private String type; // system/exam/user
    
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Column(name = "description", nullable = false, columnDefinition = "text")
    private String description;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "time", nullable = false)
    private Date time;
    
    @Column(name = "read", nullable = false, columnDefinition = "tinyint(1) default 0")
    private Boolean read;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;
    
    @Column(name = "related_id")
    private Long relatedId; // 关联ID
}
```

### 2.9 用户通知关联实体(UserNotification)
```java
package com.exam.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "user_notifications")
public class UserNotification implements Serializable {
    
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;
    
    @Column(name = "read", nullable = false, columnDefinition = "tinyint(1) default 0")
    private Boolean read;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "read_time")
    private Date readTime;
}
```

### 2.10 Java枚举类定义

```java
package com.exam.model.enums;

/**
 * 用户角色枚举
 */
public enum UserRole {
    ADMIN, TEACHER, STUDENT
}

/**
 * 用户状态枚举
 */
public enum UserStatus {
    ACTIVE, INACTIVE
}

/**
 * 考试状态枚举
 */
public enum ExamStatus {
    NOT_STARTED, IN_PROGRESS, COMPLETED, CANCELLED
}

/**
 * 可见性枚举
 */
public enum Visibility {
    ALL, SPECIFIC
}

/**
 * 试题类型枚举
 */
public enum QuestionType {
    SINGLE_CHOICE, MULTIPLE_CHOICE, TRUE_FALSE, FILL_BLANK, SHORT_ANSWER, PROGRAMMING
}

/**
 * 试题状态枚举
 */
public enum QuestionStatus {
    ACTIVE, INACTIVE
}

/**
 * 试卷状态枚举
 */
public enum PaperStatus {
    DRAFT, PUBLISHED, ARCHIVED
}

/**
 * 考试成绩状态枚举
 */
public enum ExamScoreStatus {
    NOT_STARTED, IN_PROGRESS, SUBMITTED, GRADED
}
```
## 三、数据模型关系说明

### 3.1 实体关系概览

1. **用户-角色**：多对多关系，通过`user_roles`表关联
2. **考试-试卷**：一对一关系，一个考试对应一个试卷
3. **试卷-试题**：多对多关系，通过`paper_questions`表关联
4. **考试-成绩**：一对多关系，一个考试可以有多个成绩记录
5. **用户-成绩**：一对多关系，一个用户可以有多个成绩记录
6. **通知-用户**：多对多关系，通过`user_notifications`表关联
7. **用户-考试**：一对多关系，一个用户可以创建多个考试
8. **用户-试题**：一对多关系，一个用户可以创建多个试题
9. **用户-试卷**：一对多关系，一个用户可以创建多个试卷

### 3.2 主要业务流程数据流向

1. **考试创建流程**：
   - 教师用户创建试卷 -> 添加试题到试卷 -> 创建考试关联试卷 -> 发布考试

2. **考试参加流程**：
   - 学生登录系统 -> 查看可参加考试 -> 进入考试 -> 提交答案 -> 系统自动评分/教师评分

3. **成绩管理流程**：
   - 系统记录考试成绩 -> 教师查看成绩统计 -> 导出成绩报表 -> 发布成绩通知

4. **试题管理流程**：
   - 教师创建/导入试题 -> 管理试题分类 -> 在试卷中使用试题 -> 统计试题使用情况

5. **用户管理流程**：
   - 管理员创建/导入用户 -> 分配用户角色 -> 管理用户状态 -> 重置密码



## 四、注意事项

1. 所有时间字段统一使用`datetime`类型存储
2. JSON格式数据使用`longtext`类型存储，便于存储复杂的结构化数据
3. 密码字段需要进行加密存储，推荐使用BCrypt算法
4. 外键约束确保数据完整性，删除操作采用级联删除策略
5. 合理建立索引以提高查询性能
6. 敏感字段（如密码）在API响应中需要进行过滤
7. 实体类实现`Serializable`接口，便于序列化操作
8. 使用JPA注解进行对象关系映射，简化数据库操作
