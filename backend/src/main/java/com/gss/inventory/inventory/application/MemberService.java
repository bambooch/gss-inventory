package com.gss.inventory.inventory.application;

import java.util.List;

import com.gss.inventory.inventory.domain.exception.MemberNotFoundException;
import com.gss.inventory.inventory.domain.model.records.Member;
import com.gss.inventory.inventory.domain.repository.MemberRepository;

import org.springframework.stereotype.Service;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member createMember(String fullName, String phone, String team) {
        return memberRepository.save(new Member(null, fullName, phone, team));
    }

    public Member updateMember(Long id, String fullName, String phone, String team) {
        findById(id);
        return memberRepository.update(new Member(id, fullName, phone, team));
    }

    public void deleteMember(Long id) {
        memberRepository.deleteById(id);
    }

    public Member findById(Long id) {
        return memberRepository.findById(id)
            .orElseThrow(() -> new MemberNotFoundException(id));
    }

    public List<Member> findAll() {
        return memberRepository.findAll();
    }
}
