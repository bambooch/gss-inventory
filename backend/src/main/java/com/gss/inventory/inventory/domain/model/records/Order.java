package com.gss.inventory.inventory.domain.model.records;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import com.gss.inventory.inventory.domain.model.enums.OrderStatus;

public record Order(
    Long id,
    Long memberId,
    String memberName,
    OrderStatus status,
    Instant issuedAt,
    LocalDate dueDate,
    Instant returnedAt,
    String note,
    List<OrderLine> lines
) {
}
