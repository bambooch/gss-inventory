package com.gss.inventory.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import com.gss.inventory.api.controller.GlobalExceptionHandler;
import com.gss.inventory.api.controller.MemberController;
import com.gss.inventory.inventory.application.MemberService;
import com.gss.inventory.inventory.support.InMemoryMemberRepository;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MemberController.class)
@Import({
    MemberService.class,
    GlobalExceptionHandler.class,
    InMemoryMemberRepository.class
})
class MemberControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void createMemberReturnsCreated() throws Exception {
        this.mockMvc.perform(post("/api/members")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "fullName": "Haris Delić",
                    "phone": "+387 63 456 789",
                    "team": "Spasilački tim B"
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.fullName").value("Haris Delić"))
            .andExpect(jsonPath("$.team").value("Spasilački tim B"));
    }

    @Test
    void createMemberWithoutNameReturnsBadRequest() throws Exception {
        this.mockMvc.perform(post("/api/members")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "phone": "+387 63 456 789"
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    void getAllMembersReturnsList() throws Exception {
        this.mockMvc.perform(get("/api/members"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getMemberByUnknownIdReturnsNotFound() throws Exception {
        this.mockMvc.perform(get("/api/members/999"))
            .andExpect(status().isNotFound());
    }
}
