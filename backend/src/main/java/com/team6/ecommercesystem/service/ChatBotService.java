package com.team6.ecommercesystem.service;

import com.team6.ecommercesystem.dto.response.ChatResponse;
import com.team6.ecommercesystem.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatBotService {
    private final ProductRepository productRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String geminiUrl;

    public ChatResponse generateResponse(String userMessage, List<String> history) {
        try {
            String productContext = productRepository.findAll().stream()
                    .limit(20)
                    .map(p -> String.format("- %s: %s", p.getProductName(), p.getDescription()))
                    .collect(Collectors.joining("\n"));

            String historyContext = String.join("\n", history);

            String fullPrompt = String.format("""
                Bạn là chuyên gia tư vấn của 'Sport Swear Shop'. 
                Hãy dùng danh sách sản phẩm sau:
                %s
                
                Lịch sử trò chuyện gần đây:
                %s
                
                Câu hỏi mới nhất: %s
                """, productContext, historyContext, userMessage);

            String aiResult = callGeminiApi(fullPrompt);

            return ChatResponse.builder()
                    .response(aiResult)
                    .status("SUCCESS")
                    .build();

        } catch (Exception e) {
            log.error("ChatBot Error: {}", e.getMessage());
            return ChatResponse.builder()
                    .response("Rất tiếc, hệ thống tư vấn đang bận xử lý. Bạn vui lòng thử lại sau hoặc xem sản phẩm trực tiếp tại cửa hàng nhé!")
                    .status("ERROR")
                    .build();
        }
    }

    private String callGeminiApi(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt))))
        );

        String url = UriComponentsBuilder.fromHttpUrl(geminiUrl)
                .queryParam("key", apiKey)
                .toUriString();

        try {
            Map<?, ?> response = webClientBuilder.build()
                    .post()
                    .uri(url)
                    .bodyValue(requestBody)
                    .retrieve()
                    .onStatus(status -> status.isError(), clientResponse ->
                            clientResponse.bodyToMono(String.class).flatMap(errorBody -> {
                                log.error("Gemini API error ({}): {}", clientResponse.statusCode(), errorBody);
                                return Mono.error(new RuntimeException("Gemini API returned an error"));
                            })
                    )
                    .bodyToMono(Map.class)
                    .block();

            return extractTextFromResponse(response);

        } catch (Exception e) {
            throw new RuntimeException("AI Service communication failed: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<?, ?> response) {
        if (response != null && response.get("candidates") instanceof List<?> candidates) {
            if (!candidates.isEmpty()) {
                Map<String, Object> firstCandidate = (Map<String, Object>) candidates.get(0);
                Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                return parts.get(0).get("text").toString();
            }
        }
        return "Tôi không tìm thấy thông tin phù hợp, bạn vui lòng hỏi lại rõ hơn nhé.";
    }
}
