package com.ant.config;

import com.ant.interceptor.JwtTokenAdminInterceptor;
import com.ant.interceptor.JwtTokenUserInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import com.ant.json.JacksonObjectMapper;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;

import java.util.List;

/**
 * MVC配置类
 * 配置拦截器规则，使注册接口可以被公开访问
 */
@Configuration
public class WebMvcConfiguration extends WebMvcConfigurationSupport {


    private final JwtTokenAdminInterceptor jwtTokenAdminInterceptor;


    private final JwtTokenUserInterceptor jwtTokenUserInterceptor;

    public WebMvcConfiguration(JwtTokenAdminInterceptor jwtTokenAdminInterceptor, JwtTokenUserInterceptor jwtTokenUserInterceptor) {
        this.jwtTokenAdminInterceptor = jwtTokenAdminInterceptor;
        this.jwtTokenUserInterceptor = jwtTokenUserInterceptor;
    }

    /**
     * 注册自定义拦截器
     *
     * @param registry
     */
    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        // 注册管理员拦截器 - 只拦截/admin开头的路径，不拦截/auth路径和文档路径
        registry.addInterceptor(jwtTokenAdminInterceptor)
                .addPathPatterns("/admin/**") // 只拦截管理员路径
                .excludePathPatterns("/auth/**", "/doc.html", "/webjars/**", "/swagger-resources/**"); // 完全排除auth路径和文档路径下的所有接口

        // 注册用户拦截器 - 只拦截/user开头的路径，不拦截/auth路径和文档路径
        registry.addInterceptor(jwtTokenUserInterceptor)
                .addPathPatterns("/user/**") // 只拦截用户路径
                .excludePathPatterns("/auth/**", "/doc.html", "/webjars/**", "/swagger-resources/**"); // 完全排除auth路径和文档路径下的所有接口

        // 添加日志以确认拦截器配置
        System.out.println("拦截器配置完成: /auth/** 路径和文档路径已排除");
    }
    /**
     * 通过knife4j生成接口文档
     * @return
     */
    @Bean
    public Docket docket() {
        ApiInfo apiInfo = new ApiInfoBuilder()
                .title("考试项目接口文档")
                .version("2.0")
                .description("苍穹外卖项目接口文档")
                .build();
        Docket docket = new Docket(DocumentationType.SWAGGER_2)
                .groupName("管理端接口")
                .apiInfo(apiInfo)
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.ant.controller"))
                .paths(PathSelectors.any())
                .build();
        return docket;
    }

    /**
     * 设置静态资源映射
     * @param registry
     */
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/doc.html").addResourceLocations("classpath:/META-INF/resources/");
        registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
    }

    @Override
    protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        //创建一个消息转化器对象
        MappingJackson2HttpMessageConverter converter= new MappingJackson2HttpMessageConverter();
        //转换为json
        converter.setObjectMapper(new JacksonObjectMapper());
        //加入容器
        converters.add(0,converter);
    }
    
    /**
     * 配置跨域支持
     */
    @Override
    protected void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 允许所有路径
                .allowedOriginPatterns("*") // 使用allowedOriginPatterns代替allowedOrigins以支持allowCredentials
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // 允许的HTTP方法
                .allowedHeaders("*") // 允许所有请求头
                .allowCredentials(true) // 允许携带凭证
                .maxAge(3600); // 预检请求的缓存时间
    }
}

