package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ProductRequest;
import com.team6.ecommercesystem.dto.request.VariantRequest;
import com.team6.ecommercesystem.dto.response.ProductDetailResponse;
import com.team6.ecommercesystem.dto.response.ProductSummaryResponse;
import com.team6.ecommercesystem.dto.response.VariantResponse;
import com.team6.ecommercesystem.model.ProductVariant;

import java.util.List;

public interface ProductService {
    public ProductDetailResponse createProduct(ProductRequest request);
    public List<ProductSummaryResponse> getAllProducts();
    public ProductDetailResponse getProductDetail(Long id);
    public ProductSummaryResponse updateProduct(Long id, ProductRequest request);
    public void deleteProduct(Long id);

    public VariantResponse addVariant(Long productId, VariantRequest request);
    public VariantResponse updateVariant(Long id, VariantRequest request);
    public void deleteVariant(Long id);
    public void updateStock(Long variantId, Integer quantity);
}
