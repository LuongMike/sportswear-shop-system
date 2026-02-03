package com.team6.ecommercesystem.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data @Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {
    private String productName;
    private String description;
    private Long categoryId;
    private Long brandId;
    private Long sportId;
    private List<VariantRequest> variants;
}
