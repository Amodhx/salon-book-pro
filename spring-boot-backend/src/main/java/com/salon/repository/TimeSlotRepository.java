package com.salon.repository;

import com.salon.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for TimeSlot entity
 */
@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, String> {
    
    List<TimeSlot> findByAvailabilityRangeId(String availabilityRangeId);
    
    @Query("SELECT t FROM TimeSlot t WHERE t.availabilityRange.id = :rangeId AND t.isAvailable = true")
    List<TimeSlot> findAvailableSlotsByRangeId(@Param("rangeId") String rangeId);
}
