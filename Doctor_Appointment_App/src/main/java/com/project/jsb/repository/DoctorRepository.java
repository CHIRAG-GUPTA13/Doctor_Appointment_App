package com.project.jsb.repository;

import com.project.jsb.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor ,Long> {
    Optional<Doctor> findByUserId(Long id);
}
