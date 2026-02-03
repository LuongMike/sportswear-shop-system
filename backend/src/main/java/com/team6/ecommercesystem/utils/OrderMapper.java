package com.team6.ecommercesystem.utils;

import com.team6.ecommercesystem.dto.response.OrderItemResponse;
import com.team6.ecommercesystem.dto.response.OrderResponse;
import com.team6.ecommercesystem.model.Order;
import com.team6.ecommercesystem.model.OrderItem;
import com.team6.ecommercesystem.model.ProductVariant;

import java.util.stream.Collectors;

public class OrderMapper {
    public static OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .orderDate(order.getOrderDate())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .paymentMethod(order.getPaymentMethod())
                .recipientName(order.getRecipientName())
                .phoneNumber(order.getPhoneNumber())
                .shippingAddress(order.getShippingAddress())
                .note(order.getNote())
                .items(order.getOrderItems().stream().map(OrderMapper::toItemResponse).collect(Collectors.toList()))
                .build();
    }

    private static OrderItemResponse toItemResponse(OrderItem item) {
        ProductVariant v = item.getVariant();
        // Lấy ảnh đầu tiên của variant làm ảnh đại diện, nếu không có thì để chuỗi rỗng
        String imgUrl = (v.getImages() != null && !v.getImages().isEmpty())
                ? v.getImages().get(0).getImageUrl()
                : "";

        return OrderItemResponse.builder()
                .id(item.getId())
                .variantId(v.getId())
                .productName(v.getProduct().getProductName())
                .size(v.getSize())
                .color(v.getColor())
                .price(item.getPrice()) // Lưu ý: Lấy giá từ OrderItem (giá lúc mua) chứ không phải giá hiện tại của Variant
                .quantity(item.getQuantity())
                .subTotal(item.getPrice() * item.getQuantity())
                .variantImage(imgUrl)
                .build();
    }
}
