package com.team6.ecommercesystem.model;

import com.team6.ecommercesystem.model.enums.OrderStatus;
import com.team6.ecommercesystem.model.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime orderDate;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Double totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    // --- SNAPSHOT ĐỊA CHỈ (Lưu cứng tại thời điểm mua) ---
    private String recipientName;
    private String phoneNumber;
    private String shippingAddress; // Ghép full chuỗi: Số nhà, Phường, Quận, Tỉnh

    private String note; // Ghi chú của khách hàng

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();
}
