package com.project.jsb.controller;

import com.project.jsb.dto.UserDto;
import com.project.jsb.exception.AlreadyExistsException;
import com.project.jsb.exception.ResourceNotFoundException;
import com.project.jsb.request.CreateUserRequest;
import com.project.jsb.request.UpdateUserRequest;
import com.project.jsb.response.ApiResponse;
import com.project.jsb.service.User.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/users")
@CrossOrigin(origins = "http://localhost:5174")
public class PatientController {

    @Autowired
    public final IUserService userService;

    public PatientController(IUserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasAuthority('PATIENT')")
    @GetMapping("/patient/get")                // recommended for patient --- can be used for both
    public ResponseEntity<ApiResponse> getUserById() {
        try {
            Long userId = userService.getAuthenticateUser().getId();
            UserDto userDto = userService.convertToDto(userService.getUser(userId));
            return ResponseEntity.ok(new ApiResponse("user found", userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(" user not found ", null));
        }
    }

    @PostMapping("/public/patient/create")         // create a patient
    public ResponseEntity<ApiResponse> createPatient(@RequestBody CreateUserRequest request) {
        try {
            UserDto userDto = userService.createPatient(request);
            return ResponseEntity.ok(new ApiResponse("patient created", userDto));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(" user already exists ", null));
        }
    }

    @PutMapping("/patient/update")   // update a patient
    public ResponseEntity<ApiResponse> updatePatient(@RequestBody UpdateUserRequest request) {
        try {
            UserDto userDto = userService.updatePatient(request);
            return ResponseEntity.ok(new ApiResponse("patient updated", userDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(" user not found ", null));
        }
    }

    @DeleteMapping("/user/{userId}")    // can be used for both
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(new ApiResponse("user deleted", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(" user not found ", null));
        }
    }

    @GetMapping("/patient/all")
    public ResponseEntity<ApiResponse> getAllPatient( ) {
        try {
            return ResponseEntity.ok(new ApiResponse("doctor updated", userService.getAllPatient()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse("patient not found", null));
        }
    }


    @GetMapping("/all")                 // to get all patient and doctor
    public ResponseEntity<ApiResponse> getAllUser() {
        return ResponseEntity.ok(new ApiResponse("users found", userService.getAllUser()));
    }
}
