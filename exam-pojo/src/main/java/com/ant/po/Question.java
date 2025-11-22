package com.ant.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.Data;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "questions")
public class Question implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stem", nullable = false, columnDefinition = "text")
    private String stem; // 题干

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "type", nullable = false, length = 20)
    private String type; // 单选题/多选题/判断题/填空题/简答题

    @Column(name = "options", columnDefinition = "longtext")
    private String options; // JSON格式存储选项

    @Column(name = "answer", nullable = false, columnDefinition = "longtext")
    private String answer; // JSON格式存储答案

    @Column(name = "analysis", columnDefinition = "text")
    private String analysis; // 解析

    @Column(name = "difficulty", nullable = false)
    private Integer difficulty; // 难度（1-5）

    @Column(name = "score", nullable = false, precision = 5, scale = 2)
    private BigDecimal score; // 分值

    @Column(name = "status", nullable = false, length = 20)
    private String status; // active/inactive

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @Column(name = "usage_count", nullable = false, columnDefinition = "int default 0")
    private Integer usageCount;
}
