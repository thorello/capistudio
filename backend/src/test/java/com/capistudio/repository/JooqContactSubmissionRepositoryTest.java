package com.capistudio.repository;

import com.capistudio.domain.NewContactSubmission;
import org.jooq.DSLContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static com.capistudio.jooq.tables.ContactSubmissions.CONTACT_SUBMISSIONS;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class JooqContactSubmissionRepositoryTest {

    @Autowired
    private ContactSubmissionRepository contactSubmissionRepository;

    @Autowired
    private DSLContext dsl;

    @Test
    void save_persistsRow() {
        contactSubmissionRepository.save(
                new NewContactSubmission("Ana Silva", "ana@example.com", "Olá, gostaria de saber mais.")
        );

        int count = dsl.fetchCount(CONTACT_SUBMISSIONS);

        assertThat(count).isEqualTo(1);
    }
}
