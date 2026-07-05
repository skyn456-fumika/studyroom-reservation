package com.studyroom.reservation.reservation.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.studyroom.reservation.reservation.dto.ReservationCreateRequest;
import com.studyroom.reservation.reservation.dto.ReservationResponse;
import com.studyroom.reservation.reservation.service.ReservationService;
import com.studyroom.reservation.security.CustomUserDetails;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ReservationController {

	private final ReservationService reservationService;

	@PostMapping("/api/reservations")
	public ResponseEntity<ReservationResponse> createReservation(@AuthenticationPrincipal CustomUserDetails userDetails,
			@Valid @RequestBody ReservationCreateRequest request) {
		ReservationResponse response = reservationService.createReservation(userDetails.getId(), request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@GetMapping("/api/reservations/me")
	public ResponseEntity<List<ReservationResponse>> getMyReservations(@AuthenticationPrincipal CustomUserDetails userDetails) {
		List<ReservationResponse> response = reservationService.getMyReservations(userDetails.getId());
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/api/reservations/{reservationId}/cancel")
	public ResponseEntity<ReservationResponse> cancelReservation(@AuthenticationPrincipal CustomUserDetails userDetails,
			@PathVariable Long reservationId) {
		ReservationResponse response = reservationService.cancelReservation(userDetails.getId(), reservationId);

		return ResponseEntity.ok(response);
	}
}