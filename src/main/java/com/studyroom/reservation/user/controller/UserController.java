package com.studyroom.reservation.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyroom.reservation.security.CustomUserDetails;
import com.studyroom.reservation.user.dto.UserMeResponse;

@RestController
public class UserController {

	@GetMapping("/api/users/me")
	public ResponseEntity<UserMeResponse> me(@AuthenticationPrincipal CustomUserDetails userDetails) {
		return ResponseEntity.ok(UserMeResponse.from(userDetails.getUser()));
	}
}