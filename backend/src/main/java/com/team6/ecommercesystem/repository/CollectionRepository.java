package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    Optional<Collection> findBySlug(String slug);

    @Query("SELECT c FROM Collection c WHERE " +
            "(:keyword IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Collection> searchCollections(@Param("keyword") String keyword, Pageable pageable);
}
