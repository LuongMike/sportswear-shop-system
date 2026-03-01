package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.request.SendMessageRequest;
import com.team6.ecommercesystem.model.ChatMessage;
import com.team6.ecommercesystem.model.ChatRoom;
import com.team6.ecommercesystem.model.enums.ChatRoomType;
import com.team6.ecommercesystem.repository.ChatMessageRepository;
import com.team6.ecommercesystem.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatBotService chatBotService;

    public List<ChatMessage> sendMessage(Long roomId, SendMessageRequest request) {

        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room không tồn tại"));

        // 1️⃣ Lưu tin nhắn customer/admin
        ChatMessage message = ChatMessage.builder()
                .room(room)
                .content(request.getContent())
                .sender(request.getSender())
                .sentAt(LocalDateTime.now())
                .type("TEXT")
                .build();

        chatMessageRepository.save(message);

        // 2️⃣ Nếu là AI room và sender là CUSTOMER → gọi AI
        if (room.getType() == ChatRoomType.AI_SUPPORT
                && request.getSender().equals("CUSTOMER")) {

            // Lấy lịch sử message
            List<String> history = chatMessageRepository
                    .findByRoomIdOrderBySentAtAsc(roomId)
                    .stream()
                    .map(ChatMessage::getContent)
                    .toList();

            String aiReply = chatBotService
                    .generateResponse(request.getContent(), history)
                    .getResponse();

            ChatMessage aiMessage = ChatMessage.builder()
                    .room(room)
                    .content(aiReply)
                    .sender("ADMIN")
                    .sentAt(LocalDateTime.now())
                    .type("TEXT")
                    .build();

            chatMessageRepository.save(aiMessage);
        }

        // 3️⃣ Trả về toàn bộ messages
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId);
    }
}
