package com.gss.inventory.inventory.infrastructure.persistence.repository;

import com.gss.inventory.inventory.infrastructure.persistence.entity.InventoryItemEntity;

import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataInventoryItemJpaRepository extends JpaRepository<InventoryItemEntity, Long> {
}
