package com.mycompany.myapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class CountryMapperTest {

    private CountryMapper countryMapper;

    @BeforeEach
    public void setUp() {
        countryMapper = new CountryMapperImpl();
    }
}
