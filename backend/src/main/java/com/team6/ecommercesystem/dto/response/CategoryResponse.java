package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CategoryResponse {

    private Long id;
    private String categoryName;
    private String description;
    private Long parentId;
}
