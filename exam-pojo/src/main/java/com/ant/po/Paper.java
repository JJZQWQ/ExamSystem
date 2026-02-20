package com.ant.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "papers")
public class Paper implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @OneToOne(mappedBy = "paper")
    private Exam exam;

    @Column(name = "total_score", nullable = false, columnDefinition = "int default 100")
    private Integer totalScore;

    @Column(name = "duration", nullable = false, columnDefinition = "int default 120")
    private Integer duration; // 考试时长（分钟）

    @ManyToOne
    @JoinColumn(name = "creator_id", nullable = false)
    private User creator;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "create_time", nullable = false)
    private Date createTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "last_update", nullable = false)
    private Date lastUpdate;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // draft/published

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "question_count", nullable = false, columnDefinition = "int default 0")
    private Integer questionCount;
}
