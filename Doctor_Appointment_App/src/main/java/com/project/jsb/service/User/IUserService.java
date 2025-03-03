package com.project.jsb.service.User;

import com.project.jsb.dto.AppointmentDto;
import com.project.jsb.dto.UserDto;
import com.project.jsb.model.Appointment;
import com.project.jsb.model.User;
import com.project.jsb.request.CreateDoctorRequest;
import com.project.jsb.request.CreateUserRequest;
import com.project.jsb.request.UpdateUserRequest;

import java.util.List;

public interface IUserService {

    User getUser(Long userId);

    UserDto createPatient(CreateUserRequest request);

    void deleteUser(Long userId);

    List<UserDto> getAllUser();

    List<UserDto> getAllPatient();

    List<UserDto> getAllDoctor();


    UserDto convertToDto(User user);

    UserDto updatePatient(UpdateUserRequest request);

    User getAuthenticateUser();
}
