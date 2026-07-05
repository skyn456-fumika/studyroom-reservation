package com.studyroom.reservation.user.dto;

import com.studyroom.reservation.user.entity.User;
import com.studyroom.reservation.user.type.UserRole;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserMeResponse {

	private Long id;
	private String email;
	private String name;
	private UserRole role;

	public static UserMeResponse from(User user) {
		return UserMeResponse.builder().id(user.getId()).email(user.getEmail()).name(user.getName()).role(user.getRole()).build();
	}
}