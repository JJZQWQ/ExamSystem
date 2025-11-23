package com.ant.service;

import com.ant.vo.LoginVO;

/**
 * 认证服务接口
 */
public interface AuthService {
    
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @return 登录结果，包含token和用户信息
     */
    LoginVO login(String username, String password);
    
    /**
     * 用户登出
     */
    void logout();
    
    /**
     * 刷新token
     * @param oldToken 旧token
     * @return 新token
     */
    String refreshToken(String oldToken);
    
    /**
     * 用户注册
     * @param username 用户名
     * @param password 密码
     * @param name 姓名
     * @param role 角色
     * @return 注册结果
     */
    boolean register(String username, String password, String name, String role);
}
