package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByIsActiveTrue();

    @Query("SELECT p FROM Product p WHERE p.isActive = true " +
            "AND (:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> getActiveProductsWithFilters(
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR p.category.id = :categoryId) " +
            "AND (:keyword IS NULL OR LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Product> getAllProductsForAdmin(
            @Param("categoryId") Long categoryId,
            @Param("keyword") String keyword,
            Pageable pageable);

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
