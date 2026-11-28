package com.mycompany.myapp.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mycompany.myapp.IntegrationTest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

/**
 * Integration tests for the requests {@link SecurityConfiguration} saves as the target to go back to after the login.
 */
@IntegrationTest
class SecurityConfigurationIT {

    private static final String SAVED_REQUEST = "SPRING_SECURITY_SAVED_REQUEST";

    @Autowired
    private WebApplicationContext context;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(context).apply(springSecurity()).build();
    }

    @Test
    void shouldNotSaveAnApiCallOfTheClient() throws Exception {
        MvcResult result = mockMvc
            .perform(get("/api/account").accept(MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN, MediaType.ALL))
            .andExpect(status().isUnauthorized())
            .andReturn();

        assertThat(savedRequest(result)).isNull();
    }

    @Test
    void shouldNotSaveAnEventStreamRequest() throws Exception {
        MvcResult result = mockMvc
            .perform(get("/api/account").accept(MediaType.TEXT_EVENT_STREAM))
            .andExpect(status().isUnauthorized())
            .andReturn();

        assertThat(savedRequest(result)).isNull();
    }

    @Test
    void shouldNotSaveAnXhrRequest() throws Exception {
        MvcResult result = mockMvc
            .perform(get("/api/account").header("X-Requested-With", "XMLHttpRequest"))
            .andExpect(status().isUnauthorized())
            .andReturn();

        assertThat(savedRequest(result)).isNull();
    }

    @Test
    void shouldSaveAPageRequest() throws Exception {
        // The path only has to require the authentication: the Accept header makes it a page request, which is saved.
        MvcResult result = mockMvc
            .perform(get("/api/account").accept(MediaType.TEXT_HTML))
            .andExpect(status().isUnauthorized())
            .andReturn();

        assertThat(savedRequest(result)).isNotNull();
    }

    private static Object savedRequest(MvcResult result) {
        HttpSession session = result.getRequest().getSession(false);
        return session == null ? null : session.getAttribute(SAVED_REQUEST);
    }
}
