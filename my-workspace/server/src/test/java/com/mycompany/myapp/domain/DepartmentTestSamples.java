package com.mycompany.myapp.domain;

import java.util.UUID;

public class DepartmentTestSamples {

    public static Department getDepartmentSample1() {
        return new Department().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).departmentName("departmentName1");
    }

    public static Department getDepartmentSample2() {
        return new Department().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).departmentName("departmentName2");
    }

    public static Department getDepartmentRandomSampleGenerator() {
        return new Department().id(UUID.randomUUID()).departmentName(UUID.randomUUID().toString());
    }
}
