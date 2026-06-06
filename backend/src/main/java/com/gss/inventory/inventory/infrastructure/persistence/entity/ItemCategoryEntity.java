package com.gss.inventory.inventory.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "item_categories")
public class ItemCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private String label;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected ItemCategoryEntity() {}

    public ItemCategoryEntity(Long id, String name, String label, int sortOrder) {
        this.id = id;
        this.name = name;
        this.label = label;
        this.sortOrder = sortOrder;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getLabel() { return label; }
    public int getSortOrder() { return sortOrder; }

    public void setName(String name) { this.name = name; }
    public void setLabel(String label) { this.label = label; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
