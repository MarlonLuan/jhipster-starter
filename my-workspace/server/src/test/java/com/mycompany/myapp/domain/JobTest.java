package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class JobTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Job.class);
        Job job1 = new Job();
        job1.setId(UUID.randomUUID());
        Job job2 = new Job();
        job2.setId(job1.getId());
        assertThat(job1).isEqualTo(job2);
        job2.setId(UUID.randomUUID());
        assertThat(job1).isNotEqualTo(job2);
        job1.setId(null);
        assertThat(job1).isNotEqualTo(job2);
    }
}
