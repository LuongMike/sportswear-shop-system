package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.AddToCartRequest;
import com.team6.ecommercesystem.dto.response.CartResponse;
import com.team6.ecommercesystem.model.User;

public interface CartService {
    User getCurrentUser();
    CartResponse getMyCart();
    CartResponse addToCart(AddToCartRequest request);
    CartResponse updateItemQuantity(Long cartItemId, Integer quantity);
    CartResponse removeItem(Long cartItemId);
    void clearCart();
}
