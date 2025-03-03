package com.project.jsb.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String specialization;

    private Integer experience;

    private BigDecimal doctor_fees;

    private BigDecimal total_points= BigDecimal.ZERO;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public BigDecimal getDoctor_fees() {
        return doctor_fees;
    }

    public void setDoctor_fees(BigDecimal doctor_fees) {
        this.doctor_fees = doctor_fees;
    }

    public BigDecimal getTotal_points() {
        return total_points;
    }

    public void setTotal_points(BigDecimal total_points) {
        this.total_points = total_points;
    }
}
