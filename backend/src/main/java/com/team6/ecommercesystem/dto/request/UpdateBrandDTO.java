package com.team6.ecommercesystem.dto.request;

import lombok.*;

@Getter
@Setter
public class UpdateBrandDTO {
    private String name;
    private String slug;
    private String logo;
    private String description;
    private String banner;
    private Boolean isActive;
}
