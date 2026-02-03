package com.team6.ecommercesystem.model.enums;

public enum OrderStatus {
    PENDING,    // Chờ xử lý/Chờ thanh toán
    PAID,       // Đã thanh toán (Chờ giao)
    SHIPPED,    // Đang giao hàng
    DELIVERED,  // Giao thành công
    CANCELLED   // Đã hủy
}
