package com.ant.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.util.Date;

@Data
public class UserVO {
    private Long id;
    private String username;
    private String name;
    private String role;
    private String email;
    private String phone;
    private String status;
    private String department;
    private String position;
    private String grade;
    private String className;
    private String avatar;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastLogin;
}