package com.ant.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security配置类
 * 配置认证规则，排除/auth路径的认证要求
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // 配置会话管理为无状态
        .sessionManagement(session ->
            session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        // 配置授权规则
        .authorizeHttpRequests(authorize -> authorize
            // 允许所有对/auth路径的请求，不需要认证
            .requestMatchers("/auth/**").permitAll()
            // 允许Swagger和静态资源访问
            .requestMatchers("/doc.html", "/webjars/**", "/swagger-resources/**").permitAll()
            // 所有其他请求需要认证
            .anyRequest().authenticated())
        // 禁用CSRF，因为我们使用JWT进行认证
        .csrf(AbstractHttpConfigurer::disable)
        // 禁用Basic认证
        .httpBasic(AbstractHttpConfigurer::disable);

    return http.build();
    }

}
