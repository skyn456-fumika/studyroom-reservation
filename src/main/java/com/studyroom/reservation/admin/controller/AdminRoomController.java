package com.studyroom.reservation.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.studyroom.reservation.room.dto.RoomCreateRequest;
import com.studyroom.reservation.room.dto.RoomImageUploadResponse;
import com.studyroom.reservation.room.dto.RoomResponse;
import com.studyroom.reservation.room.dto.RoomUpdateRequest;
import com.studyroom.reservation.room.service.RoomImageService;
import com.studyroom.reservation.room.service.RoomService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/rooms")
public class AdminRoomController {

	private final RoomService roomService;
	private final RoomImageService roomImageService;

	@GetMapping
	public ResponseEntity<List<RoomResponse>> getRooms() {
		List<RoomResponse> response = roomService.getAllRooms();
		return ResponseEntity.ok(response);
	}

	@PostMapping
	public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomCreateRequest request) {
		RoomResponse response = roomService.createRoom(request);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	@PostMapping("/images")
	public ResponseEntity<RoomImageUploadResponse> uploadRoomImage(@RequestParam("file") MultipartFile file) {
		String imageUrl = roomImageService.uploadRoomImage(file);
		return ResponseEntity.ok(new RoomImageUploadResponse(imageUrl));
	}

	@PutMapping("/{roomId}")
	public ResponseEntity<RoomResponse> updateRoom(@PathVariable Long roomId, @Valid @RequestBody RoomUpdateRequest request) {
		RoomResponse response = roomService.updateRoom(roomId, request);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/{roomId}/active")
	public ResponseEntity<RoomResponse> activateRoom(@PathVariable Long roomId) {
		RoomResponse response = roomService.activateRoom(roomId);
		return ResponseEntity.ok(response);
	}

	@PatchMapping("/{roomId}/inactive")
	public ResponseEntity<RoomResponse> deactivateRoom(@PathVariable Long roomId) {
		RoomResponse response = roomService.deactivateRoom(roomId);
		return ResponseEntity.ok(response);
	}
}