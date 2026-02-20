package com.ant.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class ExamVO {
    private Long id;
    private String name;
    private String subject;
    private String category;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    
    private Integer duration;
    private String creatorName;
    private Integer totalParticipants;
    private Integer actualParticipants;
    private BigDecimal passRate;
    private Boolean canParticipate;
}