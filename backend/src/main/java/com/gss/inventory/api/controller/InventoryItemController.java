package com.gss.inventory.api.controller;

import java.util.List;

import com.gss.inventory.api.dto.inventory.CreateInventoryItemRequest;
import com.gss.inventory.api.dto.inventory.InventoryItemResponse;
import com.gss.inventory.api.dto.inventory.UpdateInventoryItemRequest;
import com.gss.inventory.inventory.application.InventoryItemService;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
import org.springframework.web.multipart.MultipartFile;

@Tag(name = "Inventory")
@RestController
@RequestMapping("/api/inventory")
public class InventoryItemController {

    private final InventoryItemService itemService;

    public InventoryItemController(InventoryItemService itemService) {
        this.itemService = itemService;
    }

    @Operation(summary = "List inventory items, optionally filtered by category name")
    @GetMapping
    public List<InventoryItemResponse> getItems(@RequestParam(required = false) String category) {
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
        return toResponse(itemService.createItem(request.name(), request.categoryIds(),
            request.description(), request.location(), request.totalQuantity()));
    }

    @Operation(summary = "Update an inventory item")
    @PutMapping("/{id}")
    public InventoryItemResponse updateItem(@PathVariable Long id,
            @Valid @RequestBody UpdateInventoryItemRequest request) {
        return toResponse(itemService.updateItem(id, request.name(), request.categoryIds(),
            request.description(), request.location(), request.totalQuantity()));
    }

    @Operation(summary = "Delete an inventory item")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
    }

    @Operation(summary = "Upload images for an inventory item")
    @PostMapping(value = "/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public InventoryItemResponse uploadImages(@PathVariable Long id,
            @RequestParam("files") List<MultipartFile> files) {
        return toResponse(itemService.uploadImages(id, files));
    }

    @Operation(summary = "Delete an image from an inventory item")
    @DeleteMapping("/{id}/images/{imageId}")
    public InventoryItemResponse deleteImage(@PathVariable Long id, @PathVariable Long imageId) {
        return toResponse(itemService.deleteImage(id, imageId));
    }

    private InventoryItemResponse toResponse(InventoryItem item) {
        List<InventoryItemResponse.CategoryDto> categoryDtos = item.categories().stream()
            .map(c -> new InventoryItemResponse.CategoryDto(c.id(), c.name(), c.label()))
            .toList();
        List<InventoryItemResponse.ImageDto> imageDtos = item.images().stream()
            .map(img -> new InventoryItemResponse.ImageDto(img.id(), img.url()))
            .toList();
        return new InventoryItemResponse(item.id(), item.name(), categoryDtos,
            item.description(), item.location(), item.totalQuantity(), item.availableQuantity(), imageDtos);
    }
}
