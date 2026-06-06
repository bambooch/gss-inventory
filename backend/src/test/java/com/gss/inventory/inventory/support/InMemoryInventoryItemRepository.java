package com.gss.inventory.inventory.support;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;

public class InMemoryInventoryItemRepository implements InventoryItemRepository {

    private static final InventoryItem.Category KARABINERI  = new InventoryItem.Category(14L, "KARABINERI",  "Karabineri");
    private static final InventoryItem.Category SPUSTALICE  = new InventoryItem.Category(15L, "SPUSTALICE",  "Spuštalice");
    private static final InventoryItem.Category KOLOTURE    = new InventoryItem.Category(3L,  "KOLOTURE",    "Koloture");
    private static final InventoryItem.Category UZAD_I_TRAKE = new InventoryItem.Category(17L, "UZAD_I_TRAKE", "Užad i trake");
    private static final InventoryItem.Category KACIGE      = new InventoryItem.Category(18L, "KACIGE",      "Kacige");

    private final List<InventoryItem> items = new ArrayList<>(List.of(
        new InventoryItem(1L, "HMS karabiner sa navojem", List.of(KARABINERI), "Aluminijski HMS karabiner.", "Polica A1", 40, 40, List.of()),
        new InventoryItem(2L, "Stop descender",           List.of(SPUSTALICE), "Samokočeća spuštalica.",    "Polica B1", 12, 12, List.of()),
        new InventoryItem(3L, "Rescue kolotura",          List.of(KOLOTURE),   "Spasilačka kolotura.",      "Polica C1", 16, 16, List.of()),
        new InventoryItem(4L, "Statičko uže 10.5 mm",    List.of(UZAD_I_TRAKE),"Polustatičko uže.",        "Ormar U1",  10, 10, List.of()),
        new InventoryItem(5L, "Zaštitna kaciga",          List.of(KACIGE),     "Spasilačka kaciga.",        "Polica F1", 25, 25, List.of())
    ));

    @Override
    public InventoryItem save(InventoryItem item) {
        long nextId = items.stream()
            .map(InventoryItem::id)
            .filter(id -> id != null)
            .mapToLong(Long::longValue)
            .max()
            .orElse(0L) + 1;
        InventoryItem saved = new InventoryItem(nextId, item.name(), item.categories(), item.description(),
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
