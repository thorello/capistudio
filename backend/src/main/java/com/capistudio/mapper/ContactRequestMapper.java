package com.capistudio.mapper;

import com.capistudio.domain.NewContactSubmission;
import com.capistudio.dto.ContactRequest;
import com.capistudio.security.InputSanitizer;
import org.springframework.stereotype.Component;

@Component
public class ContactRequestMapper {

    private final InputSanitizer inputSanitizer;

    public ContactRequestMapper(InputSanitizer inputSanitizer) {
        this.inputSanitizer = inputSanitizer;
    }

    public NewContactSubmission toDomain(ContactRequest request) {
        return new NewContactSubmission(
                inputSanitizer.sanitizeText(request.name()),
                inputSanitizer.sanitizeText(request.email()),
                inputSanitizer.sanitizeText(request.message())
        );
    }
}
