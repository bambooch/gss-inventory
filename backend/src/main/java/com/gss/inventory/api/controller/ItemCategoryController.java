package com.gss.inventory.api.controller;

import java.util.List;

import com.gss.inventory.api.dto.inventory.CreateItemCategoryRequest;
import com.gss.inventory.api.dto.inventory.ItemCategoryResponse;
import com.gss.inventory.api.dto.inventory.UpdateItemCategoryRequest;
import com.gss.inventory.inventory.application.ItemCategoryService;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Categories")
@RestController
@RequestMapping("/api/categories")
public class ItemCategoryController {

    private final ItemCategoryService categoryService;

    public ItemCategoryController(ItemCategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<ItemCategoryResponse> getCategories() {
        return categoryService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ItemCategoryResponse createCategory(@Valid @RequestBody CreateItemCategoryRequest request) {
        return categoryService.create(request.name(), request.label(), request.sortOrder());
    }

    @PutMapping("/{id}")
    public ItemCategoryResponse updateCategory(@PathVariable Long id,
            @Valid @RequestBody UpdateItemCategoryRequest request) {
        return categoryService.update(id, request.name(), request.label(), request.sortOrder());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
