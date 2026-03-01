package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.CreateBrandDTO;
import com.team6.ecommercesystem.dto.request.UpdateBrandDTO;
import com.team6.ecommercesystem.model.Brand;
import com.team6.ecommercesystem.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BrandService {

    private final BrandRepository brandRepository;

    public List<Brand> getAll() {
        return brandRepository.findAll();
    }

    public Brand create(CreateBrandDTO dto) {
        Brand brand = Brand.builder()
                .brandName(dto.getName())
                .slug(dto.getSlug())
                .logo(dto.getLogo())
                .description(dto.getDescription())
                .banner(dto.getBanner())
                .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
                .build();

        return brandRepository.save(brand);
    }

    public Brand update(Long id, UpdateBrandDTO dto) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Brand không tồn tại"));

        if (dto.getName() != null) brand.setBrandName(dto.getName());
        if (dto.getSlug() != null) brand.setSlug(dto.getSlug());
        if (dto.getLogo() != null) brand.setLogo(dto.getLogo());
        if (dto.getDescription() != null) brand.setDescription(dto.getDescription());
        if (dto.getBanner() != null) brand.setBanner(dto.getBanner());
        if (dto.getIsActive() != null) brand.setIsActive(dto.getIsActive());

        return brandRepository.save(brand);
    }

    public void delete(Long id) {
        brandRepository.deleteById(id);
    }
}