package com.gss.inventory.api.dto.member;

import jakarta.validation.constraints.NotBlank;

public record UpdateMemberRequest(@NotBlank String fullName, String phone, String team) {
}
