package com.team6.ecommercesystem.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResponse {
    private Long id;
    private String recipientName;
    private String phoneNumber;
    private String city;
    private String district;
    private String ward;
    private String street;
    private Boolean isDefault;
    private String fullAddress;
}
