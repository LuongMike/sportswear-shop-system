package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @Query("""
    SELECT DISTINCT p FROM Product p
    LEFT JOIN FETCH p.variants v
    LEFT JOIN FETCH v.images i
    WHERE (:categoryId IS NULL OR p.category.id = :categoryId)
      AND (:brandId IS NULL OR p.brand.id = :brandId)
      AND (:sportId IS NULL OR p.sport.id = :sportId)
""")
    List<Product> filterProducts(
            Long categoryId,
            Long brandId,
            Long sportId
    );
}
