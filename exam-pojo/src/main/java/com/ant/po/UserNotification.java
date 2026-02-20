package com.ant.po;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import jakarta.persistence.*;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@Entity
@Table(name = "user_notifications")
public class UserNotification implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    private Notification notification;

    @Column(name = "read", nullable = false, columnDefinition = "tinyint(1) default 0")
    private Boolean read;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Column(name = "read_time")
    private Date readTime;
}
