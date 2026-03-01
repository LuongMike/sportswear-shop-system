package com.team6.ecommercesystem.dto.request;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class CollectionRequest {
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String type;
    private Boolean isActive;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<Long> variantIds;
}
