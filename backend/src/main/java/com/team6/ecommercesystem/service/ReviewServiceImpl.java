package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ReviewRequest;
import com.team6.ecommercesystem.dto.response.ReviewResponse;
import com.team6.ecommercesystem.model.Product;
import com.team6.ecommercesystem.model.ProductReview;
import com.team6.ecommercesystem.model.User;
import com.team6.ecommercesystem.repository.ProductRepository;
import com.team6.ecommercesystem.repository.ProductReviewRepository;
import com.team6.ecommercesystem.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ProductReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional
    public ReviewResponse submitReview(Long userId, ReviewRequest request) {
        // 1. Validate content (Logic từ Activity Diagram)
        if (request.rating() < 1 || request.rating() > 5 || request.comment().isBlank()) {
            throw new RuntimeException("Validation Error: Invalid rating or empty comment");
        }

        User user = userRepository.findById(userId).orElseThrow();
        Product product = productRepository.findById(request.productId()).orElseThrow();

        // 2. Save review
        ProductReview review = new ProductReview();
        review.setUser(user);
        review.setProduct(product);
        review.setRating(request.rating());
        review.setComment(request.comment());

        ProductReview saved = reviewRepository.save(review);

        // 3. Return Response (Publish review)
        return new ReviewResponse(saved.getId(), user.getFullName(),
                saved.getRating(), saved.getComment(), saved.getCreatedAt());
    }

    @Override
    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(r -> new ReviewResponse(r.getId(), r.getUser().getFullName(),
                        r.getRating(), r.getComment(), r.getCreatedAt()))
                .toList();
    }
}
