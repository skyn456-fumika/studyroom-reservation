package com.studyroom.reservation.auth.dto;

import com.studyroom.reservation.user.entity.User;
import com.studyroom.reservation.user.type.UserRole;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

	private String accessToken;
	private String tokenType;

	private Long userId;
	private String email;
	private String name;
	private UserRole role;

	public static LoginResponse of(String accessToken, User user) {
		return LoginResponse.builder().accessToken(accessToken).tokenType("Bearer").userId(user.getId()).email(user.getEmail()).name(user.getName())
				.role(user.getRole()).build();
	}
}