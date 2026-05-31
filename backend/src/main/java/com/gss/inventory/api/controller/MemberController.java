package com.gss.inventory.api.controller;

import java.util.List;

import com.gss.inventory.api.dto.member.CreateMemberRequest;
import com.gss.inventory.api.dto.member.MemberResponse;
import com.gss.inventory.api.dto.member.UpdateMemberRequest;
import com.gss.inventory.inventory.application.MemberService;
import com.gss.inventory.inventory.domain.model.records.Member;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Members")
@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @Operation(summary = "List all members")
    @GetMapping
    public List<MemberResponse> getMembers() {
        return memberService.findAll().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Get a member by ID")
    @GetMapping("/{id}")
    public MemberResponse getMember(@PathVariable Long id) {
        return toResponse(memberService.findById(id));
    }

    @Operation(summary = "Create a member")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberResponse createMember(@Valid @RequestBody CreateMemberRequest request) {
        return toResponse(memberService.createMember(request.fullName(), request.phone(), request.team()));
    }

    @Operation(summary = "Update a member")
    @PutMapping("/{id}")
    public MemberResponse updateMember(@PathVariable Long id, @Valid @RequestBody UpdateMemberRequest request) {
        return toResponse(memberService.updateMember(id, request.fullName(), request.phone(), request.team()));
    }

    @Operation(summary = "Delete a member")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMember(@PathVariable Long id) {
        memberService.deleteMember(id);
    }

    private MemberResponse toResponse(Member member) {
        return new MemberResponse(member.id(), member.fullName(), member.phone(), member.team());
    }
}
