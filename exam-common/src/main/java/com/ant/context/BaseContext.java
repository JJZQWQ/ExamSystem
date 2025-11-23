package com.ant.context;

public class BaseContext {

    // 存储用户ID的ThreadLocal
    public static ThreadLocal<Long> threadLocal = new ThreadLocal<>();
    
    // 存储用户角色的ThreadLocal
    public static ThreadLocal<String> roleThreadLocal = new ThreadLocal<>();

    /**
     * 设置当前用户ID
     */
    public static void setCurrentId(Long id) {
        threadLocal.set(id);
    }

    /**
     * 获取当前用户ID
     */
    public static Long getCurrentId() {
        return threadLocal.get();
    }

    /**
     * 移除当前用户ID
     */
    public static void removeCurrentId() {
        threadLocal.remove();
    }
    
    /**
     * 设置当前用户角色
     */
    public static void setCurrentRole(String role) {
        roleThreadLocal.set(role);
    }
    
    /**
     * 获取当前用户角色
     */
    public static String getCurrentRole() {
        return roleThreadLocal.get();
    }
    
    /**
     * 移除当前用户角色
     */
    public static void removeCurrentRole() {
        roleThreadLocal.remove();
    }

}
