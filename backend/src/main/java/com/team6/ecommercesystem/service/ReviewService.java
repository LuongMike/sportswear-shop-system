package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ReviewRequest;
import com.team6.ecommercesystem.dto.response.ReviewResponse;
import com.team6.ecommercesystem.model.User;
import java.util.List;

public interface ReviewService {
    // Gửi đánh giá mới (Xử lý bước Submit review trong sơ đồ)
    ReviewResponse submitReview(ReviewRequest request, User currentUser);

    // Lấy danh sách đánh giá theo sản phẩm (Xử lý bước View posted review)
    List<ReviewResponse> getReviewsByProductId(Long productId);
}