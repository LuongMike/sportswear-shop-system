package com.team6.ecommercesystem.dto.response;

import com.team6.ecommercesystem.model.enums.OrderStatus;
import com.team6.ecommercesystem.model.enums.PaymentMethod;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long id;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private Double totalAmount;
    private PaymentMethod paymentMethod;

    // Thông tin giao hàng snapshot
    private String recipientName;
    private String phoneNumber;
    private String shippingAddress;
    private String note;

    private List<OrderItemResponse> items;
}
