package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.request.ReviewRequest;
import com.team6.ecommercesystem.dto.response.ReviewResponse;
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

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(@RequestBody ReviewRequest request) {
        // Giả sử lấy userId từ Security Context
        Long currentUserId = 1L;
        return ResponseEntity.ok(reviewService.submitReview(currentUserId, request));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }
}
