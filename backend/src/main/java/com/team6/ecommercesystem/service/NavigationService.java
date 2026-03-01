package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.response.NavigationCategoryDTO;
import com.team6.ecommercesystem.model.Category;
import com.team6.ecommercesystem.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NavigationService {

    private final CategoryRepository categoryRepository;

    public List<NavigationCategoryDTO> getMainNavigation() {
        List<Category> rootCategories = categoryRepository.findByParentIsNull();

        return rootCategories.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private NavigationCategoryDTO convertToDTO(Category category) {
        return new NavigationCategoryDTO(
                category.getId(),
                category.getCategoryName(),
                category.getChildren() != null
                        ? category.getChildren()
                        .stream()
                        .map(this::convertToDTO)
                        .collect(Collectors.toList())
                        : List.of()
        );
    }
}