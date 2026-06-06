package com.gss.inventory.inventory.infrastructure.persistence.entity;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "inventory_item_categories",
        joinColumns = @JoinColumn(name = "item_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    @OrderBy("sortOrder ASC")
    private Set<ItemCategoryEntity> categories = new LinkedHashSet<>();

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

    protected InventoryItemEntity() {}

    public InventoryItemEntity(Long id, String name, String description,
            String location, int totalQuantity, int availableQuantity) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.totalQuantity = totalQuantity;
        this.availableQuantity = availableQuantity;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Set<ItemCategoryEntity> getCategories() { return categories; }
    public String getDescription() { return description; }
    public String getLocation() { return location; }
    public int getTotalQuantity() { return totalQuantity; }
    public int getAvailableQuantity() { return availableQuantity; }
    public List<ItemImageEntity> getImages() { return images; }

    public void setName(String name) { this.name = name; }
    public void setCategories(Set<ItemCategoryEntity> categories) { this.categories = categories; }
    public void setDescription(String description) { this.description = description; }
    public void setLocation(String location) { this.location = location; }
    public void setTotalQuantity(int totalQuantity) { this.totalQuantity = totalQuantity; }
    public void setAvailableQuantity(int availableQuantity) { this.availableQuantity = availableQuantity; }
}
