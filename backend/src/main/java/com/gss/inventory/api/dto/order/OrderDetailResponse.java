package com.gss.inventory.api.dto.order;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record OrderDetailResponse(
    Long id,
    Long memberId,
    String memberName,
    String status,
    Instant issuedAt,
    LocalDate dueDate,
    Instant returnedAt,
    String note,
    List<OrderLineResponse> lines
) {
}
