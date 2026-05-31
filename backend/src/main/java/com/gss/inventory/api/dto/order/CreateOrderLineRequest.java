package com.gss.inventory.api.dto.order;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateOrderLineRequest(@NotNull Long itemId, @Positive int quantity) {
}
