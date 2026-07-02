package com.capistudio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactRequest(
        @NotBlank
        @Size(max = 120)
        @Pattern(regexp = "[^<>]*", message = "Nome contém caracteres inválidos")
        String name,

        @NotBlank
        @Email
        @Size(max = 255)
        String email,

        @NotBlank
        @Size(max = 2000)
        @Pattern(regexp = "[^<>]*", message = "Mensagem contém caracteres inválidos")
        String message
) {}
