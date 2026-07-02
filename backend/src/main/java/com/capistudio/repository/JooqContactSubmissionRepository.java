package com.capistudio.repository;

import com.capistudio.domain.NewContactSubmission;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import static com.capistudio.jooq.tables.ContactSubmissions.CONTACT_SUBMISSIONS;

@Repository
public class JooqContactSubmissionRepository implements ContactSubmissionRepository {

    private final DSLContext dsl;

    public JooqContactSubmissionRepository(DSLContext dsl) {
        this.dsl = dsl;
    }

    @Override
    public void save(NewContactSubmission submission) {
        dsl.insertInto(CONTACT_SUBMISSIONS)
                .set(CONTACT_SUBMISSIONS.NAME, submission.name())
                .set(CONTACT_SUBMISSIONS.EMAIL, submission.email())
                .set(CONTACT_SUBMISSIONS.MESSAGE, submission.message())
                .execute();
    }
}
