package com.project.jsb.service.appointment;

import com.project.jsb.dto.AppointmentDto;
import com.project.jsb.model.Appointment;
import com.project.jsb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface IAppointmentService  {

    AppointmentDto bookAppointment( Long doctorId , LocalDateTime localDateTime);

    void confirmAppointment(Long appointmentId);

    void cancelAppointment(Long appointmentId);

    void completeAppointment(Long appointmentId);

    void updatePaymentStatus(Long appointmentId);

    List<AppointmentDto> findByPatientId();

    List<AppointmentDto> findByDoctorId();

    List<AppointmentDto> getAllAppointments();

    AppointmentDto convertToDto(Appointment appointment);
}
