package com.gss.inventory.api.dto.order;

public record OrderLineResponse(Long id, Long itemId, String itemName, int quantity) {
}
