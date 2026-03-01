package com.team6.ecommercesystem.repository;

import com.team6.ecommercesystem.model.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findByCustomerName(String customerName);
}
