package com.gss.inventory.inventory.application;

import java.util.List;

import com.gss.inventory.inventory.domain.exception.InventoryItemNotFoundException;
import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;

import org.springframework.stereotype.Service;

@Service
public class InventoryItemService {

    private final InventoryItemRepository itemRepository;

    public InventoryItemService(InventoryItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public InventoryItem createItem(String name, ItemCategory category, String description,
            String location, int totalQuantity) {
        return itemRepository.save(
            new InventoryItem(null, name, category, description, location, totalQuantity, totalQuantity));
    }

    public InventoryItem updateItem(Long id, String name, ItemCategory category, String description,
            String location, int totalQuantity) {
        InventoryItem existing = findById(id);
        int inUse = existing.totalQuantity() - existing.availableQuantity();
        int newAvailable = Math.max(totalQuantity - inUse, 0);
        return itemRepository.update(
            new InventoryItem(id, name, category, description, location, totalQuantity, newAvailable));
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public List<InventoryItem> findItems(ItemCategory category) {
        return itemRepository.findAll().stream()
            .filter(item -> category == null || item.category() == category)
            .toList();
    }

    public InventoryItem findById(Long id) {
        return itemRepository.findById(id)
            .orElseThrow(() -> new InventoryItemNotFoundException(id));
    }
}
