package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.request.CollectionRequest;
import com.team6.ecommercesystem.dto.response.CollectionResponse;
import com.team6.ecommercesystem.service.CollectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {
    private final CollectionService collectionService;

    @PostMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CollectionResponse> create(@RequestBody CollectionRequest request) {
        return ResponseEntity.ok(collectionService.createCollection(request));
    }

    @GetMapping
    public ResponseEntity<Page<CollectionResponse>> getAllCollections(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String keyword
    ) {
        return ResponseEntity.ok(collectionService.getAllCollections(page, size, sortBy, sortDir, keyword));
    }

    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
    }
}
