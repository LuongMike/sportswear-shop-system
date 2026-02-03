package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.OrderCreationRequest;
import com.team6.ecommercesystem.dto.response.OrderResponse;
import com.team6.ecommercesystem.model.*;
import com.team6.ecommercesystem.model.enums.OrderStatus;
import com.team6.ecommercesystem.repository.*;
import com.team6.ecommercesystem.utils.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements  OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserAddressRepository addressRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;

    @Override
    public User getCurrentUser() {
        try {
            String userIdStr = SecurityContextHolder.getContext().getAuthentication().getName();
            Long userId = Long.parseLong(userIdStr);
            return userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));
        } catch (NumberFormatException e) {
            throw new RuntimeException("Invalid User ID");
        }    }

    @Override
    public OrderResponse createOrder(OrderCreationRequest request) {
        User user = getCurrentUser();

        // 1. Lấy giỏ hàng
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Giỏ hàng trống"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng không có sản phẩm nào để thanh toán");
        }

        // 2. Lấy địa chỉ giao hàng (Validate xem có phải của user này không)
        UserAddress address = addressRepository.findByIdAndUserId(request.getAddressId(), user.getId());
        if (address == null) throw new RuntimeException("Địa chỉ giao hàng không hợp lệ");

        // 3. Khởi tạo Order
        Order order = Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING) // Mặc định là Chờ xử lý
                .paymentMethod(request.getPaymentMethod())
                .note(request.getNote())
                .recipientName(address.getRecipientName())
                .phoneNumber(address.getPhoneNumber())
                // Snapshot địa chỉ full text
                .shippingAddress(String.format("%s, %s, %s, %s",
                        address.getStreet(), address.getWard(), address.getDistrict(), address.getCity()))
                .build();

        // 4. Xử lý từng Item: Check kho -> Trừ kho -> Tạo OrderItem
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0;

        for (CartItem cartItem : cart.getItems()) {
            ProductVariant variant = cartItem.getVariant();

            // Check tồn kho (Concurrency check cơ bản)
            if (variant.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + variant.getProduct().getProductName() + " không đủ số lượng tồn kho.");
            }

            // Trừ kho
            variant.setStockQuantity(variant.getStockQuantity() - cartItem.getQuantity());
            variantRepository.save(variant);

            // Tạo OrderItem
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(cartItem.getQuantity())
                    .price(variant.getPrice()) // Lưu giá tại thời điểm mua
                    .build();

            orderItems.add(orderItem);
            totalAmount += orderItem.getPrice() * orderItem.getQuantity();
        }

        // 5. Hoàn tất Order
        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // 6. Xóa sạch giỏ hàng sau khi đặt thành công
        cart.getItems().clear();
        cartRepository.save(cart);

        return OrderMapper.toResponse(savedOrder);
    }

    @Override
    public List<OrderResponse> getMyOrders() {
        User user = getCurrentUser();
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId()).stream()
                .map(OrderMapper::toResponse)
                .collect(Collectors.toList());
    }
}
