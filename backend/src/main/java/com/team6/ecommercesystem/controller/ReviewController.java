package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.request.ReviewRequest;
import com.team6.ecommercesystem.dto.response.ReviewResponse;
import com.team6.ecommercesystem.model.User;
import com.team6.ecommercesystem.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    // 1. Gửi đánh giá mới - Khớp với bước "Submit review" trong Activity Diagram
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
        // Trong thực tế, bạn sẽ lấy User từ SecurityContextHolder (Spring Security)
        // Ở đây giả lập một User để test theo logic của ReviewService
        User currentUser = new User();
        currentUser.setId(1L); // Giả lập ID người dùng đang đăng nhập

        // Gọi đúng tên hàm submitReview đã định nghĩa trong Service
        return ResponseEntity.ok(reviewService.submitReview(request, currentUser));
    }

    // 2. Lấy danh sách đánh giá theo sản phẩm - Khớp với bước "View posted review"
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        // Sử dụng đúng tên hàm getReviewsByProductId đã thống nhất
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }
}
