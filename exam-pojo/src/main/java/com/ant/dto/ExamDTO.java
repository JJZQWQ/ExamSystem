package com.ant.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

@Data
public class ExamDTO {
    private Long id;
    private String name;
    private String subject;
    private String category;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date startTime;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date endTime;
    
    private Integer duration;
    private UserDTO creator;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;
    
    private String status;
    private PaperDTO paper;
    private String description;
    private Boolean isPublic;
    private String visibility;
    private String grade;
    private Integer totalParticipants;
    private Integer actualParticipants;
    private BigDecimal passRate;
}