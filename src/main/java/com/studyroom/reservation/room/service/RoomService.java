package com.studyroom.reservation.room.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyroom.reservation.common.exception.BusinessException;
import com.studyroom.reservation.common.exception.ErrorCode;
import com.studyroom.reservation.room.dto.RoomCreateRequest;
import com.studyroom.reservation.room.dto.RoomResponse;
import com.studyroom.reservation.room.dto.RoomUpdateRequest;
import com.studyroom.reservation.room.entity.Room;
import com.studyroom.reservation.room.repository.RoomRepository;
import com.studyroom.reservation.room.type.RoomStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomService {

	private final RoomRepository roomRepository;

	public RoomResponse createRoom(RoomCreateRequest request) {
		validateOperatingHours(request.getOpenHour(), request.getCloseHour());

		Room room = Room.builder().name(request.getName()).description(request.getDescription()).location(request.getLocation())
				.capacity(request.getCapacity()).hourlyPrice(request.getHourlyPrice()).openHour(request.getOpenHour())
				.closeHour(request.getCloseHour()).status(RoomStatus.ACTIVE).build();

		Room savedRoom = roomRepository.save(room);

		return RoomResponse.from(savedRoom);
	}

	@Transactional(readOnly = true)
	public List<RoomResponse> getActiveRooms() {
		return roomRepository.findByStatusOrderByIdDesc(RoomStatus.ACTIVE).stream().map(RoomResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public RoomResponse getRoom(Long roomId) {
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		if (room.getStatus() != RoomStatus.ACTIVE) {
			throw new BusinessException(ErrorCode.ROOM_INACTIVE);
		}

		return RoomResponse.from(room);
	}

	private void validateOperatingHours(int openHour, int closeHour) {
		if (openHour >= closeHour) {
			throw new BusinessException(ErrorCode.INVALID_ROOM_TIME);
		}
	}

	public RoomResponse updateRoom(Long roomId, RoomUpdateRequest request) {
		validateOperatingHours(request.getOpenHour(), request.getCloseHour());

		Room room = roomRepository.findById(roomId).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		room.update(request.getName(), request.getDescription(), request.getLocation(), request.getCapacity(), request.getHourlyPrice(),
				request.getOpenHour(), request.getCloseHour());

		return RoomResponse.from(room);
	}

	public RoomResponse activateRoom(Long roomId) {
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		room.activate();

		return RoomResponse.from(room);
	}

	public RoomResponse deactivateRoom(Long roomId) {
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new BusinessException(ErrorCode.ROOM_NOT_FOUND));

		room.deactivate();

		return RoomResponse.from(room);
	}

	@Transactional(readOnly = true)
	public List<RoomResponse> getAllRooms() {
		return roomRepository.findAllByOrderByIdDesc().stream().map(RoomResponse::from).toList();
	}
}