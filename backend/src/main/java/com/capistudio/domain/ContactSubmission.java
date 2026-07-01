package com.capistudio.domain;

import java.time.Instant;
import java.util.UUID;

public record ContactSubmission(
        UUID id,
        String name,
        String email,
        String message,
        Instant createdAt
) {}
