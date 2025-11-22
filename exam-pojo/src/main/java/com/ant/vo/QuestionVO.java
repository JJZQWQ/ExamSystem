package com.ant.vo;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class QuestionVO {
    private Long id;
    private String stem;
    private String category;
    private String type;
    private String options;
    private Integer difficulty;
    private BigDecimal score;
    private String status;
    private Integer usageCount;
    private Boolean isAnswered;
    private String userAnswer;
}