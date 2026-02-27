package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class CollectionResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String type;
    private Boolean isActive;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<VariantResponse> variants;
}
