package com.team6.ecommercesystem.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewRequest {
    private Long productId;     // ID sản phẩm được đánh giá
    private Long orderItemId;  // ID của dòng hàng trong đơn (để check Verified Purchase)
    private int rating;         // Số sao từ 1-5
    private String comment;     // Nội dung đánh giá
}