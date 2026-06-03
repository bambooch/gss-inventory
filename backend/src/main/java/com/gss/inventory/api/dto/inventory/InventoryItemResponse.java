package com.gss.inventory.api.dto.inventory;

import java.util.List;

public record InventoryItemResponse(
    Long id,
    String name,
    String category,
    String description,
    String location,
    int totalQuantity,
    int availableQuantity,
    List<ImageDto> images
) {
    public record ImageDto(Long id, String url) {}
}
