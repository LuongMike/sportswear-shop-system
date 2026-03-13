package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.configuration.PaymentConfig;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@Tag(name = "Payment", description = "VNPay Integration")
public class PaymentController {
    private final PaymentService paymentService;
    private final OrderRepository orderRepository;
    private final PaymentConfig paymentConfig;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @GetMapping("/create_payment/{orderId}")
    @Operation(summary = "Generate VNPay URL")
    public ResponseEntity<PaymentResponse> createPayment(HttpServletRequest request, @PathVariable Long orderId) {
        return ResponseEntity.ok(paymentService.createVnPayPayment(request, orderId));
    }

    @GetMapping("/vnpay_return")
    @Transactional
    @Operation(summary = "VNPay Callback URL (Do not call manually)")
    public void vnpayReturn(HttpServletRequest request, HttpServletResponse response) throws IOException {
// BƯỚC 1: Lấy toàn bộ tham số trả về từ VNPay
        Map<String, String> fields = new HashMap<>();
        for (Enumeration<String> params = request.getParameterNames(); params.hasMoreElements(); ) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                fields.put(fieldName, fieldValue);
            }
        }

        // BƯỚC 2: Tách lấy mã Hash gốc của VNPay và loại bỏ khỏi Map để chuẩn bị tính toán lại
        String vnp_SecureHash = request.getParameter("vnp_SecureHash");
        if (fields.containsKey("vnp_SecureHashType")) {
            fields.remove("vnp_SecureHashType");
        }
        if (fields.containsKey("vnp_SecureHash")) {
            fields.remove("vnp_SecureHash");
        }

        // BƯỚC 3: Sắp xếp các tham số theo thứ tự Alphabet và tạo chuỗi Hash Data
        List<String> fieldNames = new ArrayList<>(fields.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = fields.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    hashData.append('&');
                }
            }
        }

        // BƯỚC 4: Băm chuỗi dữ liệu bằng Secret Key của hệ thống
        String signValue = PaymentConfig.hmacSHA512(paymentConfig.getVnp_HashSecret(), hashData.toString());

        String vnp_TxnRef = request.getParameter("vnp_TxnRef");
        String vnp_ResponseCode = request.getParameter("vnp_ResponseCode");

        // BƯỚC 5: KIỂM TRA BẢO MẬT (So sánh Hash tự tính và Hash VNPay gửi về)
        if (signValue.equals(vnp_SecureHash)) {
            // Chữ ký hợp lệ -> Xử lý nghiệp vụ đơn hàng
            if (vnp_TxnRef != null) {
                Long orderId = Long.parseLong(vnp_TxnRef);
                Order order = orderRepository.findById(orderId).orElse(null);

                if (order != null) {
                    if ("00".equals(vnp_ResponseCode)) {
                        // Thanh toán thành công -> Cập nhật trạng thái
                        order.setStatus(OrderStatus.PAID);
                        orderRepository.save(order);

                        // Redirect về trang Frontend "Thành công"
                        response.sendRedirect(frontendUrl + "/payment-success?orderId=" + orderId);
                    } else {
                        // Thanh toán thất bại hoặc khách hàng tự hủy
                        order.setStatus(OrderStatus.CANCELLED);

                        // FIX LỖI 2 (INVENTORY LEAK): Hoàn lại số lượng vào kho ngay lập tức
                        order.getOrderItems().forEach(item -> {
                            item.getVariant().setStockQuantity(item.getVariant().getStockQuantity() + item.getQuantity());
                        });

                        orderRepository.save(order);

                        // Redirect về trang Frontend "Thất bại"
                        response.sendRedirect(frontendUrl + "/payment-failed?orderId=" + orderId);
                    }
                }
            }
        } else {
            // CÓ DẤU HIỆU GIẢ MẠO DỮ LIỆU HOẶC URL
            // Chữ ký không khớp, tuyệt đối không cập nhật Database
            response.sendRedirect(frontendUrl + "/payment-failed?error=invalid_signature");
        }
    }
}
