package com.salon.controller;

import com.salon.dto.ApiResponse;
import com.salon.dto.AvailabilityDTO;
import com.salon.service.AvailabilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for availability management
 */
@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
@Tag(name = "Availability", description = "Booking availability management")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @GetMapping
    @Operation(summary = "Get all availability ranges", description = "Retrieve all active availability ranges")
    public ResponseEntity<ApiResponse<List<AvailabilityDTO.Response>>> getAllAvailabilityRanges() {
        List<AvailabilityDTO.Response> ranges = availabilityService.getAllAvailabilityRanges();
        return ResponseEntity.ok(ApiResponse.success(ranges));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming availability", description = "Retrieve availability ranges from today onwards")
    public ResponseEntity<ApiResponse<List<AvailabilityDTO.Response>>> getUpcomingAvailability() {
        List<AvailabilityDTO.Response> ranges = availabilityService.getUpcomingAvailability();
        return ResponseEntity.ok(ApiResponse.success(ranges));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get availability by ID", description = "Retrieve a specific availability range")
    public ResponseEntity<ApiResponse<AvailabilityDTO.Response>> getAvailabilityById(@PathVariable String id) {
        AvailabilityDTO.Response range = availabilityService.getAvailabilityById(id);
        return ResponseEntity.ok(ApiResponse.success(range));
    }

    @GetMapping("/slots")
    @Operation(summary = "Get available slots for date", description = "Retrieve available time slots for a specific date")
    public ResponseEntity<ApiResponse<List<AvailabilityDTO.TimeSlotResponse>>> getAvailableSlotsForDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<AvailabilityDTO.TimeSlotResponse> slots = availabilityService.getAvailableSlotsForDate(date);
        return ResponseEntity.ok(ApiResponse.success(slots));
    }

    @PostMapping
    @Operation(summary = "Create availability range", description = "Create a new availability range with time slots")
    public ResponseEntity<ApiResponse<AvailabilityDTO.Response>> createAvailabilityRange(
            @Valid @RequestBody AvailabilityDTO.CreateRequest request) {
        AvailabilityDTO.Response created = availabilityService.createAvailabilityRange(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Availability range created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update availability range", description = "Update an existing availability range")
    public ResponseEntity<ApiResponse<AvailabilityDTO.Response>> updateAvailabilityRange(
            @PathVariable String id,
            @Valid @RequestBody AvailabilityDTO.UpdateRequest request) {
        AvailabilityDTO.Response updated = availabilityService.updateAvailabilityRange(id, request);
        return ResponseEntity.ok(ApiResponse.success("Availability range updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete availability range", description = "Soft delete an availability range")
    public ResponseEntity<ApiResponse<Void>> deleteAvailabilityRange(@PathVariable String id) {
        availabilityService.deleteAvailabilityRange(id);
        return ResponseEntity.ok(ApiResponse.success("Availability range deleted successfully", null));
    }

    @PatchMapping("/slots/{slotId}")
    @Operation(summary = "Update time slot availability", description = "Enable or disable a specific time slot")
    public ResponseEntity<ApiResponse<Void>> updateTimeSlotAvailability(
            @PathVariable String slotId,
            @RequestParam boolean isAvailable) {
        availabilityService.updateTimeSlotAvailability(slotId, isAvailable);
        return ResponseEntity.ok(ApiResponse.success("Time slot updated successfully", null));
    }
}
