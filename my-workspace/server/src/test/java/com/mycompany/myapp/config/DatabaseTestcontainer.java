package com.mycompany.myapp.config;

import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.postgresql.PostgreSQLContainer;

@TestConfiguration(proxyBeanMethods = false)
public class DatabaseTestcontainer {

    private static final PostgreSQLContainer DATABASE_CONTAINER = new PostgreSQLContainer("postgres:18.6")
        .withDatabaseName("jhipster")

        .withLogConsumer(new Slf4jLogConsumer(LoggerFactory.getLogger(DatabaseTestcontainer.class)))
        .withReuse(true);

    @Bean
    @ServiceConnection
    PostgreSQLContainer databaseContainer() {
        return DATABASE_CONTAINER;
    }
}
