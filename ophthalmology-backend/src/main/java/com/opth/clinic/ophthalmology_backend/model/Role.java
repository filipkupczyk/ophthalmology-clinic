package com.opth.clinic.ophthalmology_backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Role {
    ADMIN, SECRETARY, PATIENT;

    @JsonCreator
    public static Role fromString(String role) {
        return Role.valueOf(role.toUpperCase());
    }

    @JsonValue
    public String toValue() {
        return this.name();
    }
}
