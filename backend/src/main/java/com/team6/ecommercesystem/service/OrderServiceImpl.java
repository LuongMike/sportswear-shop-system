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
import org.springframework.stereotype.Service;import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User currentUser = getCurrentUser();
        String roleCode = currentUser.getRole().getRoleCode();

        OrderStatus currentStatus = order.getStatus();
        PaymentMethod paymentMethod = order.getPaymentMethod();

        // --- KIỂM TRA QUYỀN VÀ LUỒNG TRẠNG THÁI ---
        if (roleCode.equals("SHIPPER")){
            boolean isValidTransition = false;

            // 1. Lấy hàng đi giao
            if (newStatus == OrderStatus.SHIPPED) {
                if (paymentMethod == PaymentMethod.COD && currentStatus == OrderStatus.PENDING) isValidTransition = true;
                if (paymentMethod != PaymentMethod.COD && currentStatus == OrderStatus.PAID) isValidTransition = true;
            }
            // 2. Giao thành công hoặc thất bại
            else if (currentStatus == OrderStatus.SHIPPED &&
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

        // --- FIX LỖI 2: HOÀN LẠI KHO NẾU ĐƠN BỊ HỦY ---
        // Nếu người dùng/admin/shipper chuyển trạng thái thành CANCELLED và đơn này trước đó chưa hủy
        if (newStatus == OrderStatus.CANCELLED && currentStatus != OrderStatus.CANCELLED) {
            order.getOrderItems().forEach(item -> {
                ProductVariant variant = item.getVariant();
                // Cộng lại số lượng lúc khách đặt trả về kho
                variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
                variantRepository.save(variant);
            });
        }
        // Cập nhật và lưu
        order.setStatus(newStatus);
        return OrderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    public OrderResponse confirmDelivery(Long orderId, boolean isReceived) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));

        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Bạn không có quyền thao tác trên đơn hàng này");
        }

        if (order.getStatus() != OrderStatus.SHIPPED && order.getStatus() != OrderStatus.DELIVERED) {
            throw new RuntimeException("Chỉ có thể xác nhận khi đơn hàng đang giao hoặc đã giao xong");
        }

        if (isReceived) {
            // Trường hợp 1: Khách báo ĐÃ NHẬN HÀNG -> Chuyển sang COMPLETED (Hoàn tất)
            order.setStatus(OrderStatus.COMPLETED);
        } else {
            // Trường hợp 2: Khách báo CHƯA NHẬN HÀNG (Có thể Shipper bấm nhầm)
            String currentNote = order.getNote() != null ? order.getNote() : "";
            order.setNote(currentNote + "\n[CẢNH BÁO TỪ KHÁCH: Xác nhận CHƯA nhận được hàng vào lúc " + LocalDateTime.now() + "]");

            // Nếu đơn đang là DELIVERED, trả lại về SHIPPED để xử lý tiếp
            if (order.getStatus() == OrderStatus.DELIVERED) {
                order.setStatus(OrderStatus.SHIPPED);
            }
        }

        return OrderMapper.toResponse(orderRepository.save(order));
    }
}
