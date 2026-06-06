package com.gss.inventory.inventory.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.util.List;

import com.gss.inventory.inventory.domain.exception.InventoryItemNotFoundException;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.infrastructure.ImageStorageService;
import com.gss.inventory.inventory.support.InMemoryInventoryItemRepository;
import com.gss.inventory.inventory.support.InMemoryItemCategoryRepository;

import org.junit.jupiter.api.Test;

class InventoryItemServiceTest {

    private final InMemoryInventoryItemRepository repository = new InMemoryInventoryItemRepository();
    private final InMemoryItemCategoryRepository categoryRepository = new InMemoryItemCategoryRepository();
    private final InventoryItemService service = new InventoryItemService(repository, categoryRepository, new ImageStorageService());

    @Test
    void createItemSetsAvailableEqualToTotal() {
        InventoryItem created = service.createItem("Tibloc", List.of(19L), "Mini hvataljka", "Polica D2", 7);

        assertThat(created.id()).isNotNull();
        assertThat(created.totalQuantity()).isEqualTo(7);
        assertThat(created.availableQuantity()).isEqualTo(7);
    }

    @Test
    void createItemWithNoCategoryIsAllowed() {
        InventoryItem created = service.createItem("Nepoznata oprema", List.of(), "Opis", "Polica X1", 3);

        assertThat(created.categories()).isEmpty();
    }

    @Test
    void findItemsFiltersByCategory() {
        List<InventoryItem> karabineri = service.findItems("KARABINERI");

        assertThat(karabineri).isNotEmpty();
        assertThat(karabineri).allMatch(item ->
            item.categories().stream().anyMatch(c -> "KARABINERI".equals(c.name())));
    }

    @Test
    void findItemsWithNullCategoryReturnsAll() {
        assertThat(service.findItems(null)).hasSize(5);
    }

    @Test
    void updateItemPreservesQuantityInUse() {
        InventoryItem item = service.findById(1L);
        repository.update(new InventoryItem(item.id(), item.name(), item.categories(), item.description(),
            item.location(), item.totalQuantity(), item.availableQuantity() - 10, List.of()));

        InventoryItem updated = service.updateItem(1L, "HMS karabiner", List.of(14L),
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
