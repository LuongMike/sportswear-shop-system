package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.OrderCreationRequest;
import com.team6.ecommercesystem.dto.response.OrderResponse;
import com.team6.ecommercesystem.model.User;

import java.util.List;

public interface OrderService {
    User getCurrentUser();
    OrderResponse createOrder(OrderCreationRequest request);
    List<OrderResponse> getMyOrders();
}
