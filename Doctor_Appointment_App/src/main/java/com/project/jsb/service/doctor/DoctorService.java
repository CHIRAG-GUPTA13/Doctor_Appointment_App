package com.project.jsb.service.doctor;

import com.project.jsb.dto.DoctorDto;
import com.project.jsb.model.Role;
import com.project.jsb.exception.AlreadyExistsException;
import com.project.jsb.exception.ResourceNotFoundException;
import com.project.jsb.model.Doctor;
import com.project.jsb.model.User;
import com.project.jsb.repository.DoctorRepository;
import com.project.jsb.repository.RoleRepository;
import com.project.jsb.repository.UserRepository;
import com.project.jsb.request.CreateDoctorRequest;
import com.project.jsb.request.UpdateDoctorRequest;
import com.project.jsb.service.User.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Optional;

@Service
public class DoctorService implements IDoctorService {

    @Autowired
    public final DoctorRepository doctorRepository;
    @Autowired
    public final UserRepository userRepository;
    @Autowired
    public final RoleRepository roleRepository;
    @Autowired
    public final IUserService userService;
    @Autowired
    public final PasswordEncoder passwordEncoder;


    public DoctorService(DoctorRepository doctorRepository, UserRepository userRepository, RoleRepository roleRepository, IUserService userService, PasswordEncoder passwordEncoder) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public DoctorDto getDoctor(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(" doctor not found"));
        Doctor doctor = doctorRepository.findByUserId(user.getId()).orElseThrow(()-> new ResourceNotFoundException("not found"));
        return convertToDoctorDto(user, doctor);
    }


    @Override
    public DoctorDto createDoctor(CreateDoctorRequest request) {
        return Optional.of(request).filter(user -> !userRepository.existsByEmail(request.getEmail())).map(req -> {
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            Collection<Role> roles = roleRepository.findByName("DOCTOR");
            user.setRoles(roles);

            User savedUser = userRepository.save(user);

            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setExperience(request.getExperience());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setDoctor_fees(request.getDoctor_fees());

            Doctor savedDoctor = doctorRepository.save(doctor);

            return convertToDoctorDto(savedUser, savedDoctor);
        }).orElseThrow(() -> new AlreadyExistsException("user already exists with this email " + request.getEmail()));
    }

    @Override
    public DoctorDto updateDoctor(UpdateDoctorRequest request) {

        User user = userService.getAuthenticateUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        userRepository.save(user);
        Doctor doctor = doctorRepository.findByUserId(user.getId()).orElseThrow(()-> new ResourceNotFoundException("not found"));
        doctor.setExperience(request.getExperience());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setDoctor_fees(request.getDoctor_fees());
        doctorRepository.save(doctor);

        return convertToDoctorDto(user, doctor);
    }

    @Override
    public DoctorDto convertToDoctorDto(User user, Doctor doctor) {
        DoctorDto doctorDto = new DoctorDto();
        doctorDto.setId(user.getId());
        doctorDto.setFirstName(user.getFirstName());
        doctorDto.setLastName(user.getLastName());
        doctorDto.setEmail(user.getEmail());
        doctorDto.setExperience(doctor.getExperience());
        doctorDto.setSpecialization(doctor.getSpecialization());
        doctorDto.setDoctor_fees(doctor.getDoctor_fees());
        doctorDto.setTotal_points(doctor.getTotal_points());
        return doctorDto;
    }


}
