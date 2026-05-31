package com.gss.inventory.inventory.domain.exception;

public class InventoryItemNotFoundException extends RuntimeException {
    public InventoryItemNotFoundException(Long id) {
        super("Oprema nije pronađena: " + id);
    }
}
