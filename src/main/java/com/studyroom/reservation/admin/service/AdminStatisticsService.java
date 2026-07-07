package com.studyroom.reservation.admin.service;

import java.time.Duration;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyroom.reservation.admin.dto.AdminStatisticsResponse;
import com.studyroom.reservation.reservation.entity.Reservation;
import com.studyroom.reservation.reservation.repository.ReservationRepository;
import com.studyroom.reservation.reservation.type.ReservationStatus;
import com.studyroom.reservation.room.entity.Room;
import com.studyroom.reservation.room.repository.RoomRepository;
import com.studyroom.reservation.room.type.RoomStatus;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminStatisticsService {

	private final RoomRepository roomRepository;
	private final ReservationRepository reservationRepository;

	public AdminStatisticsResponse getStatistics() {
		List<Room> rooms = roomRepository.findAll();
		List<Reservation> reservations = reservationRepository.findAll();

		long totalRooms = rooms.size();
		long activeRooms = rooms.stream().filter(room -> room.getStatus() == RoomStatus.ACTIVE).count();
		long inactiveRooms = rooms.stream().filter(room -> room.getStatus() == RoomStatus.INACTIVE).count();

		long totalReservations = reservations.size();
		long pendingReservations = countReservationsByStatus(reservations, ReservationStatus.PENDING);
		long approvedReservations = countReservationsByStatus(reservations, ReservationStatus.APPROVED);
		long rejectedReservations = countReservationsByStatus(reservations, ReservationStatus.REJECTED);
		long canceledReservations = countReservationsByStatus(reservations, ReservationStatus.CANCELED);

		long totalRevenue = reservations.stream().filter(reservation -> reservation.getStatus() == ReservationStatus.APPROVED)
				.mapToLong(this::calculateReservationPrice).sum();

		return AdminStatisticsResponse.builder().totalRooms(totalRooms).activeRooms(activeRooms).inactiveRooms(inactiveRooms)
				.totalReservations(totalReservations).pendingReservations(pendingReservations).approvedReservations(approvedReservations)
				.rejectedReservations(rejectedReservations).canceledReservations(canceledReservations).totalRevenue(totalRevenue).build();
	}

	private long countReservationsByStatus(List<Reservation> reservations, ReservationStatus status) {
		return reservations.stream().filter(reservation -> reservation.getStatus() == status).count();
	}

	private long calculateReservationPrice(Reservation reservation) {
		long hours = Duration.between(reservation.getStartTime(), reservation.getEndTime()).toHours();

		return hours * reservation.getRoom().getHourlyPrice();
	}
}