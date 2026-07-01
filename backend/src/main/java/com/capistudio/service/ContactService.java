package com.capistudio.service;

import com.capistudio.domain.NewContactSubmission;
import com.capistudio.repository.ContactSubmissionRepository;
import org.springframework.stereotype.Service;

@Service
public class ContactService implements ContactSubmissionService {

    private final ContactSubmissionRepository contactSubmissionRepository;

    public ContactService(ContactSubmissionRepository contactSubmissionRepository) {
        this.contactSubmissionRepository = contactSubmissionRepository;
    }

    @Override
    public void saveSubmission(NewContactSubmission submission) {
        contactSubmissionRepository.save(submission);
    }
}
