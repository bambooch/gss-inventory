package com.gss.inventory.api.dto.inventory;

public record InventoryItemResponse(
    Long id,
    String name,
    String category,
    String description,
    String location,
    int totalQuantity,
    int availableQuantity
) {
}
