package com.mycompany.myapp.domain;

import java.util.UUID;

public class LocationTestSamples {

    public static Location getLocationSample1() {
        return new Location()
            .id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa"))
            .streetAddress("streetAddress1")
            .postalCode("postalCode1")
            .city("city1")
            .stateProvince("stateProvince1");
    }

    public static Location getLocationSample2() {
        return new Location()
            .id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367"))
            .streetAddress("streetAddress2")
            .postalCode("postalCode2")
            .city("city2")
            .stateProvince("stateProvince2");
    }

    public static Location getLocationRandomSampleGenerator() {
        return new Location()
            .id(UUID.randomUUID())
            .streetAddress(UUID.randomUUID().toString())
            .postalCode(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .stateProvince(UUID.randomUUID().toString());
    }
}
