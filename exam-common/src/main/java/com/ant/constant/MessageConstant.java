package com.ant.constant;

/**
 * 信息提示常量类
 */
public class MessageConstant {

    // 用户相关
    public static final String PASSWORD_ERROR = "密码错误";
    public static final String ACCOUNT_NOT_FOUND = "账号不存在";
    public static final String ACCOUNT_LOCKED = "账号被锁定";
    public static final String USER_NOT_LOGIN = "用户未登录";
    public static final String LOGIN_FAILED = "登录失败";
    public static final String PASSWORD_EDIT_FAILED = "密码修改失败";
    public static final String ALREADY_EXISTS = "该人员已经存在";
    
    // 考试相关
    public static final String EXAM_NOT_FOUND = "考试不存在";
    public static final String EXAM_ALREADY_STARTED = "考试已经开始";
    public static final String EXAM_NOT_STARTED = "考试尚未开始";
    public static final String EXAM_HAS_ENDED = "考试已经结束";
    public static final String EXAM_TIME_OVER = "考试时间已到";
    public static final String EXAMINEE_NOT_REGISTERED = "考生未报名此考试";
    
    // 题目相关
    public static final String QUESTION_NOT_FOUND = "题目不存在";
    public static final String QUESTION_BANK_EMPTY = "题库为空";
    public static final String QUESTION_CATEGORY_ERROR = "题目分类错误";
    
    // 数据验证相关
    public static final String PARAMETER_INVALID = "参数无效";
    public static final String DATA_INTEGRITY_ERROR = "数据不完整";
    public static final String VALIDATION_FAILED = "数据验证失败";
    
    // 文件相关
    public static final String UPLOAD_FAILED = "文件上传失败";
    public static final String FILE_TYPE_NOT_ALLOWED = "不允许的文件类型";
    public static final String FILE_SIZE_EXCEEDED = "文件大小超过限制";
    
    // 其他通用错误
    public static final String UNKNOWN_ERROR = "未知错误";
    public static final String OPERATION_FAILED = "操作失败";
    public static final String PERMISSION_DENIED = "权限不足";
    public static final String RESOURCE_BUSY = "资源忙，请稍后再试";
    
}
