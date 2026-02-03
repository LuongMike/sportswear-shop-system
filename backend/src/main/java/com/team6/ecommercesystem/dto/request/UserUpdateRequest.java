package com.team6.ecommercesystem.dto.request;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String phoneNumber;
    private String roleCode; // Ví dụ: "ADMIN", "USER", "STAFF"
    private Boolean status;  // Admin có thể Active/Deactivate tài khoản
}
