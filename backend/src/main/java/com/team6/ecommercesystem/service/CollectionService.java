package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.CollectionRequest;
import com.team6.ecommercesystem.dto.response.CollectionResponse;

import java.util.List;

public interface CollectionService {
    CollectionResponse createCollection(CollectionRequest request);
    List<CollectionResponse> getAllCollections();
    CollectionResponse getCollectionBySlug(String slug);
    void deleteCollection(Long id);
}
