package com.studyroom.reservation.reservation.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyroom.reservation.reservation.dto.AvailableTimeResponse;
import com.studyroom.reservation.reservation.dto.ReservationCreateRequest;
import com.studyroom.reservation.reservation.dto.ReservationResponse;
import com.studyroom.reservation.reservation.dto.RoomReservationResponse;
import com.studyroom.reservation.reservation.entity.Reservation;
import com.studyroom.reservation.reservation.repository.ReservationRepository;
import com.studyroom.reservation.reservation.type.ReservationStatus;
import com.studyroom.reservation.room.entity.Room;
import com.studyroom.reservation.room.repository.RoomRepository;
import com.studyroom.reservation.room.type.RoomStatus;
import com.studyroom.reservation.user.entity.User;
import com.studyroom.reservation.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

	private final ReservationRepository reservationRepository;
	private final RoomRepository roomRepository;
	private final UserRepository userRepository;

	public ReservationResponse createReservation(Long userId, ReservationCreateRequest request) {
		User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

		Room room = roomRepository.findById(request.getRoomId()).orElseThrow(() -> new IllegalArgumentException("공간을 찾을 수 없습니다."));

		validateRoomActive(room);
		validateReservationTime(room, request.getReservationDate(), request.getStartTime(), request.getEndTime());
		validateNoOverlap(room.getId(), request.getReservationDate(), request.getStartTime(), request.getEndTime());

		Reservation reservation = Reservation.builder().user(user).room(room).reservationDate(request.getReservationDate())
				.startTime(request.getStartTime()).endTime(request.getEndTime()).status(ReservationStatus.PENDING).build();

		Reservation savedReservation = reservationRepository.save(reservation);

		return ReservationResponse.from(savedReservation);
	}

	private void validateRoomActive(Room room) {
		if (room.getStatus() != RoomStatus.ACTIVE) {
			throw new IllegalArgumentException("예약 가능한 공간이 아닙니다.");
		}
	}

	private void validateReservationTime(Room room, LocalDate reservationDate, LocalTime startTime, LocalTime endTime) {
		if (!startTime.isBefore(endTime)) {
			throw new IllegalArgumentException("시작 시간은 종료 시간보다 빨라야 합니다.");
		}

		LocalTime openTime = LocalTime.of(room.getOpenHour(), 0);
		LocalTime closeTime = LocalTime.of(room.getCloseHour(), 0);

		if (startTime.isBefore(openTime) || endTime.isAfter(closeTime)) {
			throw new IllegalArgumentException("예약 시간이 공간 운영 시간 범위를 벗어났습니다.");
		}

		if (reservationDate.isEqual(LocalDate.now()) && startTime.isBefore(LocalTime.now())) {
			throw new IllegalArgumentException("지난 시간으로는 예약할 수 없습니다.");
		}
	}

	@Transactional(readOnly = true)
	public List<ReservationResponse> getMyReservations(Long userId) {
		return reservationRepository.findByUserIdOrderByReservationDateDescStartTimeDesc(userId).stream().map(ReservationResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public List<ReservationResponse> getAllReservations() {
		return reservationRepository.findAllByOrderByReservationDateDescStartTimeDesc().stream().map(ReservationResponse::from).toList();
	}

	public ReservationResponse approveReservation(Long reservationId) {
		Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

		reservation.approve();

		return ReservationResponse.from(reservation);
	}

	public ReservationResponse rejectReservation(Long reservationId) {
		Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

		reservation.reject();

		return ReservationResponse.from(reservation);
	}

	private void validateNoOverlap(Long roomId, LocalDate reservationDate, LocalTime startTime, LocalTime endTime) {
		boolean exists = reservationRepository.existsOverlappingReservation(roomId, reservationDate, startTime, endTime);

		if (exists) {
			throw new IllegalArgumentException("이미 예약된 시간대입니다.");
		}
	}

	public ReservationResponse cancelReservation(Long userId, Long reservationId) {
		Reservation reservation = reservationRepository.findById(reservationId).orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

		reservation.cancel(userId);

		return ReservationResponse.from(reservation);
	}

	@Transactional(readOnly = true)
	public List<RoomReservationResponse> getRoomReservations(Long roomId, LocalDate date) {
		roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("공간을 찾을 수 없습니다."));

		return reservationRepository.findRoomReservationsByDate(roomId, date).stream().map(RoomReservationResponse::from).toList();
	}

	@Transactional(readOnly = true)
	public List<AvailableTimeResponse> getAvailableTimes(Long roomId, LocalDate date) {
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("공간을 찾을 수 없습니다."));

		List<Reservation> reservations = reservationRepository.findRoomReservationsByDate(roomId, date);

		List<AvailableTimeResponse> result = new ArrayList<>();

		LocalTime current = LocalTime.of(room.getOpenHour(), 0);
		LocalTime closeTime = LocalTime.of(room.getCloseHour(), 0);

		while (current.isBefore(closeTime)) {
			LocalTime slotStart = current;
			LocalTime slotEnd = current.plusHours(1);

			boolean overlapped = reservations.stream()
					.anyMatch(reservation -> reservation.getStartTime().isBefore(slotEnd) && reservation.getEndTime().isAfter(slotStart));

			boolean pastTime = date.isEqual(LocalDate.now()) && slotStart.isBefore(LocalTime.now());

			boolean available = !overlapped && !pastTime && room.getStatus() == RoomStatus.ACTIVE;

			result.add(AvailableTimeResponse.of(slotStart, slotEnd, available));

			current = slotEnd;
		}

		return result;
	}
}