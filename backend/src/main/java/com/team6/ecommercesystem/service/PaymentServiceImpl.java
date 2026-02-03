package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.configuration.PaymentConfig;
import com.team6.ecommercesystem.dto.response.PaymentResponse;
import com.team6.ecommercesystem.model.Order;
import com.team6.ecommercesystem.repository.OrderRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentConfig paymentConfig;
    private final OrderRepository orderRepository;

    @Override
    public PaymentResponse createVnPayPayment(HttpServletRequest request, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Số tiền cần nhân với 100 (VNPay quy định)
        long amount = (long) (order.getTotalAmount() * 100);

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", paymentConfig.getVnp_Version());
        vnp_Params.put("vnp_Command", paymentConfig.getVnp_Command());
        vnp_Params.put("vnp_TmnCode", paymentConfig.getVnp_TmnCode());
        vnp_Params.put("vnp_Amount", String.valueOf(amount));
        vnp_Params.put("vnp_CurrCode", "VND");
        vnp_Params.put("vnp_TxnRef", String.valueOf(orderId)); // Mã đơn hàng
        vnp_Params.put("vnp_OrderInfo", "Thanh toan don hang #" + orderId);
        vnp_Params.put("vnp_OrderType", "other");
        vnp_Params.put("vnp_Locale", "vn");
        vnp_Params.put("vnp_ReturnUrl", paymentConfig.getVnp_ReturnUrl());
        vnp_Params.put("vnp_IpAddr", getIpAddress(request));

        // Thời gian tạo
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        // Thời gian hết hạn (15 phút)
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        // Tạo chuỗi hash và URL
        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        Iterator<String> itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = itr.next();
            String fieldValue = vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data
                hashData.append(fieldName);
                hashData.append('=');
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                // Build query
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII));
                query.append('=');
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII));
                if (itr.hasNext()) {
                    query.append('&');
                    hashData.append('&');
                }
            }
        }

        String queryUrl = query.toString();
        String vnp_SecureHash = PaymentConfig.hmacSHA512(paymentConfig.getVnp_HashSecret(), hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return PaymentResponse.builder()
                .status("OK")
                .message("Successfully generated payment URL")
                .paymentUrl(paymentConfig.getVnp_PayUrl() + "?" + queryUrl)
                .build();
    }

    // Helper lấy IP
    private String getIpAddress(HttpServletRequest request) {
        String ipAdress;
        try {
            ipAdress = request.getHeader("X-FORWARDED-FOR");
            if (ipAdress == null) {
                ipAdress = request.getRemoteAddr();
            }
        } catch (Exception e) {
            ipAdress = "Invalid IP:" + e.getMessage();
        }
        return ipAdress;
    }
}
