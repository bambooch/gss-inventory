package com.gss.inventory.inventory.support;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;

public class InMemoryInventoryItemRepository implements InventoryItemRepository {

    private final List<InventoryItem> items = new ArrayList<>(List.of(
        new InventoryItem(1L, "HMS karabiner sa navojem", ItemCategory.KARABINERI, "Aluminijski HMS karabiner.", "Polica A1", 40, 40, List.of()),
        new InventoryItem(2L, "Stop descender", ItemCategory.SPUSTALICE, "Samokočeća spuštalica.", "Polica B1", 12, 12, List.of()),
        new InventoryItem(3L, "Rescue kolotura", ItemCategory.KOLOTURE, "Spasilačka kolotura.", "Polica C1", 16, 16, List.of()),
        new InventoryItem(4L, "Statičko uže 10.5 mm", ItemCategory.UZAD_I_TRAKE, "Polustatičko uže.", "Ormar U1", 10, 10, List.of()),
        new InventoryItem(5L, "Zaštitna kaciga", ItemCategory.KACIGE, "Spasilačka kaciga.", "Polica F1", 25, 25, List.of())
    ));

    @Override
    public InventoryItem save(InventoryItem item) {
        long nextId = items.stream()
            .map(InventoryItem::id)
            .filter(id -> id != null)
            .mapToLong(Long::longValue)
            .max()
            .orElse(0L) + 1;
        InventoryItem saved = new InventoryItem(nextId, item.name(), item.category(), item.description(),
            item.location(), item.totalQuantity(), item.availableQuantity(), List.of());
        items.add(saved);
        return saved;
    }

    @Override
    public InventoryItem update(InventoryItem item) {
        for (int i = 0; i < items.size(); i++) {
            if (items.get(i).id().equals(item.id())) {
                items.set(i, item);
                return item;
            }
        }
        throw new IllegalArgumentException("Item not found: " + item.id());
    }

    @Override
    public void deleteById(Long id) {
        items.removeIf(i -> i.id().equals(id));
    }

    @Override
    public List<InventoryItem> findAll() {
        return items;
    }

    @Override
    public Optional<InventoryItem> findById(Long id) {
        return items.stream().filter(i -> i.id().equals(id)).findFirst();
    }

    @Override
    public InventoryItem addImages(Long itemId, List<String> filePaths) {
        return findById(itemId).orElseThrow();
    }

    @Override
    public Optional<String> removeImage(Long itemId, Long imageId) {
        return Optional.empty();
    }
}
