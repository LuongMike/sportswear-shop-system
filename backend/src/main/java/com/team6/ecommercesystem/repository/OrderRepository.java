package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.Order;
import com.team6.ecommercesystem.model.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    // Tính tổng doanh thu (chỉ tính đơn COMPLETED)
    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status = 'COMPLETED' AND o.orderDate >= :startDate AND o.orderDate <= :endDate")
    BigDecimal sumRevenueByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Đếm tổng số đơn hàng
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderDate >= :startDate AND o.orderDate <= :endDate")
    Long countOrdersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    // Đếm số đơn đang chờ xử lý (PENDING)
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 'PENDING' AND o.orderDate >= :startDate AND o.orderDate <= :endDate")
    Long countPendingOrders(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM Order o WHERE o.status = :status AND o.paymentMethod != 'COD' AND o.orderDate < :cutoffTime")
    List<Order> findStuckOnlineOrders(@Param("status") OrderStatus status, @Param("cutoffTime") LocalDateTime cutoffTime);
}
