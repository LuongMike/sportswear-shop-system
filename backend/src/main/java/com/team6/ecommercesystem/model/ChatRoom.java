package com.team6.ecommercesystem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.team6.ecommercesystem.model.enums.ChatRoomType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String adminName;

    private LocalDateTime lastMessageAt;

    private Boolean hasUnread = false;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<ChatMessage> messages;

    @Enumerated(EnumType.STRING)
    private ChatRoomType type;
}