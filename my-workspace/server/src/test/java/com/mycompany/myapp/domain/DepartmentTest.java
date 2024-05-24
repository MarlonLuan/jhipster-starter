package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class DepartmentTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Department.class);
        Department department1 = new Department();
        department1.setId(UUID.randomUUID());
        Department department2 = new Department();
        department2.setId(department1.getId());
        assertThat(department1).isEqualTo(department2);
        department2.setId(UUID.randomUUID());
        assertThat(department1).isNotEqualTo(department2);
        department1.setId(null);
        assertThat(department1).isNotEqualTo(department2);
    }
}
