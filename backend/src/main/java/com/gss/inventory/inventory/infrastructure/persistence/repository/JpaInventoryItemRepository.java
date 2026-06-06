package com.gss.inventory.inventory.infrastructure.persistence.repository;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;
import com.gss.inventory.inventory.infrastructure.persistence.entity.InventoryItemEntity;
import com.gss.inventory.inventory.infrastructure.persistence.entity.ItemCategoryEntity;
import com.gss.inventory.inventory.infrastructure.persistence.entity.ItemImageEntity;

import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Repository
@Primary
public class JpaInventoryItemRepository implements InventoryItemRepository {

    private final SpringDataInventoryItemJpaRepository repository;
    private final SpringDataItemCategoryJpaRepository categoryRepository;

    public JpaInventoryItemRepository(SpringDataInventoryItemJpaRepository repository,
            SpringDataItemCategoryJpaRepository categoryRepository) {
        this.repository = repository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public InventoryItem save(InventoryItem item) {
        InventoryItemEntity entity = new InventoryItemEntity(null, item.name(),
            item.description(), item.location(), item.totalQuantity(), item.availableQuantity());
        entity.setCategories(resolveEntities(item.categories()));
        return toDomain(repository.save(entity));
    }

    @Override
    public InventoryItem update(InventoryItem item) {
        InventoryItemEntity entity = repository.findById(item.id()).orElseThrow();
        entity.setName(item.name());
        entity.setDescription(item.description());
        entity.setLocation(item.location());
        entity.setTotalQuantity(item.totalQuantity());
        entity.setAvailableQuantity(item.availableQuantity());
        entity.setCategories(resolveEntities(item.categories()));
        return toDomain(repository.save(entity));
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

    @Override
    public InventoryItem addImages(Long itemId, List<String> filePaths) {
        InventoryItemEntity entity = repository.findById(itemId).orElseThrow();
        int nextOrder = entity.getImages().size();
        for (String path : filePaths) {
            entity.getImages().add(new ItemImageEntity(null, path, nextOrder++));
        }
        return toDomain(repository.save(entity));
    }

    @Override
    public Optional<String> removeImage(Long itemId, Long imageId) {
        return repository.findById(itemId).flatMap(entity -> {
            Optional<ItemImageEntity> found = entity.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst();
            found.ifPresent(img -> {
                entity.getImages().remove(img);
                repository.save(entity);
            });
            return found.map(ItemImageEntity::getFilePath);
        });
    }

    private Set<ItemCategoryEntity> resolveEntities(List<InventoryItem.Category> categories) {
        if (categories == null || categories.isEmpty()) return new LinkedHashSet<>();
        List<Long> ids = categories.stream().map(InventoryItem.Category::id).toList();
        return categoryRepository.findAllById(ids).stream()
            .collect(Collectors.toCollection(LinkedHashSet::new));
    }

    private InventoryItem toDomain(InventoryItemEntity entity) {
        List<InventoryItem.Category> categories = entity.getCategories().stream()
            .map(c -> new InventoryItem.Category(c.getId(), c.getName(), c.getLabel()))
            .toList();
        List<InventoryItem.Image> images = entity.getImages().stream()
            .map(img -> new InventoryItem.Image(img.getId(), "/api/uploads/" + img.getFilePath()))
            .toList();
        return new InventoryItem(entity.getId(), entity.getName(), categories,
            entity.getDescription(), entity.getLocation(), entity.getTotalQuantity(),
            entity.getAvailableQuantity(), images);
    }
}
