package com.gss.inventory.inventory.infrastructure.persistence.repository;

import com.gss.inventory.inventory.infrastructure.persistence.entity.MemberEntity;

import org.springframework.data.jpa.repository.JpaRepository;

interface SpringDataMemberJpaRepository extends JpaRepository<MemberEntity, Long> {
}
