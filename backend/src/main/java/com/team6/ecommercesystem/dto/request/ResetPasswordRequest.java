package com.team6.ecommercesystem.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
    private String confirmPassword;
}
