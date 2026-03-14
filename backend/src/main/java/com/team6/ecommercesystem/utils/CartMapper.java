package com.team6.ecommercesystem.utils;

import com.team6.ecommercesystem.dto.response.CartItemResponse;
import com.team6.ecommercesystem.dto.response.CartResponse;
import com.team6.ecommercesystem.model.Cart;
import com.team6.ecommercesystem.model.CartItem;
import com.team6.ecommercesystem.model.ProductImage;
import com.team6.ecommercesystem.model.ProductVariant;

import java.math.BigDecimal;
import java.util.stream.Collectors;

public class CartMapper {
    public static CartResponse toResponse(Cart cart) {
        return CartResponse.builder()
                .id(cart.getId())
                .totalPrice(cart.getTotalPrice())
                .totalItems(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum())
                .items(cart.getItems().stream().map(CartMapper::toItemResponse).collect(Collectors.toList()))
                .build();
    }

    private static CartItemResponse toItemResponse(CartItem item) {
        ProductVariant v = item.getVariant();
        String imgUrl = (v.getImages() == null || v.getImages().isEmpty())
                ? ""
                : v.getImages()
                .stream()
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null);

        return CartItemResponse.builder()
                .id(item.getId())
                .variantId(v.getId())
                .productName(v.getProduct().getProductName())
                .size(v.getSize())
                .color(v.getColor())
                .price(v.getPrice())
                .quantity(item.getQuantity())
                .subTotal(v.getPrice().multiply(new BigDecimal(item.getQuantity())))
                .imageUrl(imgUrl)
                .maxStock(v.getStockQuantity())
                .build();
    }
}
