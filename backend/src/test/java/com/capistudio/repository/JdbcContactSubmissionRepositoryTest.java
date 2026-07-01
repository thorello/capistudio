package com.capistudio.repository;

import com.capistudio.domain.NewContactSubmission;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class JdbcContactSubmissionRepositoryTest {

    @Autowired
    private ContactSubmissionRepository contactSubmissionRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void save_persistsRow() {
        contactSubmissionRepository.save(
                new NewContactSubmission("Ana Silva", "ana@example.com", "Olá, gostaria de saber mais.")
        );

        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM contact_submissions",
                Integer.class
        );

        assertThat(count).isEqualTo(1);
    }
}
