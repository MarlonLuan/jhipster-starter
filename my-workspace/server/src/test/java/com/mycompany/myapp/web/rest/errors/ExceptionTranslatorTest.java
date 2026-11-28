package com.mycompany.myapp.web.rest.errors;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.servlet.ServletException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.env.MockEnvironment;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.ServletWebRequest;
import tech.jhipster.config.JHipsterConstants;
import tech.jhipster.web.rest.errors.ProblemDetailWithCause;

class ExceptionTranslatorTest {

    private static final String CLASS_NAME_DETAIL = "Failed to map to java.lang.String";

    private String detailWithProfile(String profile) {
        return detailWithProfile(profile, new IllegalStateException("Failed", new IllegalArgumentException(CLASS_NAME_DETAIL)));
    }

    private String detailWithProfile(String profile, Throwable exception) {
        MockEnvironment environment = new MockEnvironment();
        environment.setActiveProfiles(profile);
        return new ExceptionTranslator(environment)
            .wrapAndCustomizeProblem(exception, new ServletWebRequest(new MockHttpServletRequest()))
            .getDetail();
    }

    @Test
    void shouldNameTheObjectOfAFieldErrorWithoutTheSuffixOfItsDto() {
        assertThat(ExceptionTranslator.objectName("AuthorDTO")).isEqualTo("author");
        assertThat(ExceptionTranslator.objectName("author")).isEqualTo("author");
    }

    @Test
    void shouldReplaceInProductionADetailOfTheCauseWithAClassName() {
        assertThat(detailWithProfile(JHipsterConstants.SPRING_PROFILE_PRODUCTION)).isEqualTo("Unexpected runtime exception");
    }

    @Test
    void shouldKeepTheDetailOfTheCauseOutOfProduction() {
        assertThat(detailWithProfile(JHipsterConstants.SPRING_PROFILE_DEVELOPMENT)).isEqualTo(CLASS_NAME_DETAIL);
    }

    @Test
    void shouldReplaceInProductionTheDetailOfAnError() {
        assertThat(
            detailWithProfile(JHipsterConstants.SPRING_PROFILE_PRODUCTION, new NoClassDefFoundError("com/mycompany/internal/Foo"))
        ).isEqualTo("Unexpected runtime exception");
    }

    @Test
    void shouldReplaceInProductionTheDetailOfAnErrorWrappedByTheDispatcherServlet() {
        Error error = new NoClassDefFoundError("com/mycompany/internal/Foo");
        assertThat(
            detailWithProfile(JHipsterConstants.SPRING_PROFILE_PRODUCTION, new ServletException("Handler dispatch failed: " + error, error))
        ).isEqualTo("Unexpected runtime exception");
    }

    @Test
    void shouldAnswerAnErrorWithAProblemDetail() {
        ExceptionTranslator exceptionTranslator = new ExceptionTranslator(new MockEnvironment());
        ResponseEntity<Object> response = exceptionTranslator.handleAnyException(
            new AssertionError("test error"),
            new ServletWebRequest(new MockHttpServletRequest())
        );
        assertThat(response).isNotNull();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isInstanceOf(ProblemDetailWithCause.class);
    }
}
