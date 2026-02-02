package com.salon.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI/Swagger documentation configuration
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI salonOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Salon Booking API")
                .description("RESTful API for Men's & Women's Salon Appointment Booking System")
                .version("1.0.0")
                .contact(new Contact()
                    .name("Salon Support")
                    .email("support@salon.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .servers(List.of(
                new Server().url("http://localhost:8080").description("Development Server")
            ));
    }
}
