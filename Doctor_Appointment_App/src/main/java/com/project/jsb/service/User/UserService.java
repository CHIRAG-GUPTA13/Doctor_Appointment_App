package com.project.jsb.service.User;

import com.project.jsb.dto.UserDto;
import com.project.jsb.enums.Gender;
import com.project.jsb.model.Role;
import com.project.jsb.exception.AlreadyExistsException;
import com.project.jsb.exception.ResourceNotFoundException;
import com.project.jsb.model.User;
import com.project.jsb.repository.DoctorRepository;
import com.project.jsb.repository.RoleRepository;
import com.project.jsb.repository.UserRepository;
import com.project.jsb.request.CreateUserRequest;
import com.project.jsb.request.UpdateUserRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements IUserService {

    @Autowired
    public final UserRepository userRepository;
    @Autowired
    public final DoctorRepository doctorRepository;
    @Autowired
    public final PasswordEncoder passwordEncoder;
    @Autowired
    public final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, DoctorRepository doctorRepository, PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Override
    public User getUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(" user not found"));
    }

    @Override
    public UserDto createPatient(CreateUserRequest request) {
        return Optional.of(request).filter(user -> !userRepository.existsByEmail(request.getEmail())).map(req -> {
            User user = new User();

            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            Collection<Role> roles = roleRepository.findByName("PATIENT");
            user.setRoles(roles);

            userRepository.save(user);

            return convertToDto(user);
        }).orElseThrow(() -> new AlreadyExistsException("user already exists with this email " + request.getEmail()));
    }

    @Override
    public UserDto updatePatient(UpdateUserRequest request) {

        Long patientId = getAuthenticateUser().getId();
        User user = getUser(patientId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setGender(Gender.valueOf(request.getGender().toUpperCase()));
        user.setDob(request.getDob());
        userRepository.save(user);
        return convertToDto(user);
    }

    @Override
    public void deleteUser(Long userId) {
        doctorRepository.findByUserId(userId).ifPresent(doctorRepository::delete);
        userRepository.findById(userId).ifPresentOrElse(userRepository::delete, () -> {
            throw new ResourceNotFoundException("user not found");
        });
    }

    @Override
    public List<UserDto> getAllUser() {
        return userRepository.findAll().stream().map(this::convertToDto).toList();
    }

    @Override
    public List<UserDto> getAllPatient() {
        Collection<Role> userRoles = roleRepository.findByName("ROLE_PATIENT");
        Role userRole = userRoles.stream().findFirst().orElse(null);
        return userRepository.findByRoles(userRole).stream().map(this::convertToDto).toList();
    }

    @Override
    public List<UserDto> getAllDoctor() {
        Collection<Role> userRoles = roleRepository.findByName("ROLE_DOCTOR");
        Role userRole = userRoles.stream().findFirst().orElse(null);
        return userRepository.findByRoles(userRole).stream().map(this::convertToDto).toList();
    }

    @Override
    public UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setEmail(user.getEmail());
        dto.setGender(user.getGender().toString());
        dto.setDob(user.getDob());
        return dto;
    }

    @Override
    public User getAuthenticateUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email);
    }
}



