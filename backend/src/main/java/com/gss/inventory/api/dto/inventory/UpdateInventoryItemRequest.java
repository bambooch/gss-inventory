package com.gss.inventory.api.dto.inventory;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;

public record UpdateInventoryItemRequest(
    @NotBlank String name,
    List<Long> categoryIds,
    String description,
    String location,
    @PositiveOrZero int totalQuantity
) {}
