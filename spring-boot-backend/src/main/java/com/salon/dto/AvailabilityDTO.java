package com.salon.dto;

import com.salon.entity.AvailabilityType;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * DTO for AvailabilityRange entity
 */
public class AvailabilityDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TimeSlotResponse {
        private String id;
        private LocalTime time;
        private Boolean isAvailable;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Response {
        private String id;
        private AvailabilityType type;
        private LocalDate startDate;
        private LocalDate endDate;
        private List<TimeSlotResponse> timeSlots;
        private Boolean active;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRequest {
        @NotNull(message = "Availability type is required")
        private AvailabilityType type;

        @NotNull(message = "Start date is required")
        private LocalDate startDate;

        @NotNull(message = "End date is required")
        private LocalDate endDate;

        @NotNull(message = "Start time is required")
        private LocalTime startTime;

        @NotNull(message = "End time is required")
        private LocalTime endTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateRequest {
        private AvailabilityType type;
        private LocalDate startDate;
        private LocalDate endDate;
        private Boolean active;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DateRequest {
        @NotNull(message = "Date is required")
        private LocalDate date;
    }
}
