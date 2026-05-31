package com.gss.inventory.inventory.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;
import com.gss.inventory.inventory.infrastructure.persistence.entity.InventoryItemEntity;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaInventoryItemRepository implements InventoryItemRepository {

    private final SpringDataInventoryItemJpaRepository repository;

    public JpaInventoryItemRepository(SpringDataInventoryItemJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public InventoryItem save(InventoryItem item) {
        InventoryItemEntity saved = repository.save(toEntity(null, item));
        return toDomain(saved);
    }

    @Override
    public InventoryItem update(InventoryItem item) {
        InventoryItemEntity saved = repository.save(toEntity(item.id(), item));
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public List<InventoryItem> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<InventoryItem> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    private InventoryItemEntity toEntity(Long id, InventoryItem item) {
        return new InventoryItemEntity(id, item.name(), item.category(), item.description(),
            item.location(), item.totalQuantity(), item.availableQuantity());
    }

    private InventoryItem toDomain(InventoryItemEntity entity) {
        return new InventoryItem(entity.getId(), entity.getName(), entity.getCategory(),
            entity.getDescription(), entity.getLocation(), entity.getTotalQuantity(),
            entity.getAvailableQuantity());
    }
}
