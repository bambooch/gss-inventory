package com.gss.inventory.api.dto.inventory;

import jakarta.validation.constraints.NotBlank;

public record CreateItemCategoryRequest(@NotBlank String name, @NotBlank String label, int sortOrder) {}
