package com.capistudio.service;

import com.capistudio.domain.NewContactSubmission;
import com.capistudio.repository.ContactSubmissionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class ContactServiceTest {

    @Mock
    private ContactSubmissionRepository contactSubmissionRepository;

    @InjectMocks
    private ContactService contactService;

    @Test
    void saveSubmission_delegatesToRepository() {
        var submission = new NewContactSubmission("Ana Silva", "ana@example.com", "Olá!");

        contactService.saveSubmission(submission);

        verify(contactSubmissionRepository).save(submission);
    }
}
