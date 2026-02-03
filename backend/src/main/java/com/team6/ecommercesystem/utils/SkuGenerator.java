package com.team6.ecommercesystem.utils;

import java.text.Normalizer;
import java.util.regex.Pattern;

public class SkuGenerator {
    public static String generateSku(String productName, String color, String size) {
        return (shorten(productName) + "-" + shorten(color) + "-" + shorten(size)).toUpperCase();
    }

    private static String shorten(String input) {
        if (input == null || input.isEmpty()) return "XX";

        String nfdNormalizedString = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String slug = pattern.matcher(nfdNormalizedString).replaceAll("")
                .replaceAll("[^a-zA-Z0-9]", "");

        return slug.length() > 3 ? slug.substring(0, 3) : slug;
    }
}
