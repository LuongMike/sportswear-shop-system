package com.team6.ecommercesystem.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String roleName;
    private Boolean status; // True: Active, False: Banned
    private LocalDateTime lastLoginDate;
}
