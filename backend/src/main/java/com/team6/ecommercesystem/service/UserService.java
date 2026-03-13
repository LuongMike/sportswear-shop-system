package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.ProfileUpdateRequest;
import com.team6.ecommercesystem.dto.request.RegisterRequest;
import com.team6.ecommercesystem.dto.request.UserRequest;
import com.team6.ecommercesystem.dto.request.UserUpdateRequest;
import com.team6.ecommercesystem.dto.response.UserDetailResponse;
import com.team6.ecommercesystem.dto.response.UserResponse;
import com.team6.ecommercesystem.dto.response.UserSummaryResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    Page<UserSummaryResponse> getAllUsers(int page, int size, String sortBy, String sortDir, String keyword);
    UserDetailResponse getUserDetail(Long id);
    UserDetailResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
    UserDetailResponse getMyProfile();
    UserDetailResponse updateMyProfile(ProfileUpdateRequest request);
}
