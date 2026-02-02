package com.salon.dto;

import com.salon.entity.BookingStatus;
import com.salon.entity.Gender;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * DTO for Booking entity
 */
public class BookingDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String id;
        private String fullName;
        private String phone;
        private String serviceId;
        private String serviceName;
        private Gender gender;
        private LocalDate bookingDate;
        private LocalTime timeSlot;
        private String notes;
        private String paymentSlip;
        private BookingStatus status;
        private LocalDateTime createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotBlank(message = "Full name is required")
        @Size(max = 100, message = "Name must be less than 100 characters")
        private String fullName;

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[+]?[0-9\\s-]{10,15}$", message = "Invalid phone number format")
        private String phone;

        @NotBlank(message = "Service ID is required")
        private String serviceId;

        @NotNull(message = "Gender is required")
        private Gender gender;

        @NotNull(message = "Booking date is required")
        @FutureOrPresent(message = "Booking date must be today or in the future")
        private LocalDate bookingDate;

        @NotNull(message = "Time slot is required")
        private LocalTime timeSlot;

        @Size(max = 1000, message = "Notes must be less than 1000 characters")
        private String notes;

        private String paymentSlip; // Base64 encoded image
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateStatusRequest {
        @NotNull(message = "Status is required")
        private BookingStatus status;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Summary {
        private long totalBookings;
        private long pendingBookings;
        private long approvedBookings;
        private long rejectedBookings;
    }
}
