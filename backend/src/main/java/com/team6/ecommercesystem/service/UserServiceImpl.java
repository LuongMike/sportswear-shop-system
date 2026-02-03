package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.RegisterRequest;
import com.team6.ecommercesystem.dto.request.UserRequest;
import com.team6.ecommercesystem.dto.request.UserUpdateRequest;
import com.team6.ecommercesystem.dto.response.UserDetailResponse;
import com.team6.ecommercesystem.dto.response.UserResponse;
import com.team6.ecommercesystem.dto.response.UserSummaryResponse;
import com.team6.ecommercesystem.model.Role;
import com.team6.ecommercesystem.model.User;
import com.team6.ecommercesystem.repository.RoleRepository;
import com.team6.ecommercesystem.repository.UserRepository;
import com.team6.ecommercesystem.repository.ValidRefreshTokenRepository;
import com.team6.ecommercesystem.utils.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final ValidRefreshTokenRepository validRefreshTokenRepository;


    @Override
    @Transactional
    public UserResponse createUser(UserRequest request) {
        validateNewUser(request.getEmail(), request.getPhoneNumber(), request.getPassword(), request.getConfirmPassword());

        Role role = roleRepository.findByRoleCode(request.getRoleCode())
                .orElseThrow(() -> new IllegalArgumentException("Role not found: " + request.getRoleCode()));

        User user = buildUser(request.getFullName(), request.getEmail(), request.getPhoneNumber(), request.getPassword(), role);
        return UserMapper.toUserResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSummaryResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserMapper::toSummaryDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetailResponse getUserDetail(Long id) {
        return UserMapper.toDetailDto(findUserById(id));
    }

    @Override
    @Transactional
    public UserDetailResponse updateUser(Long id, UserUpdateRequest request) {
        User user = findUserById(id);

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhoneNumber() != null) user.setPhoneNumber(request.getPhoneNumber());
        if (request.getStatus() != null) user.setStatus(request.getStatus());

        if (request.getRoleCode() != null) {
            Role role = roleRepository.findByRoleCode(request.getRoleCode())
                    .orElseThrow(() -> new IllegalArgumentException("Role not found: " + request.getRoleCode()));
            user.setRole(role);
        }

        return UserMapper.toDetailDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setStatus(false);
        userRepository.save(user);

        validRefreshTokenRepository.revokeAllByUser(user);
    }

    private void validateNewUser(String email, String phone, String password, String confirmPassword) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already exists: " + email);
        }
        if (phone != null && userRepository.existsByPhoneNumber(phone)) {
            throw new IllegalArgumentException("Phone number already exists: " + phone);
        }
        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException("Passwords do not match");
        }
    }

    private User buildUser(String fullName, String email, String phone, String password, Role role) {
        return User.builder()
                .fullName(fullName)
                .email(email)
                .phoneNumber(phone)
                .password(passwordEncoder.encode(password))
                .status(true)
                .role(role)
                .build();
    }

    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }
}