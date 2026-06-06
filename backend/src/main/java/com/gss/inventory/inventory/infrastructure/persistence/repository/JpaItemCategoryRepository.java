package com.gss.inventory.inventory.infrastructure.persistence.repository;

import java.util.List;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.ItemCategoryRepository;
import com.gss.inventory.inventory.infrastructure.persistence.entity.ItemCategoryEntity;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaItemCategoryRepository implements ItemCategoryRepository {

    private final SpringDataItemCategoryJpaRepository repository;

    public JpaItemCategoryRepository(SpringDataItemCategoryJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<InventoryItem.Category> findAll() {
        return repository.findAllByOrderBySortOrderAsc().stream()
            .map(this::toDomain).toList();
    }

    @Override
    public List<InventoryItem.Category> findAllByIds(List<Long> ids) {
        if (ids == null || ids.isEmpty()) return List.of();
        return repository.findAllById(ids).stream()
            .map(this::toDomain).toList();
    }

    private InventoryItem.Category toDomain(ItemCategoryEntity e) {
        return new InventoryItem.Category(e.getId(), e.getName(), e.getLabel());
    }
}
