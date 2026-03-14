package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.response.ProductDetailResponse;
import com.team6.ecommercesystem.dto.response.ProductSummaryResponse;
import com.team6.ecommercesystem.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Public Product", description = "Public APIs for viewing products (Customers & Guests)")
public class PublicProductController {
    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products", description = "Lấy danh sách tóm tắt tất cả sản phẩm để hiển thị lên trang chủ")
    public ResponseEntity<Page<ProductSummaryResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(productService.getActiveProducts(page, size, sortBy, sortDir, categoryId, keyword));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product detail", description = "Xem chi tiết một sản phẩm kèm các biến thể (size, màu)")
    public ResponseEntity<ProductDetailResponse> getProductDetail(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetail(id));
    }

    @GetMapping("/brands")
    @Operation(
            summary = "Get brand",
            description = "Lấy danh sách các nhãn hàng"
    )
    public ResponseEntity<List<BrandResponse>> getBrand(){
        return ResponseEntity.ok(productService.getAllBrand());
    }
}