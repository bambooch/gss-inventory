package com.gss.inventory.inventory.domain.exception;

public class MemberNotFoundException extends RuntimeException {
    public MemberNotFoundException(Long id) {
        super("Član nije pronađen: " + id);
    }
}
