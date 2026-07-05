package com.studyroom.reservation.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.studyroom.reservation.reservation.dto.ReservationResponse;
import com.studyroom.reservation.reservation.service.ReservationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AdminReservationController {

	private final ReservationService reservationService;

	@GetMapping("/api/admin/reservations")
	public ResponseEntity<List<ReservationResponse>> getReservations() {
		List<ReservationResponse> response = reservationService.getAllReservations();
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/api/admin/reservations/{reservationId}/approve")
	public ResponseEntity<ReservationResponse> approveReservation(@PathVariable Long reservationId) {
		ReservationResponse response = reservationService.approveReservation(reservationId);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/api/admin/reservations/{reservationId}/reject")
	public ResponseEntity<ReservationResponse> rejectReservation(@PathVariable Long reservationId) {
		ReservationResponse response = reservationService.rejectReservation(reservationId);
		return ResponseEntity.ok(response);
	}
}