package com.mycompany.myapp.service.mapper;

import org.junit.jupiter.api.BeforeEach;

class JobHistoryMapperTest {

    private JobHistoryMapper jobHistoryMapper;

    @BeforeEach
    public void setUp() {
        jobHistoryMapper = new JobHistoryMapperImpl();
    }
}
