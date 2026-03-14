package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.dto.request.SendMessageRequest;
import com.team6.ecommercesystem.model.ChatMessage;
import com.team6.ecommercesystem.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @PostMapping("/rooms/{roomId}/messages")
    public List<ChatMessage> sendMessage(
            @PathVariable Long roomId,
            @RequestBody SendMessageRequest request
    ) {
        return chatMessageService.sendMessage(roomId, request);
    }
}
