package com.mycompany.myapp.domain;

import java.util.UUID;

public class CountryTestSamples {

    public static Country getCountrySample1() {
        return new Country().id(UUID.fromString("23d8dc04-a48b-45d9-a01d-4b728f0ad4aa")).countryName("countryName1");
    }

    public static Country getCountrySample2() {
        return new Country().id(UUID.fromString("ad79f240-3727-46c3-b89f-2cf6ebd74367")).countryName("countryName2");
    }

    public static Country getCountryRandomSampleGenerator() {
        return new Country().id(UUID.randomUUID()).countryName(UUID.randomUUID().toString());
    }
}
