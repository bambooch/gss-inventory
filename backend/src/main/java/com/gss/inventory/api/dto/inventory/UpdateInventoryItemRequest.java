package com.gss.inventory.api.dto.inventory;

import com.gss.inventory.inventory.domain.model.enums.ItemCategory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record UpdateInventoryItemRequest(
    @NotBlank String name,
    @NotNull ItemCategory category,
    String description,
    String location,
    @PositiveOrZero int totalQuantity
) {
}
