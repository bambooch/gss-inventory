package com.gss.inventory.inventory.domain.model.records;

import com.gss.inventory.inventory.domain.model.enums.ItemCategory;

public record InventoryItem(
    Long id,
    String name,
    ItemCategory category,
    String description,
    String location,
    int totalQuantity,
    int availableQuantity
) {
}
