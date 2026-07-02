package com.capistudio.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ContactRateLimitFilter extends OncePerRequestFilter {

    private final boolean enabled;
    private final int maxRequests;
    private final int windowSeconds;
    private final Map<String, Deque<Instant>> requestLog = new ConcurrentHashMap<>();

    public ContactRateLimitFilter(
            @Value("${app.security.rate-limit.enabled:true}") boolean enabled,
            @Value("${app.security.rate-limit.max-requests:10}") int maxRequests,
            @Value("${app.security.rate-limit.window-seconds:60}") int windowSeconds
    ) {
        this.enabled = enabled;
        this.maxRequests = maxRequests;
        this.windowSeconds = windowSeconds;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (!enabled || !isContactSubmission(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientKey = resolveClientKey(request);
        if (isRateLimited(clientKey)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("""
                    {"status":"error","message":"Muitas tentativas. Aguarde um momento e tente novamente."}
                    """);
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isContactSubmission(HttpServletRequest request) {
        return "POST".equalsIgnoreCase(request.getMethod())
                && request.getRequestURI().endsWith("/api/contact");
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private boolean isRateLimited(String clientKey) {
        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(windowSeconds);

        Deque<Instant> timestamps = requestLog.computeIfAbsent(clientKey, key -> new ArrayDeque<>());
        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(windowStart)) {
                timestamps.removeFirst();
            }

            if (timestamps.size() >= maxRequests) {
                return true;
            }

            timestamps.addLast(now);
            return false;
        }
    }
}
