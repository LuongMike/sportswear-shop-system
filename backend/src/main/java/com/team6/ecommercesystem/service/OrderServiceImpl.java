package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.OrderCreationRequest;
import com.team6.ecommercesystem.dto.response.OrderResponse;
import com.team6.ecommercesystem.model.*;
import com.team6.ecommercesystem.model.enums.OrderStatus;
import com.team6.ecommercesystem.model.enums.PaymentMethod;
import com.team6.ecommercesystem.repository.*;
import com.team6.ecommercesystem.utils.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
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
        BigDecimal totalAmount = BigDecimal.ZERO;

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

            // Tính: subTotal = price * quantity
            BigDecimal subTotal = orderItem.getPrice().multiply(new BigDecimal(orderItem.getQuantity()));
            // Tính: totalAmount = totalAmount + subTotal
            totalAmount = totalAmount.add(subTotal);        }

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

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(OrderMapper::toResponse)
                .toList();
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User currentUser = getCurrentUser();
        String roleCode = currentUser.getRole().getRoleCode();

        OrderStatus currentStatus = order.getStatus();
        PaymentMethod paymentMethod = order.getPaymentMethod();

        if (roleCode.equals("SHIPPER")){
            boolean isValidTransition = false;

            //1. Lấy hàng đi giao
            if (newStatus == OrderStatus.SHIPPING) {
                if (paymentMethod == PaymentMethod.COD && currentStatus == OrderStatus.PENDING) isValidTransition = true;
                if (paymentMethod != PaymentMethod.COD && currentStatus == OrderStatus.PAID) isValidTransition = true;
            }
            // 2. Giao thành công hoặc thất bại
            else if (currentStatus == OrderStatus.SHIPPING &&
                    (newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.CANCELLED)) {
                isValidTransition = true;
            }
            if (!isValidTransition) {
                throw new IllegalArgumentException("Shipper không được phép chuyển trạng thái từ " +
                        currentStatus + " sang " + newStatus + " cho đơn hàng " + paymentMethod);
            }
        } else if (!roleCode.equals("ADMIN")) {
            throw new RuntimeException("Bạn không có quyền cập nhật trạng thái đơn hàng");
        }
        // Cập nhật và lưu
        order.setStatus(newStatus);
        return OrderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse userUpdateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        User currentUser = getCurrentUser();
        OrderStatus currentStatus = order.getStatus();

        if (currentStatus != OrderStatus.DELIVERED) {
            throw new RuntimeException("Trạng thái đơn hàng hiện tại không cho phép cập nhật.");
        }

        if (status == OrderStatus.CANCELLED || status == OrderStatus.COMPLETED) {
            order.setStatus(status);
            orderRepository.save(order);
        } else {
            throw new RuntimeException("Trạng thái cập nhật không hợp lệ (Chỉ được phép Hủy hoặc Xác nhận đã nhận hàng)");
        }

        return OrderMapper.toResponse(orderRepository.save(order));
    }
}
