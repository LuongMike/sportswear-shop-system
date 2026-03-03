package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.CategoryRequest;
import com.team6.ecommercesystem.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse create(CategoryRequest request);

    CategoryResponse update(Long id, CategoryRequest request);

    CategoryResponse getById(Long id);

    void delete(Long id);

    List<CategoryResponse> getAll();
}
