package com.capistudio.mapper;

import com.capistudio.domain.NewContactSubmission;
import com.capistudio.dto.ContactRequest;
import org.springframework.stereotype.Component;

@Component
public class ContactRequestMapper {

    public NewContactSubmission toDomain(ContactRequest request) {
        return new NewContactSubmission(
                request.name(),
                request.email(),
                request.message()
        );
    }
}
