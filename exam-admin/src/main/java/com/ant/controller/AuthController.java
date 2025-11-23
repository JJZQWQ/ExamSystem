package com.ant.controller;

import com.ant.context.BaseContext;
import com.ant.dto.UserDTO;
import com.ant.result.Result;
import com.ant.service.AuthService;
import com.ant.vo.LoginVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 认证相关控制类
 */
@RestController
@RequestMapping("/auth")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}, allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final RedisTemplate<String, String> redisTemplate;
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(AuthService authService, @Qualifier("redisTemplate") RedisTemplate<String, String> redisTemplate) {
        this.authService = authService;
        this.redisTemplate = redisTemplate;
    }
    /**
     * 用户登录
     * @param credentials 登录凭证
     * @return 登录结果
     */
    @PostMapping("/login")
    public Result<LoginVO> login(@RequestBody Map<String, String> credentials) {
        // 验证参数
        if (credentials == null || credentials.get("username") == null || credentials.get("password") == null) {
            return Result.error("用户名和密码不能为空");
        }

        String username = credentials.get("username");
        String password = credentials.get("password");

        try {
            // 调用服务层进行登录验证
            LoginVO loginVO = authService.login(username, password);

            if (loginVO == null) {
                logger.warn("登录失败，请检查用户名和密码: {}", username);
                return Result.error("登录失败，请检查用户名和密码");
            }

            logger.info("用户登录成功: {}", username);
            return Result.success(loginVO);
        } catch (Exception e) {
            // 记录异常日志
            logger.error("登录失败，系统异常: {}", e.getMessage(), e);
            return Result.error("登录失败，系统异常: " + e.getMessage());
        }
    }

    /**
     * 用户登出
     * @return 登出结果
     */
    @PostMapping("/logout")
    public Result<Map<String, Boolean>> logout() {
        try {
            // 从BaseContext获取当前用户ID和角色
            Long userId = BaseContext.getCurrentId();
            String role = BaseContext.getCurrentRole();

            logger.info("用户登出请求，用户ID: {}, 角色: {}", userId, role);

            // 从Redis中删除用户数据
            if (userId != null && role != null) {
                String userKey = "user:" + role + ":" + userId;
                String tokenKey = "token:" + role + ":" + userId;

                // 删除用户信息和token
                redisTemplate.delete(userKey);
                redisTemplate.delete(tokenKey);

                logger.info("已从Redis删除用户数据，用户ID: {}", userId);
            } else if (userId != null) {
                // 如果只有用户ID没有角色，尝试删除两种可能的key
                String adminUserKey = "user:admin:" + userId;
                String userUserKey = "user:user:" + userId;
                String adminTokenKey = "token:admin:" + userId;
                String userTokenKey = "token:user:" + userId;

                redisTemplate.delete(adminUserKey);
                redisTemplate.delete(userUserKey);
                redisTemplate.delete(adminTokenKey);
                redisTemplate.delete(userTokenKey);

                logger.info("已尝试删除所有可能的用户数据，用户ID: {}", userId);
            }

            // 清空ThreadLocal中的用户信息
            BaseContext.removeCurrentId();
            BaseContext.removeCurrentRole();
            logger.info("已清空ThreadLocal中的用户信息");

            // 返回登出结果
            Map<String, Boolean> result = new HashMap<>();
            result.put("success", true);
            return Result.success(result);
        } catch (Exception e) {
            logger.error("用户登出异常: {}", e.getMessage(), e);

            // 即使发生异常，也尝试清空ThreadLocal
            try {
                BaseContext.removeCurrentId();
                BaseContext.removeCurrentRole();
            } catch (Exception ex) {
                logger.error("清空ThreadLocal异常: {}", ex.getMessage());
            }
            // 返回失败结果
            return Result.error("登出失败: " + e.getMessage());
        }
    }

    /**
     * 获取当前用户信息
     * @return 用户信息
     */
    @GetMapping("/user")
    public Result<UserDTO> getCurrentUser() {
        try {
            // 从BaseContext获取当前用户ID
            Long userId = BaseContext.getCurrentId();

            if (userId == null) {
                logger.warn("无法获取当前用户ID");
                return Result.error("用户未登录");
            }

            // 尝试从Redis的Hash结构获取用户信息
            // 首先尝试管理员角色
            String adminUserKey = "user:admin:" + userId;
            String userUserKey = "user:user:" + userId;
            UserDTO userDTO = null;

            // 检查是否存在管理员角色的用户数据
            if (Boolean.TRUE.equals(redisTemplate.hasKey(adminUserKey))) {
                userDTO = getUserFromHash(adminUserKey, "admin");
            }
            // 检查是否存在普通用户角色的用户数据
            else if (Boolean.TRUE.equals(redisTemplate.hasKey(userUserKey))) {
                userDTO = getUserFromHash(userUserKey, "user");
            }

            if (userDTO != null) {
                logger.info("从Redis Hash结构获取用户信息成功，用户ID: {}", userId);
                return Result.success(userDTO);
            }

            logger.warn("Redis中未找到用户数据，用户ID: {}", userId);
            return Result.error("用户数据不存在");

        } catch (NumberFormatException e) {
            logger.error("用户ID格式转换异常: {}", e.getMessage(), e);
            return Result.error("用户数据格式错误");
        } catch (Exception e) {
            logger.error("获取用户信息失败: {}", e.getMessage(), e);
            return Result.error("获取用户信息失败");
        }
    }

    /**
     * 从Redis Hash结构中获取用户信息
     */
    private UserDTO getUserFromHash(String userKey, String defaultRole) {
        try {
            // 从Hash中获取各个字段值
            String idStr = (String) redisTemplate.opsForHash().get(userKey, "id");
            String username = (String) redisTemplate.opsForHash().get(userKey, "username");
            String name = (String) redisTemplate.opsForHash().get(userKey, "name");
            String role = (String) redisTemplate.opsForHash().get(userKey, "role");

            // 如果必要字段不存在，则认为数据无效
            if (idStr == null || username == null || name == null) {
                logger.warn("Redis中的用户数据不完整，键: {}", userKey);
                return null;
            }

            // 创建UserDTO对象并设置属性
            UserDTO userDTO = new UserDTO();
            userDTO.setId(Long.parseLong(idStr));
            userDTO.setUsername(username);
            userDTO.setName(name);
            userDTO.setRole(role != null ? role : defaultRole);

            return userDTO;
        } catch (NumberFormatException e) {
            logger.error("用户ID格式转换异常，键: {}", userKey, e);
            return null;
        }
    }

    /**
     * 刷新token
     * @return 新token
     */
    @PostMapping("/refreshToken")
    public Result<Map<String, String>> refreshToken(@RequestBody Map<String, String> request) {
        String oldToken = request.get("token");

        if (oldToken == null || oldToken.isEmpty()) {
            return Result.error("Token不能为空");
        }

        try {
            String newToken = authService.refreshToken(oldToken);

            if (newToken != null) {
                Map<String, String> result = new HashMap<>();
                result.put("token", newToken);
                return Result.success(result);
            } else {
                return Result.error("Token无效或已过期");
            }
        } catch (Exception e) {
            return Result.error("Token刷新失败: " + e.getMessage());
        }
    }

    /**
     * 用户注册
     * @param userData 注册信息
     * @return 注册结果
     */
    @PostMapping("/register")
    public Result<Map<String, Boolean>> register(@RequestBody Map<String, String> userData) {
        logger.info("收到注册请求: {}", userData);

        // 验证参数
        if (userData == null ||
            userData.get("username") == null ||
            userData.get("password") == null ||
            userData.get("name") == null ||
            userData.get("role") == null) {
            logger.warn("注册参数不完整");
            return Result.error("请填写完整的注册信息");
        }

        String username = userData.get("username");
        String password = userData.get("password");
        String name = userData.get("name");
        String role = userData.get("role");

        // 验证角色有效性
        if (!"admin".equals(role) && !"teacher".equals(role) && !"student".equals(role)) {
            logger.warn("无效的角色类型: {}", role);
            return Result.error("无效的角色类型");
        }

        try {
            // 调用服务层进行注册
            boolean success = authService.register(username, password, name, role);

            Map<String, Boolean> result = new HashMap<>();
            result.put("success", success);

            if (success) {
                logger.info("用户注册成功: {}", username);
                return Result.success(result);
            } else {
                logger.warn("注册失败，用户名可能已存在: {}", username);
                return Result.error("注册失败，用户名可能已存在");
            }
        } catch (Exception e) {
            // 记录异常日志
            logger.error("注册失败: {}", e.getMessage(), e);
            return Result.error("注册失败，系统异常: " + e.getMessage());
        }
    }
}
