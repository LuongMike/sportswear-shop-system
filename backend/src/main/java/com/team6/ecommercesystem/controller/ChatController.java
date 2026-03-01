package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.request.ChatRequest;
import com.team6.ecommercesystem.dto.response.ChatResponse;
import com.team6.ecommercesystem.service.ChatBotService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatBotService chatBotService;

    @PostMapping("/send")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        // 1. Lấy lịch sử từ Request do Frontend gửi lên
        List<String> history = request.getHistory();
        if (history == null) {
            history = new ArrayList<>();
        }

        // 2. Gọi Service với lịch sử hiện tại
        ChatResponse response = chatBotService.generateResponse(request.getMessage(), history);

        // Chú ý: Backend chỉ xử lý và trả về câu trả lời.
        // Frontend sẽ tự có trách nhiệm nối (push) câu hỏi và câu trả lời mới vào mảng history ở dưới local.
        return ResponseEntity.ok(response);
    }
}
