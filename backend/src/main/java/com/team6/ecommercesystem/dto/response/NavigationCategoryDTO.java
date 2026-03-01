package com.team6.ecommercesystem.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NavigationCategoryDTO {

    private Long id;
    private String categoryName;
    private List<NavigationCategoryDTO> children;
}
