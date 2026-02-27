package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.request.ProfileUpdateRequest;
import com.team6.ecommercesystem.dto.response.UserDetailResponse;
import com.team6.ecommercesystem.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user/profile")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "APIs dành cho khách hàng tự quản lý profile")
public class UserProfileController {
    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin cá nhân", description = "Dùng Token để lấy thông tin chi tiết của user đang đăng nhập")
    public ResponseEntity<UserDetailResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/me")
    @Operation(summary = "Cập nhật thông tin cá nhân", description = "Khách hàng tự đổi tên, số điện thoại")
    public ResponseEntity<UserDetailResponse> updateMyProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(userService.updateMyProfile(request));
    }
}
