package com.gss.inventory.inventory.domain.repository;

import java.util.List;

import com.gss.inventory.inventory.domain.model.records.InventoryItem;

public interface ItemCategoryRepository {
    List<InventoryItem.Category> findAll();
    List<InventoryItem.Category> findAllByIds(List<Long> ids);
}
