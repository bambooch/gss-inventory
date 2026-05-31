package com.gss.inventory.api.dto.member;

import jakarta.validation.constraints.NotBlank;

public record CreateMemberRequest(@NotBlank String fullName, String phone, String team) {
}
