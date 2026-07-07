package com.studyroom.reservation.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenRefreshResponse {

	private String accessToken;
	private String tokenType;
}