package com.project.jsb.response;

public class ApiResponse {
    private String message;
    private Object obj;

    public ApiResponse(String message, Object obj) {
        this.message = message;
        this.obj = obj;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Object getObj() {
        return obj;
    }

    public void setObj(Object obj) {
        this.obj = obj;
    }
}
