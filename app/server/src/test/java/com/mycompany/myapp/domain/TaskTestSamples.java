package com.mycompany.myapp.domain;

import java.util.UUID;

public class TaskTestSamples {

    public static Task getTaskSample1() {
        return new Task().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).title("title1").description("description1");
    }

    public static Task getTaskSample2() {
        return new Task().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).title("title2").description("description2");
    }

    public static Task getTaskRandomSampleGenerator() {
        return new Task().id(UUID.randomUUID()).title(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
