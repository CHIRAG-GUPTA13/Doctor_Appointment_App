package com.project.jsb.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.prefix}/testing")
public class Testing {

    @GetMapping("/test")
    public String testing(){
        return "testing";
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/test2")
    public String testing2(){
        return "for admin";
    }

    @PreAuthorize("hasAuthority('PATIENT')")
    @GetMapping("/test3")
    public String testing3(){
        return "for PATIENT";
    }
}
