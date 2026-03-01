package com.team6.ecommercesystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private ChatRoom room;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String sender; // ADMIN | CUSTOMER

    private LocalDateTime sentAt;

    private String type; // TEXT | IMAGE | FILE

    private String fileUrl;
}