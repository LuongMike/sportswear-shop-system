package com.team6.ecommercesystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String categoryName;

    private String description;

    // ===== Self reference =====

    // Nhiều category con -> 1 parent
    @ManyToOne
    @JoinColumn(name = "parent_id")
    private Category parent;

    // 1 parent -> nhiều category con
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Category> children;

    // ===== Quan hệ với Product =====
    @OneToMany(mappedBy = "category")
    private List<Product> products;
}