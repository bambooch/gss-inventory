package com.gss.inventory.inventory.infrastructure.persistence.repository;

import com.gss.inventory.inventory.infrastructure.persistence.entity.OrderEntity;

import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataOrderJpaRepository extends JpaRepository<OrderEntity, Long> {
}
