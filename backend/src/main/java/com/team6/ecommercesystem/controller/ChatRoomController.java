package com.team6.ecommercesystem.controller;

import com.team6.ecommercesystem.model.ChatRoom;
import com.team6.ecommercesystem.service.ChatRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat/rooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @PostMapping
    public ChatRoom createRoom(@RequestBody Map<String, String> body) {
        String name = body.get("customerName");
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Customer name is required");
        }
        return chatRoomService.createRoom(name);
    }

    @GetMapping("/me")
    public List<ChatRoom> getMyRooms(@RequestParam(required = false) String customerName) {
        if (customerName == null) return new ArrayList<>(); // Tránh lỗi 500 nếu thiếu param
        return chatRoomService.getMyRooms(customerName);
    }

    @GetMapping("/admin/me")
    public List<ChatRoom> getAdminRooms() {
        return chatRoomService.getAllRooms();
    }
}
