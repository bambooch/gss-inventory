package com.gss.inventory.inventory.infrastructure.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import com.gss.inventory.support.PostgresContainerConfiguration;
import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;
import com.gss.inventory.inventory.infrastructure.persistence.repository.JpaInventoryItemRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.context.annotation.Import;

@DataJpaTest(properties = "spring.jpa.hibernate.ddl-auto=create-drop")
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import({JpaInventoryItemRepository.class, PostgresContainerConfiguration.class})
class PostgresJpaInventoryItemRepositoryTest {

    @Autowired
    private InventoryItemRepository repository;

    @Test
    void savesItemAndReadsItBackFromPostgreSql() {
        InventoryItem saved = repository.save(
            new InventoryItem(null, "Postgres karabiner", ItemCategory.KARABINERI, "Test", "Polica A1", 5, 5, List.of()));

        assertThat(saved.id()).isNotNull();
        assertThat(repository.findAll())
            .filteredOn(i -> "Postgres karabiner".equals(i.name()))
            .singleElement()
            .satisfies(i -> {
                assertThat(i.category()).isEqualTo(ItemCategory.KARABINERI);
                assertThat(i.totalQuantity()).isEqualTo(5);
            });
    }
}
