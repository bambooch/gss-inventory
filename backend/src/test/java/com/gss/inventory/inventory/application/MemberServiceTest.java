package com.gss.inventory.inventory.application;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.gss.inventory.inventory.domain.exception.MemberNotFoundException;
import com.gss.inventory.inventory.domain.model.records.Member;
import com.gss.inventory.inventory.domain.repository.MemberRepository;

import org.junit.jupiter.api.Test;

class MemberServiceTest {

    private final MemberRepository memberRepository = mock(MemberRepository.class);
    private final MemberService service = new MemberService(memberRepository);

    @Test
    void createMemberPersistsAndReturns() {
        Member expected = new Member(1L, "Adnan Kovač", "+387 61 234 567", "Tim A");
        when(memberRepository.save(any())).thenReturn(expected);

        Member result = service.createMember("Adnan Kovač", "+387 61 234 567", "Tim A");

        assertThat(result.fullName()).isEqualTo("Adnan Kovač");
        verify(memberRepository).save(any());
    }

    @Test
    void findByIdReturnsMember() {
        Member expected = new Member(1L, "Adnan Kovač", "+387 61 234 567", "Tim A");
        when(memberRepository.findById(1L)).thenReturn(Optional.of(expected));

        assertThat(service.findById(1L).fullName()).isEqualTo("Adnan Kovač");
    }

    @Test
    void findByIdThrowsForMissingMember() {
        when(memberRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.findById(99L))
            .isInstanceOf(MemberNotFoundException.class);
    }
}
