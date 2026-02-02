package com.salon.service;

import com.salon.dto.AvailabilityDTO;
import com.salon.entity.AvailabilityRange;
import com.salon.entity.TimeSlot;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.AvailabilityRangeRepository;
import com.salon.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for availability management
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AvailabilityService {

    private final AvailabilityRangeRepository availabilityRangeRepository;
    private final TimeSlotRepository timeSlotRepository;

    public List<AvailabilityDTO.Response> getAllAvailabilityRanges() {
        return availabilityRangeRepository.findByActiveTrue().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<AvailabilityDTO.Response> getUpcomingAvailability() {
        return availabilityRangeRepository.findUpcomingRanges(LocalDate.now()).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public AvailabilityDTO.Response getAvailabilityById(String id) {
        AvailabilityRange range = availabilityRangeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Availability range not found with id: " + id));
        return toResponse(range);
    }

    public List<AvailabilityDTO.TimeSlotResponse> getAvailableSlotsForDate(LocalDate date) {
        List<AvailabilityRange> ranges = availabilityRangeRepository.findActiveRangesForDate(date);
        
        if (ranges.isEmpty()) {
            return new ArrayList<>();
        }

        // Combine all available slots from matching ranges
        return ranges.stream()
            .flatMap(range -> range.getTimeSlots().stream())
            .filter(TimeSlot::getIsAvailable)
            .map(this::toTimeSlotResponse)
            .distinct()
            .sorted((a, b) -> a.getTime().compareTo(b.getTime()))
            .collect(Collectors.toList());
    }

    public AvailabilityDTO.Response createAvailabilityRange(AvailabilityDTO.CreateRequest request) {
        AvailabilityRange range = AvailabilityRange.builder()
            .type(request.getType())
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .active(true)
            .timeSlots(new ArrayList<>())
            .build();

        // Generate time slots
        LocalTime current = request.getStartTime();
        while (!current.isAfter(request.getEndTime())) {
            TimeSlot slot = TimeSlot.builder()
                .time(current)
                .isAvailable(true)
                .availabilityRange(range)
                .build();
            range.getTimeSlots().add(slot);
            current = current.plusHours(1);
        }

        AvailabilityRange saved = availabilityRangeRepository.save(range);
        log.info("Created availability range: {} ({} to {})", saved.getId(), request.getStartDate(), request.getEndDate());
        return toResponse(saved);
    }

    public AvailabilityDTO.Response updateAvailabilityRange(String id, AvailabilityDTO.UpdateRequest request) {
        AvailabilityRange range = availabilityRangeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Availability range not found with id: " + id));

        if (request.getType() != null) range.setType(request.getType());
        if (request.getStartDate() != null) range.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) range.setEndDate(request.getEndDate());
        if (request.getActive() != null) range.setActive(request.getActive());

        AvailabilityRange updated = availabilityRangeRepository.save(range);
        log.info("Updated availability range: {}", id);
        return toResponse(updated);
    }

    public void deleteAvailabilityRange(String id) {
        AvailabilityRange range = availabilityRangeRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Availability range not found with id: " + id));
        range.setActive(false);
        availabilityRangeRepository.save(range);
        log.info("Soft deleted availability range: {}", id);
    }

    public void updateTimeSlotAvailability(String slotId, boolean isAvailable) {
        TimeSlot slot = timeSlotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Time slot not found with id: " + slotId));
        slot.setIsAvailable(isAvailable);
        timeSlotRepository.save(slot);
        log.info("Updated time slot {} availability to: {}", slotId, isAvailable);
    }

    private AvailabilityDTO.Response toResponse(AvailabilityRange range) {
        return AvailabilityDTO.Response.builder()
            .id(range.getId())
            .type(range.getType())
            .startDate(range.getStartDate())
            .endDate(range.getEndDate())
            .timeSlots(range.getTimeSlots().stream()
                .map(this::toTimeSlotResponse)
                .collect(Collectors.toList()))
            .active(range.getActive())
            .build();
    }

    private AvailabilityDTO.TimeSlotResponse toTimeSlotResponse(TimeSlot slot) {
        return AvailabilityDTO.TimeSlotResponse.builder()
            .id(slot.getId())
            .time(slot.getTime())
            .isAvailable(slot.getIsAvailable())
            .build();
    }
}
