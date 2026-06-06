package com.gss.inventory.inventory.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.infrastructure.persistence.entity.ItemCategoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataItemCategoryJpaRepository extends JpaRepository<ItemCategoryEntity, Long> {
    List<ItemCategoryEntity> findAllByOrderBySortOrderAsc();
    Optional<ItemCategoryEntity> findByName(String name);
}
