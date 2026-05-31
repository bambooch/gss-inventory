package com.gss.inventory.inventory.domain.repository;

import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;

public interface InventoryItemRepository {

    InventoryItem save(InventoryItem item);

    InventoryItem update(InventoryItem item);

    void deleteById(Long id);

    List<InventoryItem> findAll();

    Optional<InventoryItem> findById(Long id);
}
