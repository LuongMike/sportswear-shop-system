package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class OrderItemResponse {
    private Long id;            // ID của dòng trong đơn hàng
    private Long variantId;     // ID của biến thể (để FE dẫn link về trang sản phẩm)
    private String productName;
    private String size;        // Quan trọng: Size lúc mua
    private String color;       // Quan trọng: Màu lúc mua
    private Double price;       // Giá tại thời điểm mua
    private Integer quantity;
    private Double subTotal;    // Thành tiền (price * quantity)
    private String variantImage; // Ảnh của biến thể đó
}
