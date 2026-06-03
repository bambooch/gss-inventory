package com.gss.inventory.inventory.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "item_images")
public class ItemImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected ItemImageEntity() {
    }

    public ItemImageEntity(Long id, String filePath, int sortOrder) {
        this.id = id;
        this.filePath = filePath;
        this.sortOrder = sortOrder;
    }

    public Long getId() {
        return id;
    }

    public String getFilePath() {
        return filePath;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
