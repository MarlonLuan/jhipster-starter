package com.mycompany.myapp.service.mapper;

import static com.mycompany.myapp.domain.RegionAsserts.*;
import static com.mycompany.myapp.domain.RegionTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class RegionMapperTest {

    private RegionMapper regionMapper;

    @BeforeEach
    void setUp() {
        regionMapper = new RegionMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getRegionSample1();
        var actual = regionMapper.toEntity(regionMapper.toDto(expected));
        assertRegionAllPropertiesEquals(expected, actual);
    }
}
