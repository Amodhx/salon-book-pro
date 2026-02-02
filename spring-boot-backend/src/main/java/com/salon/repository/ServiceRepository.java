package com.salon.repository;

import com.salon.entity.Gender;
import com.salon.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Service entity
 */
@Repository
public interface ServiceRepository extends JpaRepository<Service, String> {
    
    List<Service> findByGenderAndActiveTrue(Gender gender);
    
    List<Service> findByActiveTrue();
    
    List<Service> findByGender(Gender gender);
}
