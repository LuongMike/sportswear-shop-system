package com.team6.ecommercesystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "collections")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Collection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private String type;
    private Boolean isActive;
    private LocalDate startDate;
    private LocalDate endDate;

    @OneToMany(mappedBy = "collection", cascade = CascadeType.ALL)
    private List<CollectionProduct> collectionProducts;
}
