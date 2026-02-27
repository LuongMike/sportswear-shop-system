package com.team6.ecommercesystem.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequest {
    private String message;
    private List<String> history;
}
