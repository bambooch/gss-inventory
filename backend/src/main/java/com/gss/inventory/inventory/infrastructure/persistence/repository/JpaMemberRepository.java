package com.gss.inventory.inventory.infrastructure.persistence.repository;

import java.util.List;
import java.util.Optional;

import com.gss.inventory.inventory.domain.model.records.Member;
import com.gss.inventory.inventory.domain.repository.MemberRepository;
import com.gss.inventory.inventory.infrastructure.persistence.entity.MemberEntity;

import org.springframework.stereotype.Repository;

@Repository
public class JpaMemberRepository implements MemberRepository {

    private final SpringDataMemberJpaRepository repository;

    public JpaMemberRepository(SpringDataMemberJpaRepository repository) {
        this.repository = repository;
    }

    @Override
    public Member save(Member member) {
        MemberEntity saved = repository.save(new MemberEntity(null, member.fullName(), member.phone(), member.team()));
        return toDomain(saved);
    }

    @Override
    public Member update(Member member) {
        MemberEntity saved = repository.save(
            new MemberEntity(member.id(), member.fullName(), member.phone(), member.team()));
        return toDomain(saved);
    }

    @Override
    public void deleteById(Long id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Member> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public List<Member> findAll() {
        return repository.findAll().stream().map(this::toDomain).toList();
    }

    private Member toDomain(MemberEntity entity) {
        return new Member(entity.getId(), entity.getFullName(), entity.getPhone(), entity.getTeam());
    }
}
