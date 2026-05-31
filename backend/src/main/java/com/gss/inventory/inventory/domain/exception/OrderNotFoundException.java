package com.gss.inventory.inventory.domain.exception;

public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(Long id) {
        super("Zaduženje nije pronađeno: " + id);
    }
}
