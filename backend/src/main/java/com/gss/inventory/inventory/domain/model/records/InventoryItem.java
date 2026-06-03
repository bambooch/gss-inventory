package com.gss.inventory.inventory.domain.model.records;

import java.util.List;

import com.gss.inventory.inventory.domain.model.enums.ItemCategory;

public record InventoryItem(
    Long id,
    String name,
    ItemCategory category,
    String description,
    String location,
    int totalQuantity,
    int availableQuantity,
    List<Image> images
) {
    public record Image(Long id, String url) {}
}
