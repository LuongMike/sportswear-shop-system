package com.team6.ecommercesystem.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_addresses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String recipientName; // Tên người nhận

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private String city;     // Tỉnh/Thành phố

    @Column(nullable = false)
    private String district; // Quận/Huyện

    @Column(nullable = false)
    private String ward;     // Phường/Xã

    @Column(nullable = false)
    private String street;   // Số nhà, tên đường

    @Column(name = "is_default")
    private Boolean isDefault; // Địa chỉ mặc định

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
