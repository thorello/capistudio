package com.capistudio.controller;

import com.capistudio.dto.ContactRequest;
import com.capistudio.dto.ContactResponse;
import com.capistudio.mapper.ContactRequestMapper;
import com.capistudio.service.ContactSubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ContactController {

    private static final String SUCCESS_MESSAGE =
            "Mensagem recebida com sucesso. Entraremos em contato em breve.";

    private final ContactSubmissionService contactSubmissionService;
    private final ContactRequestMapper contactRequestMapper;

    public ContactController(
            ContactSubmissionService contactSubmissionService,
            ContactRequestMapper contactRequestMapper
    ) {
        this.contactSubmissionService = contactSubmissionService;
        this.contactRequestMapper = contactRequestMapper;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        contactSubmissionService.saveSubmission(contactRequestMapper.toDomain(request));
        return ResponseEntity.ok(new ContactResponse("success", SUCCESS_MESSAGE));
    }
}
