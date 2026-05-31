package com.gss.inventory.inventory.infrastructure.persistence;

import static org.assertj.core.api.Assertions.assertThat;

import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;
import com.gss.inventory.inventory.infrastructure.persistence.repository.JpaInventoryItemRepository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;

@DataJpaTest
@Import(JpaInventoryItemRepository.class)
class JpaInventoryItemRepositoryTest {

    @Autowired
    private InventoryItemRepository repository;

    @Test
    void savesItemAndReadsItBackFromTheDatabase() {
        InventoryItem saved = repository.save(
            new InventoryItem(null, "Stop descender", ItemCategory.SPUSTALICE, "Spuštalica", "Polica B1", 12, 12));

        assertThat(saved.id()).isNotNull();
        assertThat(repository.findAll())
            .filteredOn(i -> "Stop descender".equals(i.name()))
            .singleElement()
            .satisfies(i -> {
                assertThat(i.category()).isEqualTo(ItemCategory.SPUSTALICE);
                assertThat(i.availableQuantity()).isEqualTo(12);
            });
    }

    @Test
    void findByIdReturnsItem() {
        InventoryItem saved = repository.save(
            new InventoryItem(null, "Rescue kolotura", ItemCategory.KOLOTURE, "Kolotura", "Polica C1", 16, 16));

        assertThat(repository.findById(saved.id()))
            .isPresent()
            .hasValueSatisfying(i -> assertThat(i.name()).isEqualTo("Rescue kolotura"));
    }

    @Test
    void findByIdReturnsEmptyForUnknownId() {
        assertThat(repository.findById(999L)).isEmpty();
    }
}
