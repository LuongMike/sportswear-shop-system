package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemResponse {
    private Long id;            // CartItem ID
    private Long variantId;     // Variant ID
    private String productName;
    private String size;
    private String color;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subTotal;    // price * quantity
    private String imageUrl;    // Ảnh đại diện của variant
    private Integer maxStock;
}
