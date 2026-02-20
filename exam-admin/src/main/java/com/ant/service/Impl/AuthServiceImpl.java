package com.ant.service.Impl;

import com.ant.context.BaseContext;
import com.ant.mapper.AuthMapper;
import com.ant.po.User;
import com.ant.properties.JwtProperties;
import com.ant.service.AuthService;
import com.ant.vo.LoginVO;
import com.ant.vo.UserVO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.concurrent.TimeUnit;

/**
 * 认证服务实现类
 */
@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private final AuthMapper authMapper;
    private final JwtProperties jwtProperties;
    private final RedisTemplate<String, String> redisTemplate;

    public AuthServiceImpl(AuthMapper authMapper, JwtProperties jwtProperties, @Qualifier("redisTemplate") RedisTemplate<String, String> redisTemplate) {
        this.authMapper = authMapper;
        this.jwtProperties = jwtProperties;
        this.redisTemplate = redisTemplate;
    }

    @Override
    public LoginVO login(String username, String password) {
        // 根据用户名查询用户
        User user = authMapper.findByUsername(username);

        // 验证用户是否存在
        if (user == null) {
            return null;
        }

        // 验证密码（这里简化处理，实际应该使用加密方式）
        if (!password.equals(user.getPassword())) {
            return null;
        }

        // 验证用户状态
        if (!"active".equals(user.getStatus())) {
            return null;
        }

        // 更新最后登录时间
        authMapper.updateLastLoginTime(user.getId());

        // 使用JWT生成token
        String token = generateJwtToken(user);

        // 构建返回结果
        LoginVO loginVO = new LoginVO();
        loginVO.setToken(token);

        // 转换User为UserVO
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        loginVO.setUser(userVO);

        return loginVO;
    }

    @Override
    public void logout() {
        // 这里需要从当前上下文获取用户ID和token
        // 为了简化，我们假设从BaseContext获取用户ID
        // 实际应用中应该从请求上下文或ThreadLocal中获取
        Long userId = BaseContext.getCurrentId();

        if (userId != null) {
            // 将token加入黑名单
            String tokenKey = "token:blacklist:" + userId;
            redisTemplate.opsForValue().set(tokenKey, "1", jwtProperties.getAdminTtl(), TimeUnit.MILLISECONDS);
        }
    }

    @Override
    public String refreshToken(String oldToken) {
        if (oldToken == null || oldToken.isEmpty()) {
            return null;
        }

        try {
            // 1. 检查token是否在黑名单中
            String blacklistKey = "token:blacklist:" + oldToken;
            if (Boolean.TRUE.equals(redisTemplate.hasKey(blacklistKey))) {
                return null; // token已被拉黑
            }

            // 2. 解析旧token，获取用户信息
            Claims claims = null;
            String role = null;
            Long userId = null;
            String username = null;

            // 尝试用管理员密钥解析
            try {
                claims = Jwts.parserBuilder()
                        .setSigningKey(jwtProperties.getAdminSecretKey().getBytes())
                        .build()
                        .parseClaimsJws(oldToken)
                        .getBody();

                role = "admin";
            } catch (Exception e) {
                // 尝试用普通用户密钥解析
                try {
                    claims = Jwts.parserBuilder()
                            .setSigningKey(jwtProperties.getUserSecretKey().getBytes())
                            .build()
                            .parseClaimsJws(oldToken)
                            .getBody();

                    role = "user"; // 包括teacher和student
                } catch (ExpiredJwtException expiredEx) {
                    // token已过期，但我们仍然可以尝试从过期token中提取信息进行刷新
                    claims = expiredEx.getClaims();
                    // 根据解析出的角色信息选择正确的密钥
                    Object roleObj = claims.get("role");
                    if (roleObj != null && "admin".equals(roleObj.toString())) {
                        role = "admin";
                    } else {
                        role = "user";
                    }
                } catch (Exception otherEx) {
                    return null; // token无效
                }
            }

            // 3. 从claims中提取用户信息
            Object idObj = claims.get("id");
            Object usernameObj = claims.get("username");
            Object roleObj = claims.get("role");

            if (idObj == null || usernameObj == null) {
                return null; // token缺少必要信息
            }

            userId = Long.valueOf(idObj.toString());
            username = usernameObj.toString();
            if (roleObj != null) {
                role = roleObj.toString();
            }

            // 4. 验证用户是否存在且状态正常
            User user = authMapper.findByUsername(username);
            if (user == null || !"active".equals(user.getStatus())) {
                return null;
            }

            // 5. 将旧token加入黑名单
            long ttlMillis = "admin".equals(role) ? jwtProperties.getAdminTtl() : jwtProperties.getUserTtl();
            redisTemplate.opsForValue().set(blacklistKey, "1", ttlMillis, TimeUnit.MILLISECONDS);

            // 6. 生成新token
            String newToken = generateJwtToken(user);

            // 7. 将新token存储到Redis中
            String tokenKey = "token:" + role + ":" + userId;
            redisTemplate.opsForValue().set(tokenKey, newToken, ttlMillis, TimeUnit.MILLISECONDS);

            return newToken;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public boolean register(String username, String password, String name, String role) {
        System.out.println("开始注册用户: username=" + username + ", name=" + name + ", role=" + role);

        // 检查用户名是否已存在
        User existingUser = authMapper.findByUsername(username);
        if (existingUser != null) {
            System.out.println("用户名已存在: " + username);
            return false; // 用户名已存在
        }

        // 创建新用户
        User newUser = new User();
        newUser.setUsername(username);
        newUser.setPassword(password); // 注意：实际应该使用加密存储
        newUser.setName(name);
        newUser.setRole(role);
        newUser.setStatus("active"); // 默认激活状态
        newUser.setCreateTime(new Date());

        // 保存用户
        try {
            System.out.println("准备插入新用户到数据库");
            authMapper.insertUser(newUser);
            System.out.println("用户注册成功: " + username);
            return true;
        } catch (Exception e) {
            // 记录异常
            System.err.println("用户注册失败: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 使用JWT生成token
     * @param user 用户信息
     * @return JWT token字符串
     */
    private String generateJwtToken(User user) {
        // 根据用户角色选择不同的配置
        String role = user.getRole();
        String secretKey = "admin".equals(role) ? jwtProperties.getAdminSecretKey() : jwtProperties.getUserSecretKey();
        long ttlMillis = "admin".equals(role) ? jwtProperties.getAdminTtl() : jwtProperties.getUserTtl();

        // 设置JWT的声明
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUsername());
        claims.put("role", role);

        // 创建JWT builder
        JwtBuilder builder = Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + ttlMillis))
                .signWith(SignatureAlgorithm.HS256, secretKey);

        // 构建JWT
        String token = builder.compact();

        // 使用Hash结构存储token和用户信息
        String userKey = "user:" + role + ":" + user.getId();

        try {
            // 存储token和用户信息到同一个Hash中
            redisTemplate.opsForHash().put(userKey, "token", token);
            redisTemplate.opsForHash().put(userKey, "id", String.valueOf(user.getId()));
            redisTemplate.opsForHash().put(userKey, "username", user.getUsername());
            redisTemplate.opsForHash().put(userKey, "name", user.getName());
            redisTemplate.opsForHash().put(userKey, "role", user.getRole());

            // 设置过期时间
            redisTemplate.expire(userKey, ttlMillis, TimeUnit.MILLISECONDS);

            logger.info("用户信息和Token已使用Hash结构存储到Redis，用户ID: {}, 角色: {}", user.getId(), role);
        } catch (Exception e) {
            logger.error("使用Hash结构存储用户数据到Redis失败，用户ID: {}，错误信息: {}", user.getId(), e.getMessage(), e);
        }

        return token;
    }
}
