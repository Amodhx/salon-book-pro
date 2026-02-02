package com.salon.repository;

import com.salon.entity.AvailabilityRange;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

/**
 * Repository for AvailabilityRange entity
 */
@Repository
public interface AvailabilityRangeRepository extends JpaRepository<AvailabilityRange, String> {
    
    List<AvailabilityRange> findByActiveTrue();
    
    @Query("SELECT a FROM AvailabilityRange a WHERE a.active = true AND :date BETWEEN a.startDate AND a.endDate")
    List<AvailabilityRange> findActiveRangesForDate(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM AvailabilityRange a WHERE a.active = true AND a.startDate >= :startDate AND a.endDate <= :endDate")
    List<AvailabilityRange> findActiveRangesBetween(
        @Param("startDate") LocalDate startDate, 
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT a FROM AvailabilityRange a WHERE a.active = true AND a.endDate >= :today ORDER BY a.startDate ASC")
    List<AvailabilityRange> findUpcomingRanges(@Param("today") LocalDate today);
}
