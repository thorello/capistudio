package com.capistudio.controller;

import com.capistudio.dto.ContactRequest;
import com.capistudio.dto.ContactResponse;
import com.capistudio.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<ContactResponse> submitContact(@Valid @RequestBody ContactRequest request) {
        contactService.saveSubmission(request);
        return ResponseEntity.ok(new ContactResponse(
                "success",
                "Mensagem recebida com sucesso. Entraremos em contato em breve."
        ));
    }
}
