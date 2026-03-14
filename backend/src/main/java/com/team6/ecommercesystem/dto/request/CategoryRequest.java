package com.team6.ecommercesystem.dto.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CategoryRequest {

    private String categoryName;
    private String description;
    private Long parentId; // có thể null nếu là root
}
