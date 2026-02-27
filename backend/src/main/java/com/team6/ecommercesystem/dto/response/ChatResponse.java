package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResponse {
    private String response;
    private String status;
}
