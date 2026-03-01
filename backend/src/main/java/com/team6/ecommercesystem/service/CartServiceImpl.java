package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.AddToCartRequest;
import com.team6.ecommercesystem.dto.response.CartResponse;
import com.team6.ecommercesystem.model.Cart;
import com.team6.ecommercesystem.model.CartItem;
import com.team6.ecommercesystem.model.ProductVariant;
import com.team6.ecommercesystem.model.User;
import com.team6.ecommercesystem.repository.CartRepository;
import com.team6.ecommercesystem.repository.ProductVariantRepository;
import com.team6.ecommercesystem.repository.UserRepository;
import com.team6.ecommercesystem.utils.CartMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements  CartService {
    private final CartRepository cartRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    @Override
    public User getCurrentUser() {
        try {
            String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
            Long userId = Long.parseLong(userIdStr);
            return userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid User ID");
        }
    }

    @Override
    public CartResponse getMyCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> {
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
        return CartMapper.toResponse(cart);
    }

    @Override
    public CartResponse addToCart(AddToCartRequest request) {
        User user = getCurrentUser();

        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        ProductVariant variant = variantRepository.findById(request.getVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Không đủ hàng trong kho. Chỉ còn: " + variant.getStockQuantity());
        }

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getVariant().getId().equals(variant.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // Cộng dồn số lượng
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + request.getQuantity();

            // Check tồn kho lần nữa cho tổng số lượng
            if (newQty > variant.getStockQuantity()) {
                throw new RuntimeException("Tổng số lượng vượt quá tồn kho");
            }
            item.setQuantity(newQty);
        } else {
            // Thêm mới
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .variant(variant)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse updateItemQuantity(Long cartItemId, Integer quantity) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not in cart"));

        // Validate tồn kho
        if (quantity > item.getVariant().getStockQuantity()) {
            throw new RuntimeException("Vượt quá số lượng tồn kho");
        }

        item.setQuantity(quantity);
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    public CartResponse removeItem(Long cartItemId) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        return CartMapper.toResponse(cartRepository.save(cart));
    }

    @Override
    public void clearCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId()).orElse(null);
        if (cart != null) {
            cart.getItems().clear();
            cartRepository.save(cart);
        }
    }
}
