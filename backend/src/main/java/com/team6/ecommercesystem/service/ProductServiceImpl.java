package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ProductRequest;
import com.team6.ecommercesystem.dto.request.VariantRequest;
import com.team6.ecommercesystem.dto.response.BrandResponse;
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

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
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

        Long categoryId = categoryRepository.findIdByCategoryName(request.getCategoryName());
        Long brandId = brandRepository.findIdByBrandName(request.getBrandName());
        Long sportId = sportRepository.findIdBySportName(request.getSportName());

        Product product = Product.builder()
                .productName(request.getProductName())
                .description(request.getDescription())
                .category(
                        categoryRepository.findById(categoryId)
                                .orElseThrow(() ->
                                        new NoSuchElementException("Không tìm thấy Category với ID: " + categoryId)
                                )
                )
                .brand(
                        brandRepository.findById(brandId)
                                .orElseThrow(() ->
                                        new NoSuchElementException("Không tìm thấy Brand với ID: " + brandId)
                                )
                )
                .sport(
                        sportRepository.findById(sportId)
                                .orElseThrow(() ->
                                        new NoSuchElementException("Không tìm thấy Sport với ID: " + sportId)
                                )
                )
                .build();

        Set<ProductVariant> variants = request.getVariants().stream().map(vReq -> {

            String sku = (vReq.getSku() == null || vReq.getSku().isBlank())
                    ? SkuGenerator.generateSku(
                    product.getProductName(),
                    vReq.getColor(),
                    vReq.getSize())
                    : vReq.getSku();

            ProductVariant variant = ProductVariant.builder()
                    .sku(sku)
                    .size(vReq.getSize())
                    .color(vReq.getColor())
                    .price(vReq.getPrice())
                    .stockQuantity(vReq.getStockQuantity())
                    .product(product)
                    .build();

            if (vReq.getImageUrls() != null && !vReq.getImageUrls().isEmpty()) {

                Set<ProductImage> images = new HashSet<>();

                for (int i = 0; i < vReq.getImageUrls().size(); i++) {
                    images.add(
                            ProductImage.builder()
                                    .imageUrl(vReq.getImageUrls().get(i))
                                    .variant(variant)
                                    .isPrimary(i == 0)
                                    .build()
                    );
                }

                variant.setImages(images);
            }

            return variant;

        }).collect(Collectors.toSet());

        product.setVariants(variants);

        Product saved = productRepository.save(product);

        return ProductMapper.toDetailDto(saved);
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

        Long categoryId = categoryRepository.findIdByCategoryName(request.getCategoryName());
        Long brandId = brandRepository.findIdByBrandName(request.getBrandName());
        Long sportId = sportRepository.findIdBySportName(request.getSportName());

        Product p = productRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy product"));

        // ===== Update product info =====
        p.setProductName(request.getProductName());
        p.setDescription(request.getDescription());

        p.setCategory(categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy Category với ID: " + categoryId)));

        p.setBrand(brandRepository.findById(brandId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy Brand với ID: " + brandId)));

        p.setSport(sportRepository.findById(sportId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy Sport với ID: " + sportId)));

        // ===== Clear variants cũ =====
        p.getVariants().clear();

        // ===== Thêm lại variants mới =====
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {

            for (VariantRequest vReq : request.getVariants()) {

                String sku = (vReq.getSku() == null || vReq.getSku().isBlank())
                        ? SkuGenerator.generateSku(
                        p.getProductName(),
                        vReq.getColor(),
                        vReq.getSize())
                        : vReq.getSku();

                ProductVariant variant = ProductVariant.builder()
                        .sku(sku)
                        .size(vReq.getSize())
                        .color(vReq.getColor())
                        .price(vReq.getPrice())
                        .stockQuantity(vReq.getStockQuantity())
                        .product(p)
                        .build();

                // ===== Images =====
                if (vReq.getImageUrls() != null && !vReq.getImageUrls().isEmpty()) {

                    Set<ProductImage> images = new HashSet<>();

                    for (int i = 0; i < vReq.getImageUrls().size(); i++) {
                        images.add(
                                ProductImage.builder()
                                        .imageUrl(vReq.getImageUrls().get(i))
                                        .variant(variant)
                                        .isPrimary(i == 0)
                                        .build()
                        );
                    }

                    variant.setImages(images);
                }

                p.getVariants().add(variant);
            }
        }

        Product saved = productRepository.save(p);

        return ProductMapper.toSummaryDto(saved);
    }

    @Transactional
    @Override
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional
    @Override
    public VariantResponse addVariant(Long productId, VariantRequest request) {

        Product p = productRepository.findById(productId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy product"));

        String sku = SkuGenerator.generateSku(
                p.getProductName(),
                request.getColor(),
                request.getSize()
        );

        ProductVariant variant = ProductVariant.builder()
                .sku(sku)
                .size(request.getSize())
                .color(request.getColor())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .product(p)
                .build();

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {

            Set<ProductImage> images = new HashSet<>();

            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(
                        ProductImage.builder()
                                .imageUrl(request.getImageUrls().get(i))
                                .variant(variant)
                                .isPrimary(i == 0)
                                .build()
                );
            }

            variant.setImages(images);
        }

        ProductVariant saved = variantRepository.save(variant);

        return ProductMapper.toVariantDto(saved);
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

    @Transactional(readOnly = true)
    @Override
    public List<ProductSummaryResponse> filterProducts(
            Long categoryId,
            Long brandId,
            Long sportId
    ) {

        List<Product> products = productRepository
                .filterProducts(categoryId, brandId, sportId);

        return products.stream()
                .map(ProductMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<BrandResponse> getAllBrand(){
        List<Brand> brands = brandRepository.findAll();
        return brands.stream()
                .map(brand -> BrandResponse.builder()
                        .brandName(brand.getBrandName())
                        .brandBanner(brand.getBanner())
                        .slug(brand.getSlug())
                        .logo(brand.getLogo())
                        .isActive(brand.getIsActive())
                        .id(brand.getId())
                        .description(brand.getDescription())
                        .build())
                .toList();
    };
}
