package com.mycompany.myapp.domain;

import java.util.UUID;

public class RegionTestSamples {

    public static Region getRegionSample1() {
        return new Region().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).regionName("regionName1");
    }

    public static Region getRegionSample2() {
        return new Region().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).regionName("regionName2");
    }

    public static Region getRegionRandomSampleGenerator() {
        return new Region().id(UUID.randomUUID()).regionName(UUID.randomUUID().toString());
    }
}
