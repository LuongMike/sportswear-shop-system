package com.team6.ecommercesystem.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReviewResponse {
    private Long id;                // ID của đánh giá
    private String userName;        // Tên người đánh giá để hiển thị
    private int rating;             // Số sao
    private String comment;         // Nội dung
    private LocalDateTime createdAt; // Ngày đăng đánh giá
    private boolean isVerified;     // Nhãn "Đã mua hàng" (Nếu khớp với OrderItem)
}