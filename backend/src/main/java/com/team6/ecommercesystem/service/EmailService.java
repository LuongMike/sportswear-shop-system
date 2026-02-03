package com.team6.ecommercesystem.service;

public interface EmailService {
    void sendPasswordResetEmail(String to, String token);
}
