package com.gss.inventory.api.dto.inventory;

import java.util.List;

public record InventoryItemResponse(
    Long id,
    String name,
    List<CategoryDto> categories,
    String description,
    String location,
    int totalQuantity,
    int availableQuantity,
    List<ImageDto> images
) {
    public record CategoryDto(Long id, String name, String label) {}
    public record ImageDto(Long id, String url) {}
}
