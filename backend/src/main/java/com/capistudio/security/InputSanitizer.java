package com.capistudio.security;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class InputSanitizer {

    private static final Pattern HTML_TAGS = Pattern.compile("<[^>]*>");

    public String sanitizeText(String value) {
        if (value == null) {
            return null;
        }

        String withoutNullBytes = value.replace("\0", "");
        String withoutTags = HTML_TAGS.matcher(withoutNullBytes).replaceAll("");
        return withoutTags.trim();
    }
}
