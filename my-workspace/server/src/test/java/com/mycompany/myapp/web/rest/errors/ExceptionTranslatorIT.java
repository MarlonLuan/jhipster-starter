package com.mycompany.myapp.web.rest.errors;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mycompany.myapp.IntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests {@link ExceptionTranslator} controller advice.
 */
@WithMockUser
@AutoConfigureMockMvc
@IntegrationTest
class ExceptionTranslatorIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void testConcurrencyFailure() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/concurrency-failure").with(csrf()))
            .andExpect(status().isConflict())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value(ErrorConstants.ERR_CONCURRENCY_FAILURE));
    }

    @Test
    void testDataIntegrityViolation() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/data-integrity-violation"))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value(ErrorConstants.ERR_DATA_INTEGRITY_VIOLATION));
    }

    @Test
    void testTransientReference() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/transient-reference"))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value(ErrorConstants.ERR_DATA_INTEGRITY_VIOLATION));
    }

    @Test
    void testUnknownReference() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/unknown-reference"))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value(ErrorConstants.ERR_DATA_INTEGRITY_VIOLATION));
    }

    @Test
    void testInvalidSort() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/invalid-sort"))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.400"));
    }

    @Test
    void testUnreadableBody() throws Exception {
        mockMvc
            .perform(
                post("/api/exception-translator-test/method-argument").content("{").contentType(MediaType.APPLICATION_JSON).with(csrf())
            )
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.type").value("https://www.jhipster.tech/problem/problem-with-message"))
            .andExpect(jsonPath("$.message").value("error.http.400"))
            .andExpect(jsonPath("$.path").value("/api/exception-translator-test/method-argument"))
            .andExpect(jsonPath("$.detail").value("Failed to read request"));
    }

    @Test
    void testMethodArgumentNotValid() throws Exception {
        mockMvc
            .perform(
                post("/api/exception-translator-test/method-argument").content("{}").contentType(MediaType.APPLICATION_JSON).with(csrf())
            )
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value(ErrorConstants.ERR_VALIDATION))
            .andExpect(jsonPath("$.fieldErrors.[0].objectName").value("test"))
            .andExpect(jsonPath("$.fieldErrors.[0].field").value("test"))
            .andExpect(jsonPath("$.fieldErrors.[0].message").value("must not be null"))
            .andExpect(jsonPath("$.fieldErrors.[0].code").value("NotNull"));
    }

    @Test
    void testMethodValidationOfTheBody() throws Exception {
        mockMvc
            .perform(
                post("/api/exception-translator-test/method-validation/abc")
                    .content("{}")
                    .contentType(MediaType.APPLICATION_JSON)
                    .with(csrf())
            )
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value(ErrorConstants.ERR_VALIDATION))
            .andExpect(jsonPath("$.fieldErrors.[0].objectName").value("test"))
            .andExpect(jsonPath("$.fieldErrors.[0].field").value("test"))
            .andExpect(jsonPath("$.fieldErrors.[0].message").value("must not be null"))
            .andExpect(jsonPath("$.fieldErrors.[0].code").value("NotNull"));
    }

    @Test
    void testMethodValidationOfAParameter() throws Exception {
        mockMvc
            .perform(
                post("/api/exception-translator-test/method-validation/abcdef")
                    .content("{\"test\": \"test\"}")
                    .contentType(MediaType.APPLICATION_JSON)
                    .with(csrf())
            )
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value(ErrorConstants.ERR_VALIDATION))
            .andExpect(jsonPath("$.fieldErrors.[0].objectName").value("exceptionTranslatorTestController"))
            .andExpect(jsonPath("$.fieldErrors.[0].field").value("name"))
            .andExpect(jsonPath("$.fieldErrors.[0].code").value("Size"));
    }

    @Test
    void testMissingServletRequestPartException() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/missing-servlet-request-part").with(csrf()))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.400"));
    }

    @Test
    void testMissingServletRequestParameterException() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/missing-servlet-request-parameter").with(csrf()))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.400"));
    }

    @Test
    void testAccessDenied() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/access-denied").with(csrf()))
            .andExpect(status().isForbidden())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.403"))
            .andExpect(jsonPath("$.detail").value("test access denied!"));
    }

    @Test
    void testUnauthorized() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/unauthorized").with(csrf()))
            .andExpect(status().isUnauthorized())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.401"))
            .andExpect(jsonPath("$.path").value("/api/exception-translator-test/unauthorized"))
            .andExpect(jsonPath("$.detail").value("test authentication failed!"));
    }

    @Test
    void testBadRequestAlert() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/bad-request-alert"))
            .andExpect(status().isBadRequest())
            .andExpect(header().string("X-jhipster-error", "error.testkey"))
            .andExpect(jsonPath("$.message").value("error.testkey"))
            .andExpect(jsonPath("$.detail").doesNotExist());
    }

    @Test
    void testResponseStatusException() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/response-status-exception").with(csrf()))
            .andExpect(status().isNotFound())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.404"))
            .andExpect(jsonPath("$.title").value("Not Found"))
            .andExpect(jsonPath("$.detail").value("Not Found"));
    }

    @Test
    void testBindingFailure() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/binding-failure").param("number", "abc"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.fieldErrors.[0].field").value("number"))
            .andExpect(jsonPath("$.fieldErrors.[0].message").value("typeMismatch"))
            .andExpect(jsonPath("$.fieldErrors.[0].code").value("typeMismatch"));
    }

    @Test
    void testMethodNotSupported() throws Exception {
        mockMvc
            .perform(post("/api/exception-translator-test/access-denied").with(csrf()))
            .andExpect(status().isMethodNotAllowed())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.405"))
            .andExpect(jsonPath("$.detail").value("Request method 'POST' is not supported"));
    }

    @Test
    void testNotFound() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/nothing").with(csrf()))
            .andExpect(status().isNotFound())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.404"))
            .andExpect(jsonPath("$.title").value("Not Found"))
            .andExpect(jsonPath("$.detail").value("Not Found"));
    }

    @Test
    void testExceptionWithResponseStatus() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/response-status").with(csrf()))
            .andExpect(status().isBadRequest())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.400"))
            .andExpect(jsonPath("$.title").value("test response status"));
    }

    @Test
    void testOpenApiResourceNotFound() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/open-api-resource-not-found").with(csrf()))
            .andExpect(status().isNotFound())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.404"))
            .andExpect(jsonPath("$.title").value("Not Found"));
    }

    @Test
    void testInternalServerError() throws Exception {
        mockMvc
            .perform(get("/api/exception-translator-test/internal-server-error").with(csrf()))
            .andExpect(status().isInternalServerError())
            .andExpect(content().contentType(MediaType.APPLICATION_PROBLEM_JSON))
            .andExpect(jsonPath("$.message").value("error.http.500"))
            .andExpect(jsonPath("$.title").value("Internal Server Error"));
    }
}
