package com.gss.inventory.api.dto.order;

import java.time.Instant;
import java.time.LocalDate;

public record OrderSummaryResponse(
    Long id,
    Long memberId,
    String memberName,
    String status,
    Instant issuedAt,
    LocalDate dueDate,
    Instant returnedAt,
    int itemCount
) {
}
