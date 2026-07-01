package com.capistudio.repository;

import com.capistudio.domain.NewContactSubmission;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcContactSubmissionRepository implements ContactSubmissionRepository {

    private static final String INSERT =
            "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)";

    private final JdbcTemplate jdbcTemplate;

    public JdbcContactSubmissionRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void save(NewContactSubmission submission) {
        jdbcTemplate.update(
                INSERT,
                submission.name(),
                submission.email(),
                submission.message()
        );
    }
}
