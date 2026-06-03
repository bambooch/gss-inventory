package com.gss.inventory.inventory.infrastructure.persistence.entity;

import java.util.ArrayList;
import java.util.List;

import com.gss.inventory.inventory.domain.model.enums.ItemCategory;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

@Entity
@Table(name = "inventory_items")
public class InventoryItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemCategory category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(name = "total_quantity", nullable = false)
    private int totalQuantity;

    @Column(name = "available_quantity", nullable = false)
    private int availableQuantity;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id")
    @OrderBy("sortOrder ASC")
    private List<ItemImageEntity> images = new ArrayList<>();

    protected InventoryItemEntity() {
    }

    public InventoryItemEntity(Long id, String name, ItemCategory category, String description,
            String location, int totalQuantity, int availableQuantity) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.location = location;
        this.totalQuantity = totalQuantity;
        this.availableQuantity = availableQuantity;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public ItemCategory getCategory() { return category; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public int getTotalQuantity() { return totalQuantity; }
    public int getAvailableQuantity() { return availableQuantity; }
    public List<ItemImageEntity> getImages() { return images; }

    public void setName(String name) { this.name = name; }
    public void setCategory(ItemCategory category) { this.category = category; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setTotalQuantity(int totalQuantity) { this.totalQuantity = totalQuantity; }
    public void setAvailableQuantity(int availableQuantity) { this.availableQuantity = availableQuantity; }
}
