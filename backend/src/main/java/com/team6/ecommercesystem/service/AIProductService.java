package com.team6.ecommercesystem.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.team6.ecommercesystem.dto.AIClassificationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AIProductService {
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String geminiUrl;

    public AIClassificationResult classifyProduct(String productName, String description) {
        // Xây dựng System Prompt với quy tắc nghiêm ngặt
        String systemInstruction = """
            Bạn là chuyên gia phân loại sản phẩm thể thao. Hãy phân tích Tên và Mô tả để trả về JSON.
            
            QUY TẮC PHÂN LOẠI:
            1. category: Chỉ chọn một trong [Áo, Quần, Giày, Phụ kiện, Thiết bị tập luyện].
            2. sportType: Chỉ chọn một trong [Gym, Yoga, Bóng đá, Chạy bộ, Cầu lông, Tennis, Basketball].
            3. targetGender: Chỉ chọn một trong [Nam, Nữ, Unisex].
            4. material: Trích xuất chất liệu vải chính (ví dụ: Dri-FIT, Cotton...).
            5. tags: Trích xuất 3-5 đặc điểm nổi bật nhất (ví dụ: Thoáng khí, Thấm hút mồ hôi...).

            YÊU CẦU: Chỉ trả về duy nhất chuỗi JSON. Không giải thích thêm.
            """;

        String userPrompt = String.format("Sản phẩm: %s\nMô tả: %s", productName, description);
        String fullPrompt = systemInstruction + "\n" + userPrompt;

        try {
            String rawResponse = callGeminiApi(systemInstruction + "\n" + userPrompt);

            String cleanJson = rawResponse;
            int firstBrace = rawResponse.indexOf("{");
            int lastBrace = rawResponse.lastIndexOf("}");
            if (firstBrace >= 0 && lastBrace > firstBrace) {
                cleanJson = rawResponse.substring(firstBrace, lastBrace + 1);
            }

            AIClassificationResult result = objectMapper.readValue(cleanJson, AIClassificationResult.class);
            result.setStatus("SUCCESS");
            return result;

        } catch (Exception e) {
            log.error("Lỗi phân loại AI: {}", e.getMessage());
            return AIClassificationResult.builder()
                    .status("FAILURE")
                    .tags(List.of())
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
                                log.error("AI Classification API error ({}): {}", clientResponse.statusCode(), errorBody);
                                return Mono.error(new RuntimeException("Gemini API error during classification"));
                            })
                    )
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            return extractTextFromResponse(response);

        } catch (Exception e) {
            throw new RuntimeException("AI Classification Service failed: " + e.getMessage());
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
        throw new RuntimeException("Dữ liệu phản hồi từ AI không đúng định dạng");
    }

}
