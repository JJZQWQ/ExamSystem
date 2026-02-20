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
@Table(name = "exams")
public class Exam implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "subject", nullable = false, length = 50)
    private String subject;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "start_time", nullable = false)
    private Date startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "end_time", nullable = false)
    private Date endTime;

    @Column(name = "duration", nullable = false)
    private Integer duration; // 考试时长（分钟）

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // 未开始/进行中/已完成/已取消

    @OneToOne
    @JoinColumn(name = "paper_id", nullable = false)
    private Paper paper;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "is_public", nullable = false, columnDefinition = "tinyint(1) default 1")
    private Boolean isPublic;

    @Column(name = "visibility", nullable = false, length = 20)
    private String visibility; // all

    @Column(name = "grade", length = 50)
    private String grade;

    @Column(name = "total_participants", nullable = false, columnDefinition = "int default 0")
    private Integer totalParticipants;

    @Column(name = "actual_participants", nullable = false, columnDefinition = "int default 0")
    private Integer actualParticipants;

    @Column(name = "pass_rate", precision = 5, scale = 2)
    private BigDecimal passRate;
}
