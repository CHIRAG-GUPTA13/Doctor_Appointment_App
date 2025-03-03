package com.project.jsb.dto;

import java.math.BigDecimal;

public class DoctorDto extends UserDto {

    private String specialization;

    private Integer Experience;

    private BigDecimal doctor_fees;

    private BigDecimal total_points;

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getExperience() {
        return Experience;
    }

    public void setExperience(Integer experience) {
        Experience = experience;
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
