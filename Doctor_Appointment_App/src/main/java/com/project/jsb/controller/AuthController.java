package com.project.jsb.controller;

import com.project.jsb.dto.UserDto;
import com.project.jsb.exception.AlreadyExistsException;
import com.project.jsb.request.CreateUserRequest;
import com.project.jsb.response.ApiResponse;
import com.project.jsb.security.jwt.JwtUtils;
import com.project.jsb.security.user.CustomUserDetails;
import com.project.jsb.service.User.IUserService;
import jakarta.validation.Valid;
import com.project.jsb.request.LoginRequest;
import com.project.jsb.response.JwtResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CONFLICT;

@RestController
@RequestMapping("${api.prefix}/public")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    @Autowired
    private final IUserService userService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, IUserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@Valid @RequestBody LoginRequest request)
    {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt =jwtUtils.generateTokenForUser(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            JwtResponse jwtResponse = new JwtResponse(userDetails.getId() , jwt);
            return ResponseEntity.ok(new ApiResponse("Login success" , jwtResponse));
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ApiResponse(e.getMessage() , null));
        }
    }

    @PostMapping("/patient/create")         // create a patient
    public ResponseEntity<ApiResponse> createPatient(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserDto userDto = userService.createPatient(request);
            return ResponseEntity.ok(new ApiResponse("patient created", userDto));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(" user already exists ", null));
        }
    }

}
