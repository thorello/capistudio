package com.capistudio.service;

import com.capistudio.dto.ContactRequest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private final JdbcTemplate jdbcTemplate;

    public ContactService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void saveSubmission(ContactRequest request) {
        jdbcTemplate.update(
                "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)",
                request.name(),
                request.email(),
                request.message()
        );
    }
}
