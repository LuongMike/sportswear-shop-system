package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.RegisterRequest;
import com.team6.ecommercesystem.dto.request.UserRequest;
import com.team6.ecommercesystem.dto.request.UserUpdateRequest;
import com.team6.ecommercesystem.dto.response.UserDetailResponse;
import com.team6.ecommercesystem.dto.response.UserResponse;
import com.team6.ecommercesystem.dto.response.UserSummaryResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserRequest request);
    List<UserSummaryResponse> getAllUsers();
    UserDetailResponse getUserDetail(Long id);
    UserDetailResponse updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);

}
