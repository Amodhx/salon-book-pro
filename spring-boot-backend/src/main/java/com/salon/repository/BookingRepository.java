package com.salon.repository;

import com.salon.entity.Booking;
import com.salon.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Repository for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, String> {
    
    List<Booking> findByStatus(BookingStatus status);
    
    List<Booking> findByBookingDate(LocalDate date);
    
    List<Booking> findByBookingDateAndTimeSlot(LocalDate date, LocalTime timeSlot);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate = :date AND b.timeSlot = :timeSlot AND b.status != 'REJECTED'")
    List<Booking> findActiveBookingsForSlot(
        @Param("date") LocalDate date, 
        @Param("timeSlot") LocalTime timeSlot
    );
    
    @Query("SELECT b FROM Booking b ORDER BY b.createdAt DESC")
    List<Booking> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT b FROM Booking b WHERE b.status = :status ORDER BY b.createdAt DESC")
    List<Booking> findByStatusOrderByCreatedAtDesc(@Param("status") BookingStatus status);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = :status")
    long countByStatus(@Param("status") BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.bookingDate BETWEEN :startDate AND :endDate")
    List<Booking> findByDateRange(
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate
    );
}
