package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.CollectionRequest;
import com.team6.ecommercesystem.dto.response.CollectionResponse;
import com.team6.ecommercesystem.model.Collection;
import com.team6.ecommercesystem.model.CollectionProduct;
import com.team6.ecommercesystem.model.ProductVariant;
import com.team6.ecommercesystem.repository.CollectionRepository;
import com.team6.ecommercesystem.repository.ProductVariantRepository;
import com.team6.ecommercesystem.utils.CollectionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CollectionServiceImpl implements CollectionService {
    private final CollectionRepository collectionRepository;
    private final ProductVariantRepository variantRepository;

    @Override
    public CollectionResponse createCollection(CollectionRequest request) {
        Collection collection = Collection.builder()
                .name(request.getName()).slug(request.getSlug())
                .description(request.getDescription()).imageUrl(request.getImageUrl())
                .type(request.getType()).isActive(request.getIsActive())
                .startDate(request.getStartDate()).endDate(request.getEndDate())
                .build();

        if (request.getVariantIds() != null) {
            List<CollectionProduct> items = request.getVariantIds().stream().map(vId -> {
                ProductVariant variant = variantRepository.findById(vId)
                        .orElseThrow(() -> new RuntimeException("Variant not found"));
                return CollectionProduct.builder()
                        .collection(collection).variant(variant).sortOrder(0).build();
            }).collect(Collectors.toList());
            collection.setCollectionProducts(items);
        }

        return CollectionMapper.toResponse(collectionRepository.save(collection));    }

    @Override
    @Transactional(readOnly = true)
    public Page<CollectionResponse> getAllCollections(int page, int size, String sortBy, String sortDir, String keyword) {
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name())
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Collection> collections = collectionRepository.searchCollections(keyword, pageable);

        return collections.map(CollectionMapper::toResponse);
    }


    @Override
    public CollectionResponse getCollectionBySlug(String slug) {
        Collection collection = collectionRepository.findBySlug(slug)
                .orElseThrow(() -> new NoSuchElementException("Not found product with slug: " + slug));

        return CollectionMapper.toResponse(collection);    }

    @Override
    public void deleteCollection(Long id) {
        collectionRepository.deleteById(id);
    }
}
