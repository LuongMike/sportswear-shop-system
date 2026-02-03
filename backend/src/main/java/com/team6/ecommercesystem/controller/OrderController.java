package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.request.OrderCreationRequest;
import com.team6.ecommercesystem.dto.response.OrderResponse;
import com.team6.ecommercesystem.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "Checkout and Order History")
public class OrderController {
    private final OrderService orderService;

    @PostMapping("/checkout")
    @Operation(summary = "Place an order (Checkout)", description = "Create order from current cart")
    public ResponseEntity<OrderResponse> placeOrder(@Valid @RequestBody OrderCreationRequest request) {
        return ResponseEntity.ok(orderService.createOrder(request));
    }

    @GetMapping
    @Operation(summary = "Get my order history")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }
}
