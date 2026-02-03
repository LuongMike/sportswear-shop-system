package com.team6.ecommercesystem.service;

import com.nimbusds.jose.JOSEException;
import com.team6.ecommercesystem.dto.request.ChangePasswordRequest;
import com.team6.ecommercesystem.dto.request.ForgotPasswordRequest;
import com.team6.ecommercesystem.dto.request.LoginRequest;
import com.team6.ecommercesystem.dto.request.ResetPasswordRequest;
import com.team6.ecommercesystem.dto.response.LoginResponse;

import java.text.ParseException;

public interface AuthenticationService {
    void logout(String token) throws ParseException;
    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(String refreshToken) throws ParseException, JOSEException;
    void changePassword(Long userId, ChangePasswordRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
}

