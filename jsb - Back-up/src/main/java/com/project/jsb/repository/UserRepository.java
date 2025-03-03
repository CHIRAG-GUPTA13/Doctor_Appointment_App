package com.project.jsb.repository;

import com.project.jsb.model.Role;
import com.project.jsb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User , Long> {
    boolean existsByEmail(String email);

    User findByEmail(String username);

    List<User> findByRoles(Role userRole);
}
