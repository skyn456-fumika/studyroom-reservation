package com.studyroom.reservation.room.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.studyroom.reservation.reservation.dto.AvailableTimeResponse;
import com.studyroom.reservation.reservation.dto.RoomReservationResponse;
import com.studyroom.reservation.reservation.service.ReservationService;
import com.studyroom.reservation.room.dto.RoomResponse;
import com.studyroom.reservation.room.service.RoomService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class RoomController {

	private final RoomService roomService;
	private final ReservationService reservationService;

	@GetMapping("/api/rooms")
	public ResponseEntity<List<RoomResponse>> getRooms() {
		List<RoomResponse> response = roomService.getActiveRooms();
		return ResponseEntity.ok(response);
	}

	@GetMapping("/api/rooms/{roomId}")
	public ResponseEntity<RoomResponse> getRoom(@PathVariable Long roomId) {
		RoomResponse response = roomService.getRoom(roomId);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/api/rooms/{roomId}/reservations")
	public ResponseEntity<List<RoomReservationResponse>> getRoomReservations(@PathVariable Long roomId,
			@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		List<RoomReservationResponse> response = reservationService.getRoomReservations(roomId, date);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/api/rooms/{roomId}/available-times")
	public ResponseEntity<List<AvailableTimeResponse>> getAvailableTimes(@PathVariable Long roomId,
			@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
		List<AvailableTimeResponse> response = reservationService.getAvailableTimes(roomId, date);
		return ResponseEntity.ok(response);
	}
}