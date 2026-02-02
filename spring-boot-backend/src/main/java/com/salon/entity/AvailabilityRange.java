package com.salon.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * AvailabilityRange entity for admin-defined booking periods
 */
@Entity
@Table(name = "availability_ranges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilityRange {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityType type;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @OneToMany(mappedBy = "availabilityRange", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TimeSlot> timeSlots = new ArrayList<>();

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addTimeSlot(TimeSlot slot) {
        timeSlots.add(slot);
        slot.setAvailabilityRange(this);
    }

    public void removeTimeSlot(TimeSlot slot) {
        timeSlots.remove(slot);
        slot.setAvailabilityRange(null);
    }
}
