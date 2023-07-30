package com.wahyaumau.springbootsqlite.models;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ErrorResponse {
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse(String message) {
        this.message = message;
        timestamp = LocalDateTime.now();
    }
}
