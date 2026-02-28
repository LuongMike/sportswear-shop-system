package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProductId(Long productId);
}