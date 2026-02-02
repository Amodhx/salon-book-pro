package com.salon.service;

import com.salon.dto.BookingDTO;
import com.salon.entity.Booking;
import com.salon.entity.BookingStatus;
import com.salon.entity.Service;
import com.salon.exception.BadRequestException;
import com.salon.exception.ResourceNotFoundException;
import com.salon.repository.BookingRepository;
import com.salon.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service layer for booking management
 */
@org.springframework.stereotype.Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ServiceRepository serviceRepository;

    public List<BookingDTO.Response> getAllBookings() {
        return bookingRepository.findAllOrderByCreatedAtDesc().stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public List<BookingDTO.Response> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status).stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
    }

    public BookingDTO.Response getBookingById(String id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return toResponse(booking);
    }

    public BookingDTO.Response createBooking(BookingDTO.CreateRequest request) {
        // Validate service exists
        Service service = serviceRepository.findById(request.getServiceId())
            .orElseThrow(() -> new ResourceNotFoundException("Service not found with id: " + request.getServiceId()));

        // Check if slot is already booked
        List<Booking> existingBookings = bookingRepository.findActiveBookingsForSlot(
            request.getBookingDate(), request.getTimeSlot()
        );
        
        if (!existingBookings.isEmpty()) {
            throw new BadRequestException("This time slot is already booked");
        }

        Booking booking = Booking.builder()
            .fullName(request.getFullName())
            .phone(request.getPhone())
            .service(service)
            .gender(request.getGender())
            .bookingDate(request.getBookingDate())
            .timeSlot(request.getTimeSlot())
            .notes(request.getNotes())
            .paymentSlip(request.getPaymentSlip())
            .status(BookingStatus.PENDING)
            .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Created new booking: {} for {} on {}", saved.getId(), request.getFullName(), request.getBookingDate());
        return toResponse(saved);
    }

    public BookingDTO.Response updateBookingStatus(String id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        
        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);
        log.info("Updated booking {} status to: {}", id, status);
        return toResponse(updated);
    }

    public void deleteBooking(String id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        bookingRepository.delete(booking);
        log.info("Deleted booking: {}", id);
    }

    public BookingDTO.Summary getBookingSummary() {
        return BookingDTO.Summary.builder()
            .totalBookings(bookingRepository.count())
            .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
            .approvedBookings(bookingRepository.countByStatus(BookingStatus.APPROVED))
            .rejectedBookings(bookingRepository.countByStatus(BookingStatus.REJECTED))
            .build();
    }

    private BookingDTO.Response toResponse(Booking booking) {
        return BookingDTO.Response.builder()
            .id(booking.getId())
            .fullName(booking.getFullName())
            .phone(booking.getPhone())
            .serviceId(booking.getService().getId())
            .serviceName(booking.getService().getName())
            .gender(booking.getGender())
            .bookingDate(booking.getBookingDate())
            .timeSlot(booking.getTimeSlot())
            .notes(booking.getNotes())
            .paymentSlip(booking.getPaymentSlip())
            .status(booking.getStatus())
            .createdAt(booking.getCreatedAt())
            .build();
    }
}
