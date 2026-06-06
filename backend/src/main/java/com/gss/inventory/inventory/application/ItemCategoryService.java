package com.gss.inventory.inventory.application;

import java.util.List;

import com.gss.inventory.api.dto.inventory.ItemCategoryResponse;
import com.gss.inventory.inventory.infrastructure.persistence.entity.ItemCategoryEntity;
import com.gss.inventory.inventory.infrastructure.persistence.repository.SpringDataItemCategoryJpaRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ItemCategoryService {

    private final SpringDataItemCategoryJpaRepository categoryRepository;

    public ItemCategoryService(SpringDataItemCategoryJpaRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<ItemCategoryResponse> findAll() {
        return categoryRepository.findAllByOrderBySortOrderAsc().stream()
            .map(this::toResponse).toList();
    }

    public ItemCategoryResponse create(String name, String label, int sortOrder) {
        ItemCategoryEntity entity = new ItemCategoryEntity(null, name.toUpperCase().strip(), label.strip(), sortOrder);
        return toResponse(categoryRepository.save(entity));
    }

    public ItemCategoryResponse update(Long id, String name, String label, int sortOrder) {
        ItemCategoryEntity entity = categoryRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Category not found: " + id));
        entity.setName(name.toUpperCase().strip());
        entity.setLabel(label.strip());
        entity.setSortOrder(sortOrder);
        return toResponse(categoryRepository.save(entity));
    }

    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }

    private ItemCategoryResponse toResponse(ItemCategoryEntity e) {
        return new ItemCategoryResponse(e.getId(), e.getName(), e.getLabel(), e.getSortOrder());
    }
}
