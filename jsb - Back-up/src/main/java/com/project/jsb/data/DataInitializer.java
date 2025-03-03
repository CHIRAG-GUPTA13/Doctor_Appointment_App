package com.project.jsb.data;

import com.project.jsb.model.Role;
import com.project.jsb.model.Doctor;
import com.project.jsb.model.User;
import com.project.jsb.repository.DoctorRepository;
import com.project.jsb.repository.RoleRepository;
import com.project.jsb.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Set;

@Transactional
@Component
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {

    @Autowired
    public final UserRepository userRepository;
    @Autowired
    public final DoctorRepository doctorRepository;
    @Autowired
    public final RoleRepository roleRepository;


    @Autowired
    public final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, DoctorRepository doctorRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Set<String> defaultRoles = Set.of("DOCTOR", "PATIENT","ADMIN");
        createDefaultAdmin();
        createDefaultDoctor();
        createDefaultPatient();

        createDefaultRoleIfNotExists(defaultRoles);

    }

    private void createDefaultRoleIfNotExists(Set<String> roles) {
        roles.stream()
                .filter(role -> roleRepository.findByName(role).isEmpty())
                .map(Role::new)
                .forEach(roleRepository::save);
    }


    public void createDefaultPatient() {
        Collection<Role> userRoles = roleRepository.findByName("PATIENT");
        Role userRole = userRoles.stream().findFirst().orElse(null);
        for (int i = 0; i < 1; i++) {
            String defaultEmail = "patient" + i + "@email.com";
            if (userRepository.existsByEmail(defaultEmail)) {
                continue;
            }
            User user = new User();
            user.setFirstName("firstName");
            user.setLastName("lastName");
            user.setEmail(defaultEmail);
            user.setPhoneNumber("1234567890");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
            System.out.println("default patient " + i + " created");
        }
    }

    public void createDefaultDoctor() {
        Collection<Role> userRoles = roleRepository.findByName("DOCTOR");
        Role userRole = userRoles.stream().findFirst().orElse(null);
        for (int i = 0; i < 1; i++) {
            String defaultEmail = "doctor" + i + "@email.com";
            if (userRepository.existsByEmail(defaultEmail)) {
                continue;
            }
            User user = new User();
            user.setFirstName("firstName");
            user.setLastName("lastName");
            user.setEmail(defaultEmail);
            user.setPhoneNumber("1234567890");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setRoles(Set.of(userRole));
            User savedUser = userRepository.save(user);
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setSpecialization("default");
            doctor.setExperience(3);
            doctor.setDoctor_fees(BigDecimal.valueOf(150));
            doctorRepository.save(doctor);
            System.out.println("default doctor " + i + " created");
        }
    }

    public void createDefaultAdmin() {
        Collection<Role> userRoles = roleRepository.findByName("ADMIN");
        Role userRole = userRoles.stream().findFirst().orElse(null);
        for (int i = 0; i < 1; i++) {
            String defaultEmail = "admin" + i + "@email.com";
            if (userRepository.existsByEmail(defaultEmail)) {
                continue;
            }
            User user = new User();
            user.setFirstName("firstName");
            user.setLastName("lastName");
            user.setEmail(defaultEmail);
            user.setPhoneNumber("1234567890");
            user.setPassword(passwordEncoder.encode("1234"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
            System.out.println("default admin " + i + " created");
        }
    }
}
