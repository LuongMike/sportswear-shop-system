package com.team6.ecommercesystem.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIClassificationResult {
    private String category;
    private String sportType;
    private String targetGender;
    private String material;
    private List<String> tags;
    private String status;
}
