package com.gss.inventory.inventory.support;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

import com.gss.inventory.inventory.domain.model.records.Member;
import com.gss.inventory.inventory.domain.repository.MemberRepository;

public class InMemoryMemberRepository implements MemberRepository {

    private final List<Member> members = new ArrayList<>(List.of(
        new Member(1L, "Adnan Kovač", "+387 61 234 567", "Spasilački tim A"),
        new Member(2L, "Emina Spahić", "+387 62 345 678", "Spasilački tim A")
    ));
    private final AtomicLong idSequence = new AtomicLong(3);

    @Override
    public Member save(Member member) {
        Member saved = new Member(idSequence.getAndIncrement(), member.fullName(), member.phone(), member.team());
        members.add(saved);
        return saved;
    }

    @Override
    public Member update(Member member) {
        members.removeIf(m -> m.id().equals(member.id()));
        members.add(member);
        return member;
    }

    @Override
    public void deleteById(Long id) {
        members.removeIf(m -> m.id().equals(id));
    }

    @Override
    public Optional<Member> findById(Long id) {
        return members.stream().filter(m -> m.id().equals(id)).findFirst();
    }

    @Override
    public List<Member> findAll() {
        return members;
    }
}
