package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.CollectionRequest;
import com.team6.ecommercesystem.dto.response.CollectionResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CollectionService {
    CollectionResponse createCollection(CollectionRequest request);
    Page<CollectionResponse> getAllCollections(int page, int size, String sortBy, String sortDir, String keyword);
    CollectionResponse getCollectionBySlug(String slug);
    void deleteCollection(Long id);
}
