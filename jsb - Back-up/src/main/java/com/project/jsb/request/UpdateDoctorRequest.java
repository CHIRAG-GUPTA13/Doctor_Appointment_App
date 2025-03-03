package com.project.jsb.request;

import java.math.BigDecimal;

public class UpdateDoctorRequest  extends UpdateUserRequest{

    private String specialization;

    private Integer Experience;

    private BigDecimal doctor_fees;

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
}
