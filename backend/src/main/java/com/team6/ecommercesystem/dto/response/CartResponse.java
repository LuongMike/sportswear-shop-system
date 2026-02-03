package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CartResponse {
    private Long id;
    private Double totalPrice;
    private Integer totalItems;
    private List<CartItemResponse> items;
}
