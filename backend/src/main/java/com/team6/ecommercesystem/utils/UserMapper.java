package com.team6.ecommercesystem.utils;

import com.team6.ecommercesystem.dto.response.UserDetailResponse;
import com.team6.ecommercesystem.dto.response.UserResponse;
import com.team6.ecommercesystem.dto.response.UserSummaryResponse;
import com.team6.ecommercesystem.model.User;

public class UserMapper {
    public static UserSummaryResponse toSummaryDto(User user) {
        return UserSummaryResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .roleName(user.getRole() != null ? user.getRole().getRoleName() : "N/A")
                .status(user.getStatus())
                .lastLoginDate(user.getLastLoginDate())
                .build();
    }

    public static UserDetailResponse toDetailDto(User user) {
        return UserDetailResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .roleName(user.getRole() != null ? user.getRole().getRoleName() : "N/A")
                .status(user.getStatus())
                .lastLoginDate(user.getLastLoginDate())
                .lastPasswordChangeDate(user.getLastPasswordChangeDate())
                .failedLoginAttempts(user.getFailedLoginAttempts())
                .lockTime(user.getLockTime())
                .build();
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .status(user.getStatus())
                .roleName(user.getRole() != null ? user.getRole().getRoleName() : "N/A")
                .build();
    }
}
