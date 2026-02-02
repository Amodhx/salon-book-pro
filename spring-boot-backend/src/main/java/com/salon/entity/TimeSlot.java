package com.salon.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalTime;

/**
 * TimeSlot entity for available booking times
 */
@Entity
@Table(name = "time_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private LocalTime time;

    @Column(nullable = false)
    private Boolean isAvailable = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "availability_range_id", nullable = false)
    private AvailabilityRange availabilityRange;
}
