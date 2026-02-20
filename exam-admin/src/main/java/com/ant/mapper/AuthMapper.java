package com.ant.mapper;

import com.ant.po.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 认证相关的Mapper接口
 */
@Mapper
public interface AuthMapper {
    
    /**
     * 根据用户名查询用户
     * @param username 用户名
     * @return 用户信息
     */
    User findByUsername(@Param("username") String username);
    
    /**
     * 更新用户最后登录时间
     * @param id 用户ID
     */
    void updateLastLoginTime(@Param("id") Long id);
    
    /**
     * 插入新用户
     * @param user 用户信息
     */
    void insertUser(User user);
}
