package com.project.jsb.controller;

import com.project.jsb.dto.AppointmentDto;
import com.project.jsb.exception.ResourceNotFoundException;
import com.project.jsb.model.Appointment;
import com.project.jsb.response.ApiResponse;
import com.project.jsb.service.appointment.IAppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("${api.prefix}/appointments")
public class AppointmentController {

    @Autowired
    private final IAppointmentService appointmentService;

    public AppointmentController(IAppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/appointment/book")  // for patient
    public ResponseEntity<ApiResponse> bookAppointment(@RequestParam Long doctorId,
                                                       @RequestParam LocalDateTime localDateTime) {
        try {
            AppointmentDto appointmentDto = appointmentService.bookAppointment( doctorId, localDateTime);
            return ResponseEntity.ok(new ApiResponse("appointment booked", appointmentDto));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/appointment/confirm/{appointmentId}")    // for doctor
    public ResponseEntity<ApiResponse> confirmAppointment(@PathVariable Long appointmentId) {
        try {
            appointmentService.confirmAppointment(appointmentId);
            return ResponseEntity.ok(new ApiResponse("appointment confirmed", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/appointment/cancel/{appointmentId}")    // for patient
    public ResponseEntity<ApiResponse> cancelAppointment(@PathVariable Long appointmentId) {
        try {
            appointmentService.cancelAppointment(appointmentId);
            return ResponseEntity.ok(new ApiResponse("appointment canceled", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/appointment/complete/{appointmentId}")    // for doctor
    public ResponseEntity<ApiResponse> completeAppointment(@PathVariable Long appointmentId) {
        try {
            appointmentService.completeAppointment(appointmentId);
            return ResponseEntity.ok(new ApiResponse("appointment completed", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/appointment/payment/{appointmentId}")    // for patient
    public ResponseEntity<ApiResponse> updatePayment(@PathVariable Long appointmentId) {
        try {
            appointmentService.updatePaymentStatus(appointmentId);
            return ResponseEntity.ok(new ApiResponse(" payment updated", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/appointment/patient")    // for patient
    public ResponseEntity<ApiResponse> patientAppointments() {
        try {
             List<AppointmentDto> appointmentDtos= appointmentService.findByPatientId();
            return ResponseEntity.ok(new ApiResponse(" appointment found", appointmentDtos));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/appointment/doctor")    // for doctor
    public ResponseEntity<ApiResponse> doctorAppointments() {
        try {
            List<AppointmentDto> appointmentDtos= appointmentService.findByDoctorId();
            return ResponseEntity.ok(new ApiResponse("  appointment found", appointmentDtos));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/appointment/all")    // for admin
    public ResponseEntity<ApiResponse> Appointments() {
        try {
            List<AppointmentDto> appointmentDtos= appointmentService.getAllAppointments();
            return ResponseEntity.ok(new ApiResponse("  appointment found", appointmentDtos));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

}
