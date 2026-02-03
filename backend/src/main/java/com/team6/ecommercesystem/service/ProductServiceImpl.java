package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ProductRequest;
import com.team6.ecommercesystem.dto.request.VariantRequest;
import com.team6.ecommercesystem.dto.response.ProductDetailResponse;
import com.team6.ecommercesystem.dto.response.ProductSummaryResponse;
import com.team6.ecommercesystem.dto.response.VariantResponse;
import com.team6.ecommercesystem.model.*;
import com.team6.ecommercesystem.repository.*;
import com.team6.ecommercesystem.utils.ProductMapper;
import com.team6.ecommercesystem.utils.SkuGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService{
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final SportRepository sportRepository;
    private final ProductVariantRepository variantRepository;

    @Transactional
    @Override
    public ProductDetailResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .productName(request.getProductName()).description(request.getDescription())
                .category(categoryRepository.findById(request.getCategoryId()).orElseThrow())
                .brand(brandRepository.findById(request.getBrandId()).orElseThrow())
                .sport(sportRepository.findById(request.getSportId()).orElseThrow()).build();

        product.setVariants(request.getVariants().stream().map(vReq -> {
            String sku = (vReq.getSku() == null || vReq.getSku().isBlank())
                    ? SkuGenerator.generateSku(product.getProductName(), vReq.getColor(), vReq.getSize()) : vReq.getSku();
            ProductVariant v = ProductVariant.builder().sku(sku).size(vReq.getSize()).color(vReq.getColor())
                    .price(vReq.getPrice()).stockQuantity(vReq.getStockQuantity()).product(product).build();
            if (vReq.getImageUrls() != null) {
                v.setImages(vReq.getImageUrls().stream().map(url -> ProductImage.builder()
                        .imageUrl(url).variant(v).isPrimary(vReq.getImageUrls().indexOf(url) == 0).build()).collect(Collectors.toList()));
            }
            return v;
        }).collect(Collectors.toList()));
        return ProductMapper.toDetailDto(productRepository.save(product));
    }

    @Transactional(readOnly = true)
    @Override
    public List<ProductSummaryResponse> getAllProducts() {
        return productRepository.findAll().stream().map(ProductMapper::toSummaryDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public ProductDetailResponse getProductDetail(Long id) {
        return ProductMapper.toDetailDto(productRepository.findById(id).orElseThrow());
    }

    @Transactional
    @Override
    public ProductSummaryResponse updateProduct(Long id, ProductRequest request) {
        Product p = productRepository.findById(id).orElseThrow();
        p.setProductName(request.getProductName());
        p.setCategory(categoryRepository.findById(request.getCategoryId()).orElseThrow());
        p.setBrand(brandRepository.findById(request.getBrandId()).orElseThrow());
        p.setSport(sportRepository.findById(request.getSportId()).orElseThrow());
        return ProductMapper.toSummaryDto(productRepository.save(p));
    }

    @Transactional
    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    @Override
    public VariantResponse addVariant(Long productId, VariantRequest request) {
        Product p = productRepository.findById(productId).orElseThrow();
        String sku = SkuGenerator.generateSku(p.getProductName(), request.getColor(), request.getSize());
        ProductVariant v = ProductVariant.builder().sku(sku).size(request.getSize()).color(request.getColor())
                .price(request.getPrice()).stockQuantity(request.getStockQuantity()).product(p).build();
        if (request.getImageUrls() != null) {
            v.setImages(request.getImageUrls().stream().map(url -> ProductImage.builder()
                    .imageUrl(url).variant(v).isPrimary(request.getImageUrls().indexOf(url) == 0).build()).collect(Collectors.toList()));
        }
        return ProductMapper.toVariantDto(variantRepository.save(v));
    }

    @Transactional
    @Override
    public VariantResponse updateVariant(Long id, VariantRequest request) {
        ProductVariant v = variantRepository.findById(id).orElseThrow();
        v.setSize(request.getSize()); v.setColor(request.getColor());
        v.setPrice(request.getPrice()); v.setStockQuantity(request.getStockQuantity());
        if (request.getImageUrls() != null) {
            v.getImages().clear();
            v.getImages().addAll(request.getImageUrls().stream().map(url -> ProductImage.builder()
                    .imageUrl(url).variant(v).isPrimary(request.getImageUrls().indexOf(url) == 0).build()).collect(Collectors.toList()));
        }
        return ProductMapper.toVariantDto(variantRepository.save(v));
    }

    @Transactional
    @Override
    public void deleteVariant(Long id) {
        variantRepository.deleteById(id);
    }

    @Transactional
    @Override
    public void updateStock(Long variantId, Integer quantity) {
        ProductVariant v = variantRepository.findById(variantId).orElseThrow();
        v.setStockQuantity(quantity);
        variantRepository.save(v);
    }
}
