package com.salon.controller;

import com.salon.dto.ApiResponse;
import com.salon.dto.BookingDTO;
import com.salon.entity.BookingStatus;
import com.salon.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for booking management
 */
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings", description = "Appointment booking management")
public class BookingController {

    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Get all bookings", description = "Retrieve all bookings ordered by creation date")
    public ResponseEntity<ApiResponse<List<BookingDTO.Response>>> getAllBookings() {
        List<BookingDTO.Response> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get bookings by status", description = "Retrieve bookings filtered by status")
    public ResponseEntity<ApiResponse<List<BookingDTO.Response>>> getBookingsByStatus(
            @PathVariable BookingStatus status) {
        List<BookingDTO.Response> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get booking by ID", description = "Retrieve a specific booking by its ID")
    public ResponseEntity<ApiResponse<BookingDTO.Response>> getBookingById(@PathVariable String id) {
        BookingDTO.Response booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success(booking));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get booking summary", description = "Retrieve booking statistics")
    public ResponseEntity<ApiResponse<BookingDTO.Summary>> getBookingSummary() {
        BookingDTO.Summary summary = bookingService.getBookingSummary();
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @PostMapping
    @Operation(summary = "Create booking", description = "Create a new appointment booking")
    public ResponseEntity<ApiResponse<BookingDTO.Response>> createBooking(
            @Valid @RequestBody BookingDTO.CreateRequest request) {
        BookingDTO.Response created = bookingService.createBooking(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Booking created successfully. Pending approval.", created));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update booking status", description = "Approve or reject a booking")
    public ResponseEntity<ApiResponse<BookingDTO.Response>> updateBookingStatus(
            @PathVariable String id,
            @Valid @RequestBody BookingDTO.UpdateStatusRequest request) {
        BookingDTO.Response updated = bookingService.updateBookingStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Booking status updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete booking", description = "Delete a booking")
    public ResponseEntity<ApiResponse<Void>> deleteBooking(@PathVariable String id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking deleted successfully", null));
    }
}
