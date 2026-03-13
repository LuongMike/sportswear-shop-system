package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.model.Order;
import com.team6.ecommercesystem.model.ProductVariant;
import com.team6.ecommercesystem.model.enums.OrderStatus;
import com.team6.ecommercesystem.repository.OrderRepository;
import com.team6.ecommercesystem.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class SystemCleanupTask {
    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;

    /**
     * Chạy tự động mỗi 15 phút (15 * 60 * 1000 = 900000 milliseconds)
     */
    @Scheduled(fixedRate = 900000)
    @Transactional // Đảm bảo tính toàn vẹn dữ liệu khi hoàn kho
    public void cancelStuckPendingOrders() {
        log.info("Bắt đầu quét và dọn dẹp các đơn hàng PENDING bị kẹt...");

        // Mốc thời gian: 30 phút trước so với hiện tại
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(30);

        // Tìm các đơn: Trạng thái PENDING + Không phải COD + Tạo trước mốc cutoffTime
        List<Order> stuckOrders = orderRepository.findStuckOnlineOrders(OrderStatus.PENDING, cutoffTime);

        if (stuckOrders.isEmpty()) {
            log.info("Không có đơn hàng nào bị kẹt.");
            return;
        }

        for (Order order : stuckOrders) {
            order.setStatus(OrderStatus.CANCELLED);
            order.setNote("Hệ thống tự động hủy do quá thời gian thanh toán Online (30 phút)");

            // Hoàn lại số lượng vào kho để người khác có thể mua
            order.getOrderItems().forEach(item -> {
                ProductVariant variant = item.getVariant();
                variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                variantRepository.save(variant);
            });

            log.info("Đã hủy tự động và hoàn kho cho đơn hàng ID: {}", order.getId());
        }

        orderRepository.saveAll(stuckOrders);
        log.info("Hoàn tất dọn dẹp {} đơn hàng bị kẹt.", stuckOrders.size());
    }
}
