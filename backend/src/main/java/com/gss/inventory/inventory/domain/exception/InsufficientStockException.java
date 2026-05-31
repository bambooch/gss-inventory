package com.gss.inventory.inventory.domain.exception;

public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(String itemName, int requested, int available) {
        super("Nedovoljno na stanju za '" + itemName + "': traženo " + requested + ", dostupno " + available);
    }
}
