package com.gss.inventory.inventory.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import com.gss.inventory.inventory.domain.exception.InventoryItemNotFoundException;
import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.support.InMemoryInventoryItemRepository;

import org.junit.jupiter.api.Test;

class InventoryItemServiceTest {

    private final InMemoryInventoryItemRepository repository = new InMemoryInventoryItemRepository();
    private final InventoryItemService service = new InventoryItemService(repository);

    @Test
    void createItemSetsAvailableEqualToTotal() {
        InventoryItem created = service.createItem("Tibloc", ItemCategory.HVATALJKE, "Mini hvataljka", "Polica D2", 7);

        assertThat(created.id()).isNotNull();
        assertThat(created.totalQuantity()).isEqualTo(7);
        assertThat(created.availableQuantity()).isEqualTo(7);
    }

    @Test
    void findItemsFiltersByCategory() {
        List<InventoryItem> karabineri = service.findItems(ItemCategory.KARABINERI);

        assertThat(karabineri).isNotEmpty();
        assertThat(karabineri).allMatch(item -> item.category() == ItemCategory.KARABINERI);
    }

    @Test
    void updateItemPreservesQuantityInUse() {
        // Item 1 starts with total 40, available 40. Simulate 10 in use.
        InventoryItem item = service.findById(1L);
        repository.update(new InventoryItem(item.id(), item.name(), item.category(), item.description(),
            item.location(), item.totalQuantity(), item.availableQuantity() - 10));

        InventoryItem updated = service.updateItem(1L, "HMS karabiner", ItemCategory.KARABINERI,
            "Ažuriran opis", "Polica A1", 50);

        assertThat(updated.totalQuantity()).isEqualTo(50);
        assertThat(updated.availableQuantity()).isEqualTo(40); // 50 total - 10 in use
    }

    @Test
    void findByIdThrowsWhenMissing() {
        assertThatThrownBy(() -> service.findById(999L))
            .isInstanceOf(InventoryItemNotFoundException.class);
    }
}
