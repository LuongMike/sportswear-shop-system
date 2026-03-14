package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ProductRequest;
import com.team6.ecommercesystem.dto.request.VariantRequest;
import com.team6.ecommercesystem.dto.response.ProductDetailResponse;
import com.team6.ecommercesystem.dto.response.ProductSummaryResponse;
import com.team6.ecommercesystem.dto.response.VariantResponse;
import com.team6.ecommercesystem.model.ProductVariant;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    public ProductDetailResponse createProduct(ProductRequest request);
    Page<ProductSummaryResponse> getAllProducts(int page, int size, String sortBy, String sortDir, Long categoryId, String keyword);
    public ProductDetailResponse getProductDetail(Long id);
    public ProductSummaryResponse updateProduct(Long id, ProductRequest request);
    public void deleteProduct(Long id);

    public VariantResponse addVariant(Long productId, VariantRequest request);
    public VariantResponse updateVariant(Long id, VariantRequest request);
    public void deleteVariant(Long id);
    public void updateStock(Long variantId, Integer quantity);
    List<ProductSummaryResponse> getActiveProducts();
    Page<ProductSummaryResponse> getActiveProducts(int page, int size, String sortBy, String sortDir, Long categoryId, String keyword);
    List<ProductSummaryResponse> filterProducts(
            Long categoryId,
            Long brandId,
            Long sportId
    );
    List<BrandResponse> getAllBrand();
}
