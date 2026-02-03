package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CartItemResponse {
    private Long id;            // CartItem ID
    private Long variantId;     // Variant ID
    private String productName;
    private String size;
    private String color;
    private Double price;
    private Integer quantity;
    private Double subTotal;    // price * quantity
    private String imageUrl;    // Ảnh đại diện của variant
    private Integer maxStock;
}
