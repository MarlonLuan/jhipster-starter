package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class JobTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Job getJobSample1() {
        return new Job().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).jobTitle("jobTitle1").minSalary(1L).maxSalary(1L);
    }

    public static Job getJobSample2() {
        return new Job().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).jobTitle("jobTitle2").minSalary(2L).maxSalary(2L);
    }

    public static Job getJobRandomSampleGenerator() {
        return new Job()
            .id(UUID.randomUUID())
            .jobTitle(UUID.randomUUID().toString())
            .minSalary(longCount.incrementAndGet())
            .maxSalary(longCount.incrementAndGet());
    }
}
