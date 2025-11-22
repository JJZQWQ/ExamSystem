package com.ant.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.util.Date;

@Data
public class UserDTO {
    private Long id;
    private String username;
    private String name;
    private String role;
    private String email;
    private String phone;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    
    private String department;
    private String position;
    private String grade;
    private String className;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastLogin;
    
    private String avatar;
}