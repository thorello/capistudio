package com.capistudio.security;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class InputSanitizerTest {

    private final InputSanitizer sanitizer = new InputSanitizer();

    @Test
    void sanitizeText_removesHtmlTags() {
        assertThat(sanitizer.sanitizeText("<script>alert(1)</script>João"))
                .isEqualTo("alert(1)João");
    }

    @Test
    void sanitizeText_removesNullBytesAndTrims() {
        assertThat(sanitizer.sanitizeText("  Ana\0Silva  "))
                .isEqualTo("AnaSilva");
    }

    @Test
    void sanitizeText_returnsNullForNullInput() {
        assertThat(sanitizer.sanitizeText(null)).isNull();
    }
}
