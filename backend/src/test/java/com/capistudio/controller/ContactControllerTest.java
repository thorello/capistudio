package com.capistudio.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void submitContact_returnsSuccess() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Ana Silva",
                                  "email": "ana@example.com",
                                  "message": "Olá, gostaria de saber mais."
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(header().string("X-Content-Type-Options", "nosniff"));
    }

    @Test
    void submitContact_invalidEmail_returns400() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Ana Silva",
                                  "email": "email-invalido",
                                  "message": "Olá, gostaria de saber mais."
                                }
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void submitContact_htmlInMessage_returns400() throws Exception {
        mockMvc.perform(post("/api/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "Ana Silva",
                                  "email": "ana@example.com",
                                  "message": "Olá <script>alert(1)</script>"
                                }
                                """))
                .andExpect(status().isBadRequest());
    }
}
