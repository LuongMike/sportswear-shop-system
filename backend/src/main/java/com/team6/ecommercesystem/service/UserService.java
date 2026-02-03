package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.UserRequest;
import com.team6.ecommercesystem.dto.response.UserResponse;

public interface UserService {
    UserResponse createUser(UserRequest request);
}
