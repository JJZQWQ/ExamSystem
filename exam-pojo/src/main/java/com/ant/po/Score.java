package com.ant.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Data
@Entity
@Table(name = "scores")
public class Score implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "score", nullable = false, precision = 6, scale = 2)
    private BigDecimal score;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_time")
    private Date startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "submit_time")
    private Date submitTime;

    @Column(name = "duration")
    private Integer duration; // 实际答题时长（分钟）

    @Column(name = "status", nullable = false, length = 20)
    private String status; // 未开始/进行中/已完成/已批改

    @Column(name = "answers", columnDefinition = "longtext")
    private String answers; // JSON格式存储作答内容

    @Column(name = "is_passed")
    private Boolean isPassed;
}
