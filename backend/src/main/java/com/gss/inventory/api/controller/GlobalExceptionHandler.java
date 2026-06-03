package com.gss.inventory.api.controller;

import java.util.Map;

import com.gss.inventory.inventory.domain.exception.ImageNotFoundException;
import com.gss.inventory.inventory.domain.exception.InsufficientStockException;
import com.gss.inventory.inventory.domain.exception.InventoryItemNotFoundException;
import com.gss.inventory.inventory.domain.exception.MemberNotFoundException;
import com.gss.inventory.inventory.domain.exception.OrderNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
        InventoryItemNotFoundException.class,
        MemberNotFoundException.class,
        OrderNotFoundException.class,
        ImageNotFoundException.class
    })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, String> handleNotFound(RuntimeException ex) {
        return Map.of("error", ex.getMessage());
    }

    @ExceptionHandler(InsufficientStockException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleInsufficientStock(InsufficientStockException ex) {
        return Map.of("error", ex.getMessage());
    }
}
