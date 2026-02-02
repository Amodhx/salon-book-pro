package com.salon.config;

import com.salon.entity.*;
import com.salon.repository.AvailabilityRangeRepository;
import com.salon.repository.ServiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Loads initial data into the database on application startup
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataLoader implements CommandLineRunner {

    private final ServiceRepository serviceRepository;
    private final AvailabilityRangeRepository availabilityRangeRepository;

    @Override
    public void run(String... args) {
        loadServices();
        loadAvailabilityRanges();
        log.info("Initial data loaded successfully");
    }

    private void loadServices() {
        if (serviceRepository.count() > 0) {
            log.info("Services already exist, skipping data load");
            return;
        }

        // Men's Services
        List<Service> menServices = List.of(
            Service.builder()
                .name("Classic Haircut")
                .description("Traditional precision cut with styling")
                .price(new BigDecimal("45.00"))
                .duration(30)
                .gender(Gender.MEN)
                .active(true)
                .build(),
            Service.builder()
                .name("Beard Grooming")
                .description("Shape, trim, and hot towel treatment")
                .price(new BigDecimal("35.00"))
                .duration(25)
                .gender(Gender.MEN)
                .active(true)
                .build(),
            Service.builder()
                .name("Executive Facial")
                .description("Deep cleansing and rejuvenating treatment")
                .price(new BigDecimal("75.00"))
                .duration(45)
                .gender(Gender.MEN)
                .active(true)
                .build(),
            Service.builder()
                .name("Hair Styling")
                .description("Premium styling with quality products")
                .price(new BigDecimal("55.00"))
                .duration(40)
                .gender(Gender.MEN)
                .active(true)
                .build()
        );

        // Women's Services
        List<Service> womenServices = List.of(
            Service.builder()
                .name("Signature Haircut")
                .description("Expert cut tailored to your style")
                .price(new BigDecimal("65.00"))
                .duration(45)
                .gender(Gender.WOMEN)
                .active(true)
                .build(),
            Service.builder()
                .name("Color & Highlights")
                .description("Full color service with premium dyes")
                .price(new BigDecimal("150.00"))
                .duration(120)
                .gender(Gender.WOMEN)
                .active(true)
                .build(),
            Service.builder()
                .name("Luxury Spa Treatment")
                .description("Complete relaxation experience")
                .price(new BigDecimal("120.00"))
                .duration(90)
                .gender(Gender.WOMEN)
                .active(true)
                .build(),
            Service.builder()
                .name("Bridal Makeup")
                .description("Flawless bridal look for your special day")
                .price(new BigDecimal("200.00"))
                .duration(90)
                .gender(Gender.WOMEN)
                .active(true)
                .build(),
            Service.builder()
                .name("Blowout & Styling")
                .description("Professional blowout with styling")
                .price(new BigDecimal("55.00"))
                .duration(45)
                .gender(Gender.WOMEN)
                .active(true)
                .build()
        );

        serviceRepository.saveAll(menServices);
        serviceRepository.saveAll(womenServices);
        log.info("Loaded {} services", menServices.size() + womenServices.size());
    }

    private void loadAvailabilityRanges() {
        if (availabilityRangeRepository.count() > 0) {
            log.info("Availability ranges already exist, skipping data load");
            return;
        }

        LocalDate today = LocalDate.now();

        // Weekly range for next week
        AvailabilityRange weeklyRange = AvailabilityRange.builder()
            .type(AvailabilityType.WEEKLY)
            .startDate(today.plusDays(1))
            .endDate(today.plusDays(7))
            .active(true)
            .timeSlots(new ArrayList<>())
            .build();

        // Add time slots (9 AM to 7 PM)
        for (int hour = 9; hour <= 19; hour++) {
            TimeSlot slot = TimeSlot.builder()
                .time(LocalTime.of(hour, 0))
                .isAvailable(true)
                .availabilityRange(weeklyRange)
                .build();
            weeklyRange.getTimeSlots().add(slot);
        }

        // Monthly range for next month
        AvailabilityRange monthlyRange = AvailabilityRange.builder()
            .type(AvailabilityType.MONTHLY)
            .startDate(today.plusDays(8))
            .endDate(today.plusDays(30))
            .active(true)
            .timeSlots(new ArrayList<>())
            .build();

        for (int hour = 9; hour <= 19; hour++) {
            TimeSlot slot = TimeSlot.builder()
                .time(LocalTime.of(hour, 0))
                .isAvailable(true)
                .availabilityRange(monthlyRange)
                .build();
            monthlyRange.getTimeSlots().add(slot);
        }

        availabilityRangeRepository.save(weeklyRange);
        availabilityRangeRepository.save(monthlyRange);
        log.info("Loaded 2 availability ranges");
    }
}
