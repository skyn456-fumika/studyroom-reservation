package com.studyroom.reservation.auth.dto;

import com.studyroom.reservation.user.entity.User;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SignupResponse {

	private Long id;
	private String email;
	private String name;

	public static SignupResponse from(User user) {
		return SignupResponse.builder().id(user.getId()).email(user.getEmail()).name(user.getName()).build();
	}
}