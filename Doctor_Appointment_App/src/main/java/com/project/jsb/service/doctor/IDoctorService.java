package com.project.jsb.service.doctor;

import com.project.jsb.dto.DoctorDto;
import com.project.jsb.dto.UserDto;
import com.project.jsb.model.Doctor;
import com.project.jsb.model.User;
import com.project.jsb.request.CreateDoctorRequest;
import com.project.jsb.request.UpdateDoctorRequest;
import com.project.jsb.request.UpdateUserRequest;

public interface IDoctorService {
    DoctorDto getDoctor(Long userId);

    UserDto createDoctor(CreateDoctorRequest request);

    UserDto updateDoctor(UpdateDoctorRequest request);

    DoctorDto convertToDoctorDto(User user, Doctor doctor);
}
