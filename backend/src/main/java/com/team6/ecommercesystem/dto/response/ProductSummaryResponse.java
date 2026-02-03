package com.team6.ecommercesystem.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {
    private Long id;
    private String productName;
    private String categoryName;
    private String brandName;
    private String sportName;
}
