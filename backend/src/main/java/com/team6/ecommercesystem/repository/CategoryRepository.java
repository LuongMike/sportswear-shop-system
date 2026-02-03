package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
