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

    /** Appends images (file paths relative to upload root) and returns the updated item. */
    InventoryItem addImages(Long itemId, List<String> filePaths);

    /**
     * Removes the image with the given id from the item.
     * Returns the stored file path so the caller can clean up the file, or empty if not found.
     */
    Optional<String> removeImage(Long itemId, Long imageId);
}
