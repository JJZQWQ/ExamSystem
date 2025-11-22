package com.ant.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.util.Date;

@Data
public class PaperDTO {
    private Long id;
    private String name;
    private Integer totalScore;
    private Integer duration;
    private UserDTO creator;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date lastUpdate;
    
    private String status;
    private String description;
    private Integer questionCount;
}