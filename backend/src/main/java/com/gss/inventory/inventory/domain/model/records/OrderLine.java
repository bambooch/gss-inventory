package com.gss.inventory.inventory.domain.model.records;

public record OrderLine(Long id, Long itemId, String itemName, int quantity) {
}
