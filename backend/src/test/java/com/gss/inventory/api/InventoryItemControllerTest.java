package com.gss.inventory.api;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Import;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import com.gss.inventory.api.controller.GlobalExceptionHandler;
import com.gss.inventory.api.controller.InventoryItemController;
import com.gss.inventory.inventory.application.InventoryItemService;
import com.gss.inventory.inventory.support.InMemoryInventoryItemRepository;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(InventoryItemController.class)
@Import({
    InventoryItemService.class,
    GlobalExceptionHandler.class,
    InMemoryInventoryItemRepository.class
})
class InventoryItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void getItemsReturnsList() throws Exception {
        this.mockMvc.perform(get("/api/inventory"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$[0].name").value("HMS karabiner sa navojem"))
            .andExpect(jsonPath("$[0].category").value("KARABINERI"));
    }

    @Test
    void getItemsWithCategoryReturnsFilteredList() throws Exception {
        this.mockMvc.perform(get("/api/inventory?category=SPUSTALICE"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].name").value("Stop descender"));
    }

    @Test
    void getItemByIdReturnsItem() throws Exception {
        this.mockMvc.perform(get("/api/inventory/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.totalQuantity").value(40))
            .andExpect(jsonPath("$.availableQuantity").value(40));
    }

    @Test
    void getItemByUnknownIdReturnsNotFound() throws Exception {
        this.mockMvc.perform(get("/api/inventory/999"))
            .andExpect(status().isNotFound());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void createItemReturnsCreated() throws Exception {
        this.mockMvc.perform(post("/api/inventory")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "name": "Tibloc hvataljka",
                    "category": "HVATALJKE",
                    "description": "Mini hvataljka",
                    "location": "Polica D2",
                    "totalQuantity": 7
                    }
                    """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").isNumber())
            .andExpect(jsonPath("$.name").value("Tibloc hvataljka"))
            .andExpect(jsonPath("$.totalQuantity").value(7))
            .andExpect(jsonPath("$.availableQuantity").value(7));
    }

    @Test
    void createItemWithoutNameReturnsBadRequest() throws Exception {
        this.mockMvc.perform(post("/api/inventory")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "category": "HVATALJKE",
                    "totalQuantity": 7
                    }
                    """))
            .andExpect(status().isBadRequest());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void updateItemReturnsUpdated() throws Exception {
        this.mockMvc.perform(put("/api/inventory/1")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                    "name": "HMS karabiner (ažuriran)",
                    "category": "KARABINERI",
                    "description": "Novi opis",
                    "location": "Polica A1",
                    "totalQuantity": 50
                    }
                    """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(1))
            .andExpect(jsonPath("$.name").value("HMS karabiner (ažuriran)"))
            .andExpect(jsonPath("$.totalQuantity").value(50));
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void deleteItemRemovesIt() throws Exception {
        this.mockMvc.perform(delete("/api/inventory/1"))
            .andExpect(status().isNoContent());

        this.mockMvc.perform(get("/api/inventory"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(4))
            .andExpect(jsonPath("$[?(@.id == 1)]").isEmpty());
    }
}
