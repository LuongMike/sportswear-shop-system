package com.team6.ecommercesystem.utils;

import com.team6.ecommercesystem.dto.response.ProductDetailResponse;
import com.team6.ecommercesystem.dto.response.ProductSummaryResponse;
import com.team6.ecommercesystem.dto.response.VariantResponse;
import com.team6.ecommercesystem.model.Product;
import com.team6.ecommercesystem.model.ProductImage;
import com.team6.ecommercesystem.model.ProductVariant;

import java.util.stream.Collectors;

public class ProductMapper {
    public static VariantResponse toVariantDto(ProductVariant variant) {
        return VariantResponse.builder()
                .id(variant.getId())
                .sku(variant.getSku())
                .size(variant.getSize())
                .color(variant.getColor())
                .price(variant.getPrice())
                .stockQuantity(variant.getStockQuantity())
                .imageUrls(variant.getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList()))
                .build();
    }

    public static ProductSummaryResponse toSummaryDto(Product product) {
        return ProductSummaryResponse.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .categoryName(product.getCategory().getCategoryName())
                .brandName(product.getBrand().getBrandName())
                .sportName(product.getSport().getSportName())
                .build();
    }

    public static ProductDetailResponse toDetailDto(Product product) {
        return ProductDetailResponse.builder()
                .id(product.getId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .categoryName(product.getCategory().getCategoryName())
                .brandName(product.getBrand().getBrandName())
                .sportName(product.getSport().getSportName())
                .variants(product.getVariants().stream()
                        .map(ProductMapper::toVariantDto)
                        .collect(Collectors.toList()))
                .build();
    }
}
