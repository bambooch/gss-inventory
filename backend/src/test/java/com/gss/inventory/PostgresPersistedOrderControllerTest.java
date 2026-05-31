package com.gss.inventory;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.support.PostgresContainerConfiguration;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "spring.jpa.hibernate.ddl-auto=create-drop")
@AutoConfigureMockMvc
@Import(PostgresContainerConfiguration.class)
class PostgresPersistedOrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private InventoryItemRepository itemRepository;

    @Test
    void createInventoryItemPersistsThePostedItemInPostgreSql() throws Exception {
        this.mockMvc.perform(post("/api/inventory")
                .contentType(APPLICATION_JSON)
                .content("""
                    {
                      "name": "Postgres perzistirani karabiner",
                      "category": "KARABINERI",
                      "description": "Test",
                      "location": "Polica A1",
                      "totalQuantity": 4
                    }
                    """))
            .andExpect(status().isCreated());

        assertThat(itemRepository.findAll())
            .extracting(InventoryItem::name)
            .contains("Postgres perzistirani karabiner");
    }
}
