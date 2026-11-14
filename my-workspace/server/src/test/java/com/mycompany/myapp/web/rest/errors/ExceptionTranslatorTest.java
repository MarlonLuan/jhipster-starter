package com.mycompany.myapp.web.rest.errors;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import tech.jhipster.config.JHipsterConstants;

class ExceptionTranslatorTest {

    private static final String CLASS_NAME_DETAIL = "Failed to map to java.lang.String";

    private String detailWithProfile(String profile) {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles(profile);
        Exception exception = new IllegalStateException("Failed", new IllegalArgumentException(CLASS_NAME_DETAIL));
        return new ExceptionTranslator(environment)
            .wrapAndCustomizeProblem(exception, new ServletWebRequest(new MockHttpServletRequest()))
            .getDetail();
    }

    @Test
    void shouldReplaceInProductionADetailOfTheCauseWithAClassName() {
        assertThat(detailWithProfile(JHipsterConstants.SPRING_PROFILE_PRODUCTION)).isEqualTo("Unexpected runtime exception");
    }

    @Test
    void shouldKeepTheDetailOfTheCauseOutOfProduction() {
        assertThat(detailWithProfile(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT)).isEqualTo(CLASS_NAME_DETAIL);
    }
}
