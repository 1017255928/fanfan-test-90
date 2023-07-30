package com.wahyaumau.springbootsqlite.models;

import lombok.Data;

@Data
public class BaseResponse {
    private String code;
    private String message;
    private Object data;

    public BaseResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

    public BaseResponse(String code, String message, Object data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }
}