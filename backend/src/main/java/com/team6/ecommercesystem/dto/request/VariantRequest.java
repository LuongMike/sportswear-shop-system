package com.team6.ecommercesystem.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder
@NoArgsConstructor
@AllArgsConstructor
public class VariantRequest {
    private String size;
    private String color;
    private Double price;
    private Integer stockQuantity;
    private String sku;
    private List<String> imageUrls;
}
