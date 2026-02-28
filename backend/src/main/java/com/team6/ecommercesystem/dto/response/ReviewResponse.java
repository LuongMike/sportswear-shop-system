package com.team6.ecommercesystem.dto.response;

public record ReviewResponse(Long id, String userName, int rating, String comment, java.time.LocalDateTime date) {

}
