package com.mycompany.myapp.domain;

import java.util.UUID;

public class JobHistoryTestSamples {

    public static JobHistory getJobHistorySample1() {
        return new JobHistory().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"));
    }

    public static JobHistory getJobHistorySample2() {
        return new JobHistory().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"));
    }

    public static JobHistory getJobHistoryRandomSampleGenerator() {
        return new JobHistory().id(UUID.randomUUID());
    }
}
