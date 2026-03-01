package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private Long id;
    private BigDecimal totalPrice;
    private Integer totalItems;
    private List<CartItemResponse> items;
}
