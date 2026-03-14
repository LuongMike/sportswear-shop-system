package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.ProductVariant;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    Optional<ProductVariant> findBySku(String sku);

    @Modifying
    @Query("DELETE FROM ProductVariant pv WHERE pv.product.id = :productId")
    void deleteByProductId(@Param("productId") Long productId);
}
