package com.gss.inventory.api.controller;

import java.util.List;

import com.gss.inventory.api.dto.inventory.CreateInventoryItemRequest;
import com.gss.inventory.api.dto.inventory.InventoryItemResponse;
import com.gss.inventory.api.dto.inventory.UpdateInventoryItemRequest;
import com.gss.inventory.inventory.application.InventoryItemService;
import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Inventory")
@RestController
@RequestMapping("/api/inventory")
public class InventoryItemController {

    private final InventoryItemService itemService;

    public InventoryItemController(InventoryItemService itemService) {
        this.itemService = itemService;
    }

    @Operation(summary = "List inventory items")
    @GetMapping
    public List<InventoryItemResponse> getItems(@RequestParam(required = false) ItemCategory category) {
        return itemService.findItems(category).stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Get an inventory item by ID")
    @GetMapping("/{id}")
    public InventoryItemResponse getItem(@PathVariable Long id) {
        return toResponse(itemService.findById(id));
    }

    @Operation(summary = "Create an inventory item")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InventoryItemResponse createItem(@Valid @RequestBody CreateInventoryItemRequest request) {
        return toResponse(itemService.createItem(request.name(), request.category(), request.description(),
            request.location(), request.totalQuantity()));
    }

    @Operation(summary = "Update an inventory item")
    @PutMapping("/{id}")
    public InventoryItemResponse updateItem(@PathVariable Long id,
            @Valid @RequestBody UpdateInventoryItemRequest request) {
        return toResponse(itemService.updateItem(id, request.name(), request.category(), request.description(),
            request.location(), request.totalQuantity()));
    }

    @Operation(summary = "Delete an inventory item")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }

    private InventoryItemResponse toResponse(InventoryItem item) {
        return new InventoryItemResponse(item.id(), item.name(), item.category().name(),
            item.description(), item.location(), item.totalQuantity(), item.availableQuantity());
    }
}
