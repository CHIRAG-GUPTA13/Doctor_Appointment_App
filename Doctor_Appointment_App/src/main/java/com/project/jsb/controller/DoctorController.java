package com.project.jsb.controller;

import com.project.jsb.exception.AlreadyExistsException;
import com.project.jsb.exception.ResourceNotFoundException;
import com.project.jsb.request.CreateDoctorRequest;
import com.project.jsb.request.UpdateDoctorRequest;
import com.project.jsb.response.ApiResponse;
import com.project.jsb.service.User.IUserService;
import com.project.jsb.service.doctor.IDoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/users")
public class DoctorController {
    @Autowired
    public final IUserService userService;
    @Autowired
    public final IDoctorService doctorService;

    public DoctorController(IUserService userService, IDoctorService doctorService) {
        this.userService = userService;
        this.doctorService = doctorService;
    }

    @GetMapping("/doctor/get")                // to get all data of doctor
    public ResponseEntity<ApiResponse> getDoctorById() {
        Long doctorId  = userService.getAuthenticateUser().getId();
        try {
            return ResponseEntity.ok(new ApiResponse("doctor found", doctorService.getDoctor(doctorId)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(" doctor not found ", null));
        }
    }

    @PostMapping("/doctor/create")         // create a patient
    public ResponseEntity<ApiResponse> createDoctor(@RequestBody CreateDoctorRequest request) {
        try {
            return ResponseEntity.ok(new ApiResponse("doctor created", doctorService.createDoctor(request)));
        } catch (AlreadyExistsException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse(" doctor already exists", null));
        }
    }

    @PutMapping("/doctor/update")         // create a patient
    public ResponseEntity<ApiResponse> updateDoctor(@RequestBody UpdateDoctorRequest request ) {
        try {
            return ResponseEntity.ok(new ApiResponse("doctor updated", doctorService.updateDoctor(request)));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse("doctor not found", null));
        }
    }

    @GetMapping("/doctor/all")
    public ResponseEntity<ApiResponse> getAllDoctor( ) {
        try {
            return ResponseEntity.ok(new ApiResponse("doctor updated", userService.getAllDoctor()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(CONFLICT).body(new ApiResponse("doctor not found", null));
        }
    }
}
