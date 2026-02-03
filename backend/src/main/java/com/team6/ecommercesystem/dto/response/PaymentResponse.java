package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentResponse {
    private String status;
    private String message;
    private String paymentUrl;
}
