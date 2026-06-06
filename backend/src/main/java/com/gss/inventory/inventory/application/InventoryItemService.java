package com.gss.inventory.inventory.application;

import java.util.ArrayList;
import java.util.List;

import com.gss.inventory.inventory.domain.exception.ImageNotFoundException;
import com.gss.inventory.inventory.domain.exception.InventoryItemNotFoundException;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;
import com.gss.inventory.inventory.domain.repository.ItemCategoryRepository;
import com.gss.inventory.inventory.infrastructure.ImageStorageService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InventoryItemService {

    private final InventoryItemRepository itemRepository;
    private final ItemCategoryRepository categoryRepository;
    private final ImageStorageService storageService;

    public InventoryItemService(InventoryItemRepository itemRepository,
            ItemCategoryRepository categoryRepository,
            ImageStorageService storageService) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.storageService = storageService;
    }

    public InventoryItem createItem(String name, List<Long> categoryIds, String description,
            String location, int totalQuantity) {
        List<InventoryItem.Category> categories = categoryRepository.findAllByIds(categoryIds);
        return itemRepository.save(
            new InventoryItem(null, name, categories, description, location, totalQuantity, totalQuantity, List.of()));
    }

    public InventoryItem updateItem(Long id, String name, List<Long> categoryIds, String description,
            String location, int totalQuantity) {
        InventoryItem existing = findById(id);
        int inUse = existing.totalQuantity() - existing.availableQuantity();
        int newAvailable = Math.max(totalQuantity - inUse, 0);
        List<InventoryItem.Category> categories = categoryRepository.findAllByIds(categoryIds);
        return itemRepository.update(
            new InventoryItem(id, name, categories, description, location, totalQuantity, newAvailable, List.of()));
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public List<InventoryItem> findItems(String categoryName) {
        return itemRepository.findAll().stream()
            .filter(item -> categoryName == null || item.categories().stream()
                .anyMatch(c -> c.name().equals(categoryName)))
            .toList();
    }

    public InventoryItem findById(Long id) {
        return itemRepository.findById(id)
            .orElseThrow(() -> new InventoryItemNotFoundException(id));
    }

    public InventoryItem uploadImages(Long itemId, List<MultipartFile> files) {
        findById(itemId);
        List<String> paths = new ArrayList<>();
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                paths.add(storageService.store(itemId, file));
            }
        }
        return itemRepository.addImages(itemId, paths);
    }

    public InventoryItem deleteImage(Long itemId, Long imageId) {
        String filePath = itemRepository.removeImage(itemId, imageId)
            .orElseThrow(() -> new ImageNotFoundException(imageId));
        storageService.delete(filePath);
        return findById(itemId);
    }
}
