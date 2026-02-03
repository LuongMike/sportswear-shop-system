package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.response.PaymentResponse;
import com.team6.ecommercesystem.model.Order;
import com.team6.ecommercesystem.model.enums.OrderStatus;
import com.team6.ecommercesystem.repository.OrderRepository;
import com.team6.ecommercesystem.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "VNPay Integration")
public class PaymentController {
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;

    @GetMapping("/create_payment/{orderId}")
    @Operation(summary = "Generate VNPay URL")
    public ResponseEntity<PaymentResponse> createPayment(HttpServletRequest request, @PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.createVnPayPayment(request, orderId));
    }

    @GetMapping("/vnpay_return")
    @Transactional
    @Operation(summary = "VNPay Callback URL (Do not call manually)")
    public void vnpayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");
        String vnp_TxnRef = request.getParameter("vnp_TxnRef"); // Order ID

        if (vnp_TxnRef != null) {
            Long orderId = Long.parseLong(vnp_TxnRef);
            Order order = orderRepository.findById(orderId).orElse(null);

            if (order != null) {
                if ("00".equals(vnp_ResponseCode)) {
                    // Thanh toán thành công -> Cập nhật trạng thái
                    order.setStatus(OrderStatus.PAID);
                    orderRepository.save(order);

                    // Redirect về trang Frontend "Thành công"
                    response.sendRedirect("http://localhost:3000/payment-success?orderId=" + orderId);
                } else {
                    // Thanh toán thất bại
                    order.setStatus(OrderStatus.CANCELLED); // Hoặc giữ Pending tùy logic
                    orderRepository.save(order);

                    // Redirect về trang Frontend "Thất bại"
                    response.sendRedirect("http://localhost:3000/payment-failed?orderId=" + orderId);
                }
            }
        }
    }
}
