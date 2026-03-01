package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.ProductReview;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    List<ProductReview> findByProductId(Long productId);

    // Hàm tính điểm trung bình của một sản phẩm
    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId")
    Double calculateAverageRating(@Param("productId") Long productId);

    // Kiểm tra xem một OrderItem đã được đánh giá chưa (để tránh spam)
    boolean existsByOrderItemId(Long orderItemId);
}