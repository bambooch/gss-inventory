package com.gss.inventory.inventory.application;

import java.util.ArrayList;
import java.util.List;

import com.gss.inventory.inventory.domain.exception.ImageNotFoundException;
import com.gss.inventory.inventory.domain.exception.InventoryItemNotFoundException;
import com.gss.inventory.inventory.domain.model.enums.ItemCategory;
import com.gss.inventory.inventory.domain.model.records.InventoryItem;
import com.gss.inventory.inventory.domain.repository.InventoryItemRepository;
import com.gss.inventory.inventory.infrastructure.ImageStorageService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class InventoryItemService {

    private final InventoryItemRepository itemRepository;
    private final ImageStorageService storageService;

    public InventoryItemService(InventoryItemRepository itemRepository, ImageStorageService storageService) {
        this.itemRepository = itemRepository;
        this.storageService = storageService;
    }

    public InventoryItem createItem(String name, ItemCategory category, String description,
            String location, int totalQuantity) {
        return itemRepository.save(
            new InventoryItem(null, name, category, description, location, totalQuantity, totalQuantity, List.of()));
    }

    public InventoryItem updateItem(Long id, String name, ItemCategory category, String description,
            String location, int totalQuantity) {
        InventoryItem existing = findById(id);
        int inUse = existing.totalQuantity() - existing.availableQuantity();
        int newAvailable = Math.max(totalQuantity - inUse, 0);
        return itemRepository.update(
            new InventoryItem(id, name, category, description, location, totalQuantity, newAvailable, List.of()));
    }

    public void deleteItem(Long id) {
        itemRepository.deleteById(id);
    }

    public List<InventoryItem> findItems(ItemCategory category) {
        return itemRepository.findAll().stream()
            .filter(item -> category == null || item.category() == category)
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
