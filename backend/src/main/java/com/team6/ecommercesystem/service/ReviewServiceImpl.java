package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ReviewRequest;
import com.team6.ecommercesystem.dto.response.ReviewResponse;
import com.team6.ecommercesystem.model.Product;
import com.team6.ecommercesystem.model.ProductReview;
import com.team6.ecommercesystem.model.User;
import com.team6.ecommercesystem.model.OrderItem;
import com.team6.ecommercesystem.repository.OrderItemRepository;
import com.team6.ecommercesystem.repository.ProductReviewRepository;
import com.team6.ecommercesystem.repository.ProductRepository;
import com.team6.ecommercesystem.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Override
    @Transactional
    public ReviewResponse submitReview(ReviewRequest request, User currentUser) {
        // 1. Tìm OrderItem và kiểm tra tồn tại
        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Validation Error: Không tìm thấy sản phẩm trong đơn hàng."));

        // 2. Kiểm tra quyền sở hữu: OrderItem phải thuộc về User đang đăng nhập
        if (!orderItem.getOrder().getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Validation Error: Bạn chỉ có thể đánh giá sản phẩm bạn đã mua.");
        }

        // 3. Validate nội dung: Rating từ 1-5 (Bước Is review valid?)
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Validation Error: Số sao đánh giá phải từ 1 đến 5.");
        }

        // 4. Lấy Product từ Variant (Vì OrderItem liên kết qua ProductVariant)
        Product product = orderItem.getVariant().getProduct();

        // 5. Lưu đánh giá (Bước Save review)
        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(currentUser);
        review.setOrderItem(orderItem);
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        ProductReview savedReview = reviewRepository.save(review);

        // 6. Cập nhật Rating trung bình (Update Product Summary)
        updateProductRating(product.getId());

        return convertToResponse(savedReview);
    }

    @Override
    public List<ReviewResponse> getReviewsByProductId(Long productId) {
        List<ProductReview> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private void updateProductRating(Long productId) {
        Double averageRating = reviewRepository.calculateAverageRating(productId);
        Product product = productRepository.findById(productId).orElseThrow();
        product.setAverageRating(averageRating);
        productRepository.save(product);
    }

    private ReviewResponse convertToResponse(ProductReview review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setUserName(review.getUser().getFullName());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        response.setCreatedAt(review.getCreatedAt());
        // Nhãn Verified Purchase là true vì chúng ta đã check OrderItem ở trên
        response.setVerified(true);
        return response;
    }
}