package com.team6.ecommercesystem.dto.request;

import com.team6.ecommercesystem.model.enums.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderCreationRequest {
    @NotNull(message = "Vui lòng chọn địa chỉ giao hàng")
    private Long addressId;

    @NotNull(message = "Vui lòng chọn phương thức thanh toán")
    private PaymentMethod paymentMethod;

    private String note;
}
