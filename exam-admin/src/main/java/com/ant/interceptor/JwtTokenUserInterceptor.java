package com.ant.interceptor;

import com.ant.context.BaseContext;
import com.ant.properties.JwtProperties;
import com.ant.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;



/**
 * 用户JWT令牌拦截器
 * 用于验证普通用户身份的JWT令牌
 */
@Component
@Slf4j
public class JwtTokenUserInterceptor implements HandlerInterceptor {

    private final JwtProperties jwtProperties;

    public JwtTokenUserInterceptor(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    /**
     * 拦截请求，验证JWT令牌
     * @param request HTTP请求
     * @param response HTTP响应
     * @param handler 处理器
     * @return 是否继续处理请求
     * @throws Exception 异常
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        log.info("用户拦截器拦截到请求: {}", request.getRequestURI());

        // 检查是否应该排除此路径
        String requestURI = request.getRequestURI();
        // 只排除登录和注册等公开接口，不排除logout接口
        if (requestURI.equals("/auth/login") || requestURI.equals("/auth/register") || 
            requestURI.equals("/auth/verify-code") || requestURI.equals("/auth/reset-password")) {
            log.info("用户拦截器排除公开认证接口请求: {}", requestURI);
            return true; // 直接放行
        }

        // 判断当前拦截到的是Controller的方法还是其他资源
        if (!(handler instanceof HandlerMethod)) {
            // 当前拦截到的不是动态方法，直接放行
            return true;
        }

        // 从请求头中获取令牌
        String token = request.getHeader(jwtProperties.getUserTokenName());

        // 验证令牌
            try {
                log.info("用户JWT令牌验证: {}", token);
                Claims claims = JwtUtil.parseJWT(jwtProperties.getUserSecretKey(), token);
                Long userId = Long.valueOf(claims.getSubject());
                // 从JWT令牌中获取用户角色
                String role = (String) claims.get("role");
                log.info("用户已登录，用户ID: {}, 角色: {}", userId, role);
                // 使用BaseContext设置当前登录用户ID和角色
                BaseContext.setCurrentId(userId);
                BaseContext.setCurrentRole(role);
                // 验证通过，放行
                return true;
        } catch (Exception e) {
            log.error("用户JWT令牌验证失败", e);
            // 验证失败，设置响应状态码为401
            response.setStatus(401);
            return false;
        }
    }

    /**
     * 请求处理完成后调用
     * @param request HTTP请求
     * @param response HTTP响应
     * @param handler 处理器
     * @param modelAndView 模型视图
     * @throws Exception 异常
     */
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        HandlerInterceptor.super.postHandle(request, response, handler, modelAndView);
    }

    /**
     * 视图渲染完成后调用
     * @param request HTTP请求
     * @param response HTTP响应
     * @param handler 处理器
     * @param ex 异常
     * @throws Exception 异常
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        // 清除ThreadLocal中的数据，防止内存泄漏
        BaseContext.removeCurrentId();
        BaseContext.removeCurrentRole();
        HandlerInterceptor.super.afterCompletion(request, response, handler, ex);
    }
}
