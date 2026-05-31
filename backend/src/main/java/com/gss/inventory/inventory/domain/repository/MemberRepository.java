package com.gss.inventory.inventory.domain.repository;

import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.records.Member;

public interface MemberRepository {

    Member save(Member member);

    Member update(Member member);

    void deleteById(Long id);

    Optional<Member> findById(Long id);

    List<Member> findAll();
}
