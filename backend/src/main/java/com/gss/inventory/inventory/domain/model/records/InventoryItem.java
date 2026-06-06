package com.gss.inventory.inventory.domain.model.records;

import java.util.List;

public record InventoryItem(
    Long id,
    String name,
    List<Category> categories,
    String description,
    String location,
    int totalQuantity,
    int availableQuantity,
    List<Image> images
) {
    public record Category(Long id, String name, String label) {}
    public record Image(Long id, String url) {}
}
