package com.salon.controller;

import com.salon.dto.ApiResponse;
import com.salon.dto.ServiceDTO;
import com.salon.entity.Gender;
import com.salon.service.SalonService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for salon services
 */
@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
@Tag(name = "Services", description = "Salon services management")
public class ServiceController {

    private final SalonService salonService;

    @GetMapping
    @Operation(summary = "Get all services", description = "Retrieve all active salon services")
    public ResponseEntity<ApiResponse<List<ServiceDTO.Response>>> getAllServices() {
        List<ServiceDTO.Response> services = salonService.getAllServices();
        return ResponseEntity.ok(ApiResponse.success(services));
    }

    @GetMapping("/gender/{gender}")
    @Operation(summary = "Get services by gender", description = "Retrieve services for men or women")
    public ResponseEntity<ApiResponse<List<ServiceDTO.Response>>> getServicesByGender(
            @PathVariable Gender gender) {
        List<ServiceDTO.Response> services = salonService.getServicesByGender(gender);
        return ResponseEntity.ok(ApiResponse.success(services));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get service by ID", description = "Retrieve a specific service by its ID")
    public ResponseEntity<ApiResponse<ServiceDTO.Response>> getServiceById(@PathVariable String id) {
        ServiceDTO.Response service = salonService.getServiceById(id);
        return ResponseEntity.ok(ApiResponse.success(service));
    }

    @PostMapping
    @Operation(summary = "Create new service", description = "Create a new salon service")
    public ResponseEntity<ApiResponse<ServiceDTO.Response>> createService(
            @Valid @RequestBody ServiceDTO.CreateRequest request) {
        ServiceDTO.Response created = salonService.createService(request);
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("Service created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update service", description = "Update an existing service")
    public ResponseEntity<ApiResponse<ServiceDTO.Response>> updateService(
            @PathVariable String id,
            @Valid @RequestBody ServiceDTO.UpdateRequest request) {
        ServiceDTO.Response updated = salonService.updateService(id, request);
        return ResponseEntity.ok(ApiResponse.success("Service updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete service", description = "Soft delete a service")
    public ResponseEntity<ApiResponse<Void>> deleteService(@PathVariable String id) {
        salonService.deleteService(id);
        return ResponseEntity.ok(ApiResponse.success("Service deleted successfully", null));
    }
}
