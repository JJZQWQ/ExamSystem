package com.ant.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class QuestionDTO {
    private Long id;
    private String stem;
    private String category;
    private String type;
    private String options;
    private String answer;
    private String analysis;
    private Integer difficulty;
    private BigDecimal score;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    
    private UserDTO creator;
    private Integer usageCount;
}