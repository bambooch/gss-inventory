package com.gss.inventory.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import com.gss.inventory.api.controller.GlobalExceptionHandler;
import com.gss.inventory.api.controller.OrderController;
import com.gss.inventory.inventory.application.MemberService;
import com.gss.inventory.inventory.application.OrderService;
import com.gss.inventory.inventory.support.InMemoryInventoryItemRepository;
import com.gss.inventory.inventory.support.InMemoryMemberRepository;
import com.gss.inventory.inventory.support.InMemoryOrderRepository;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WithMockUser
@WebMvcTest(OrderController.class)
@Import({
    OrderService.class,
    MemberService.class,
    GlobalExceptionHandler.class,
    InMemoryOrderRepository.class,
    InMemoryInventoryItemRepository.class,
    InMemoryMemberRepository.class
})
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getOrdersReturnsArray() throws Exception {
        this.mockMvc.perform(get("/api/orders"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void createOrderDeductsAndReturnsDetail() throws Exception {
        this.mockMvc.perform(post("/api/orders")
                .with(csrf())
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "memberId": 1,
                    "dueDate": "2026-06-15",
                    "note": "Vježba spašavanja",
                    "lines": [ { "itemId": 1, "quantity": 5 } ]
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.status").value("AKTIVNO"))
            .andExpect(jsonPath("$.memberName").value("Adnan Kovač"))
            .andExpect(jsonPath("$.lines[0].itemName").value("HMS karabiner sa navojem"))
            .andExpect(jsonPath("$.lines[0].quantity").value(5));
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void createOrderWithInsufficientStockReturnsConflict() throws Exception {
        this.mockMvc.perform(post("/api/orders")
                .with(csrf())
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "memberId": 1,
                    "dueDate": "2026-06-15",
                    "lines": [ { "itemId": 2, "quantity": 999 } ]
                    }
                    """))
            .andExpect(status().isConflict());
    }

    @Test
    void createOrderWithoutLinesReturnsBadRequest() throws Exception {
        this.mockMvc.perform(post("/api/orders")
                .with(csrf())
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "memberId": 1,
                    "dueDate": "2026-06-15",
                    "lines": []
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void returnOrderMarksReturned() throws Exception {
        this.mockMvc.perform(post("/api/orders")
                .with(csrf())
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "memberId": 1,
                    "dueDate": "2026-06-15",
                    "lines": [ { "itemId": 3, "quantity": 2 } ]
                    }
                    """))
            .andExpect(status().isCreated());

        this.mockMvc.perform(post("/api/orders/1/return").with(csrf()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("VRACENO"))
            .andExpect(jsonPath("$.returnedAt").isNotEmpty());
    }

    @Test
    void getOrderByUnknownIdReturnsNotFound() throws Exception {
        this.mockMvc.perform(get("/api/orders/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void deleteOrderRemovesIt() throws Exception {
        this.mockMvc.perform(post("/api/orders")
                .with(csrf())
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "memberId": 1,
                    "dueDate": "2026-06-15",
                    "lines": [ { "itemId": 4, "quantity": 1 } ]
                    }
                    """))
            .andExpect(status().isCreated());

        this.mockMvc.perform(delete("/api/orders/1").with(csrf()))
            .andExpect(status().isNoContent());
    }
}
