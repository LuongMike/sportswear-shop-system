package com.team6.ecommercesystem.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String productName;
    private String description;
    private String categoryName;
    private String brandName;
    private String sportName;
    private List<VariantResponse> variants;
}
