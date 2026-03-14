package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {

    @Query("SELECT b.id FROM Brand b WHERE b.brandName = :brandName")
    Long findIdByBrandName(@Param("brandName") String brandName);
}
