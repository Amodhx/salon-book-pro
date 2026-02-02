package com.salon.dto;

import com.salon.entity.Gender;
import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * DTO for Service entity
 */
public class ServiceDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer duration;
        private Gender gender;
        private String image;
        private Boolean active;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "Service name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        private String name;

        @Size(max = 500, message = "Description must be less than 500 characters")
        private String description;

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        private BigDecimal price;

        @NotNull(message = "Duration is required")
        @Min(value = 15, message = "Duration must be at least 15 minutes")
        private Integer duration;

        @NotNull(message = "Gender is required")
        private Gender gender;

        private String image;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        @Size(max = 100, message = "Name must be less than 100 characters")
        private String name;

        @Size(max = 500, message = "Description must be less than 500 characters")
        private String description;

        @DecimalMin(value = "0.01", message = "Price must be greater than 0")
        private BigDecimal price;

        @Min(value = 15, message = "Duration must be at least 15 minutes")
        private Integer duration;

        private Gender gender;
        private String image;
        private Boolean active;
    }
}
