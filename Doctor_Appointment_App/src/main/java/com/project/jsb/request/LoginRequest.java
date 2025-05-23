package com.project.jsb.request;

import org.antlr.v4.runtime.misc.NotNull;

public class LoginRequest {

    @NotNull
    private String email;
    @NotNull
    private  String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
