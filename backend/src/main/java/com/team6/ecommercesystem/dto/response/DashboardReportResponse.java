package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class DashboardReportResponse {
    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long newUsers;
    private Long pendingOrders;
}
