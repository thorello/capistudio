package com.capistudio.repository;

import com.capistudio.domain.NewContactSubmission;

public interface ContactSubmissionRepository {

    void save(NewContactSubmission submission);
}
