package com.gss.inventory.api.dto.order;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record CreateOrderRequest(
    @NotNull Long memberId,
    Optional<LocalDate> dueDate,
    String note,
    @NotEmpty @Valid List<CreateOrderLineRequest> lines
) {
}
