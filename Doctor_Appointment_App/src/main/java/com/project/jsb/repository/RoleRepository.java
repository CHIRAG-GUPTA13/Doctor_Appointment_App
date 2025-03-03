package com.project.jsb.repository;


import com.project.jsb.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;

public interface RoleRepository extends JpaRepository<Role , Long> {
    Collection<Role> findByName(String role);
}
