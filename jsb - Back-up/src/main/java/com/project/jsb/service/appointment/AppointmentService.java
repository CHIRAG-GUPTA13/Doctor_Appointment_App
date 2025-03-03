package com.project.jsb.service.appointment;

import com.project.jsb.dto.AppointmentDto;
import com.project.jsb.dto.UserDto;
import com.project.jsb.enums.AppointmentStatus;
import com.project.jsb.enums.PaymentStatus;
import com.project.jsb.exception.ResourceNotFoundException;
import com.project.jsb.model.Appointment;
import com.project.jsb.model.Doctor;
import com.project.jsb.model.User;
import com.project.jsb.repository.AppointmentRepository;
import com.project.jsb.repository.DoctorRepository;
import com.project.jsb.repository.UserRepository;
import com.project.jsb.service.User.IUserService;
import com.project.jsb.service.doctor.DoctorService;
import com.project.jsb.service.doctor.IDoctorService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService implements IAppointmentService {


    @Autowired
    public final AppointmentRepository appointmentRepository;
    @Autowired
    public final IUserService userService;
    @Autowired
    public final DoctorRepository doctorRepository;


    public AppointmentService(AppointmentRepository appointmentRepository, IUserService userService, DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userService = userService;
        this.doctorRepository = doctorRepository;
    }

    @Override
    public AppointmentDto bookAppointment( Long doctorId, LocalDateTime localDateTime) {
        User patient = userService.getAuthenticateUser();
        User doctor = userService.getUser(doctorId);

        Appointment newAppointment = new Appointment();
        newAppointment.setPatient(patient);
        newAppointment.setDoctor(doctor);
        newAppointment.setPaymentStatus(PaymentStatus.CASH);
        newAppointment.setAppointmentStatus(AppointmentStatus.BOOKED);
        newAppointment.setAppointmentDate(localDateTime);

        return convertToDto(appointmentRepository.save(newAppointment));

    }

    @Override
    public void confirmAppointment(Long appointmentId) {
        Appointment appointment = findAppointment(appointmentId);
        appointment.setAppointmentStatus(AppointmentStatus.CONFIRMED);
        appointmentRepository.save(appointment);
    }

    @Override
    public void cancelAppointment(Long appointmentId) {
        Appointment appointment = findAppointment(appointmentId);
        appointment.setAppointmentStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    public void completeAppointment(Long appointmentId) {
        Appointment appointment = findAppointment(appointmentId);
        appointment.setAppointmentStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
          Doctor doctor= doctorRepository.findByUserId(userService.getUser(appointment.getDoctor().getId()).getId()).orElseThrow();
        doctor.setTotal_points(doctor.getTotal_points().add(doctor.getDoctor_fees()));
        doctorRepository.save(doctor);
    }

    @Override
    public void updatePaymentStatus(Long appointmentId) {
        Appointment appointment = findAppointment(appointmentId);
        appointment.setPaymentStatus(PaymentStatus.ONLINE);
        appointmentRepository.save(appointment);
    }

    @Override
    public List<AppointmentDto> findByPatientId() {
        Long patientId = userService.getAuthenticateUser().getId();
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream().map(this::convertToDto).toList();
    }

    @Override
    public List<AppointmentDto> findByDoctorId() {
        Long doctorId = userService.getAuthenticateUser().getId();
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments.stream().map(this::convertToDto).toList();
    }

    @Override
    public List<AppointmentDto> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(this::convertToDto).toList();
    }

    @Override
    public AppointmentDto convertToDto(Appointment appointment) {
        AppointmentDto dto = new AppointmentDto();
        dto.setId(appointment.getId());
        dto.setAppointmentDate(appointment.getAppointmentDate());
        dto.setAppointmentStatus(appointment.getAppointmentStatus().toString());
        dto.setPaymentStatus(appointment.getPaymentStatus().toString());
        dto.setPatient(userService.convertToDto(appointment.getPatient()));
        dto.setDoctor(userService.convertToDto(appointment.getDoctor()));
        return dto;
    }

    private Appointment findAppointment(Long id) {
        return appointmentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("appointment not found"));
    }

}
