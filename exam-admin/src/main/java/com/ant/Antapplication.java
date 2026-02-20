package com.ant;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class Antapplication {
    public static void main(String[] args) {
        SpringApplication.run(Antapplication.class, args);
            log.info("启动成功");
    }
}
