package com.studyroom.reservation.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyroom.reservation.reservation.dto.ReservationProcessRequest;
import com.studyroom.reservation.reservation.dto.ReservationResponse;
import com.studyroom.reservation.reservation.service.ReservationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/reservations")
public class AdminReservationController {

	private final ReservationService reservationService;

	// 관리자 예약 전체 조회
	@GetMapping
	public ResponseEntity<List<ReservationResponse>> getAllReservations() {
		return ResponseEntity.ok(reservationService.getAllReservations());
	}

	// 관리자 예약 승인
	@PatchMapping("/{reservationId}/approve")
	public ResponseEntity<ReservationResponse> approveReservation(@PathVariable Long reservationId,
			@RequestBody(required = false) ReservationProcessRequest request) {
		String adminMemo = request != null ? request.getAdminMemo() : null;

		return ResponseEntity.ok(reservationService.approveReservation(reservationId, adminMemo));
	}

	// 관리자 예약 거절
	@PatchMapping("/{reservationId}/reject")
	public ResponseEntity<ReservationResponse> rejectReservation(@PathVariable Long reservationId,
			@RequestBody(required = false) ReservationProcessRequest request) {
		String adminMemo = request != null ? request.getAdminMemo() : null;

		return ResponseEntity.ok(reservationService.rejectReservation(reservationId, adminMemo));
	}
}