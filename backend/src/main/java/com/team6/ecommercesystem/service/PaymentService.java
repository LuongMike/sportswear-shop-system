package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.response.PaymentResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentResponse createVnPayPayment(HttpServletRequest request, Long orderId);
}
