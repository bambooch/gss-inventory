package com.gss.inventory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:persisted-order-controller-test;DB_CLOSE_DELAY=-1;MODE=PostgreSQL",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PersistedOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryItemRepository itemRepository;

    @Test
    void createInventoryItemPersistsThePostedItem() throws Exception {
        this.mockMvc.perform(post("/api/inventory")
                .with(user("testuser"))
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                      "name": "Perzistirani karabiner",
                      "categoryIds": [],
                      "description": "Test",
                      "location": "Polica A1",
                      "totalQuantity": 9
                    }
                    """))
            .andExpect(status().isCreated());

        assertThat(itemRepository.findAll())
            .extracting(InventoryItem::name)
            .contains("Perzistirani karabiner");
    }
}
