package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.response.DashboardReportResponse;
import com.team6.ecommercesystem.repository.OrderRepository;
import com.team6.ecommercesystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DashboardReportResponse getDashboardReport(LocalDateTime startDate, LocalDateTime endDate) {
        // 1. Validate parameters
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("Ngày bắt đầu và ngày kết thúc không được để trống");
        }
        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("Ngày bắt đầu không được lớn hơn ngày kết thúc");
        }

        // 2. Query and aggregate data
        BigDecimal revenue = orderRepository.sumRevenueByDateRange(startDate, endDate);
        if (revenue == null) revenue = BigDecimal.ZERO; // Tránh lỗi null nếu không có đơn nào

        Long orders = orderRepository.countOrdersByDateRange(startDate, endDate);
        Long pending = orderRepository.countPendingOrders(startDate, endDate);
        Long users = userRepository.countNewUsers(startDate, endDate);

        // 3. Generate statistics
        return DashboardReportResponse.builder()
                .totalRevenue(revenue)
                .totalOrders(orders)
                .pendingOrders(pending)
                .newUsers(users)
                .build();
    }
}
