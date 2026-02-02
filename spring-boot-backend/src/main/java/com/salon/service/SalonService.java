package com.salon.service;

import com.salon.dto.ServiceDTO;
import com.salon.entity.Gender;
import com.salon.entity.Service;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for salon services management
 */
@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class SalonService {

    private final ServiceRepository serviceRepository;

    public List<ServiceDTO.Response> getAllServices() {
        return serviceRepository.findByActiveTrue().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<ServiceDTO.Response> getServicesByGender(Gender gender) {
        return serviceRepository.findByGenderAndActiveTrue(gender).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public ServiceDTO.Response getServiceById(String id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        return toResponse(service);
    }

    public ServiceDTO.Response createService(ServiceDTO.CreateRequest request) {
        Service service = Service.builder()
            .name(request.getName())
            .description(request.getDescription())
            .price(request.getPrice())
            .duration(request.getDuration())
            .gender(request.getGender())
            .image(request.getImage())
            .active(true)
            .build();
        
        Service saved = serviceRepository.save(service);
        log.info("Created new service: {}", saved.getId());
        return toResponse(saved);
    }

    public ServiceDTO.Response updateService(String id, ServiceDTO.UpdateRequest request) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        
        if (request.getName() != null) service.setName(request.getName());
        if (request.getDescription() != null) service.setDescription(request.getDescription());
        if (request.getPrice() != null) service.setPrice(request.getPrice());
        if (request.getDuration() != null) service.setDuration(request.getDuration());
        if (request.getGender() != null) service.setGender(request.getGender());
        if (request.getImage() != null) service.setImage(request.getImage());
        if (request.getActive() != null) service.setActive(request.getActive());
        
        Service updated = serviceRepository.save(service);
        log.info("Updated service: {}", id);
        return toResponse(updated);
    }

    public void deleteService(String id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + id));
        service.setActive(false);
        serviceRepository.save(service);
        log.info("Soft deleted service: {}", id);
    }

    private ServiceDTO.Response toResponse(Service service) {
        return ServiceDTO.Response.builder()
            .id(service.getId())
            .name(service.getName())
            .description(service.getDescription())
            .price(service.getPrice())
            .duration(service.getDuration())
            .gender(service.getGender())
            .image(service.getImage())
            .active(service.getActive())
            .build();
    }
}
