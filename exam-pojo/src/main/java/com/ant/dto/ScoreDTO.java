package com.ant.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class ScoreDTO {
    private Long id;
    private ExamDTO exam;
    private UserDTO user;
    private BigDecimal score;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date submitTime;
    
    private Integer duration;
    private String status;
    private String answers;
    private Boolean isPassed;
}