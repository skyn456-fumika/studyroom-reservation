package com.studyroom.reservation.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.studyroom.reservation.reservation.entity.Reservation;
import com.studyroom.reservation.reservation.type.ReservationStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ReservationResponse {

	private Long id;

	private Long roomId;
	private String roomName;

	private Long userId;
	private String userName;

	private LocalDate reservationDate;
	private LocalTime startTime;
	private LocalTime endTime;

	private ReservationStatus status;

	public static ReservationResponse from(Reservation reservation) {
		return ReservationResponse.builder().id(reservation.getId()).roomId(reservation.getRoom().getId()).roomName(reservation.getRoom().getName())
				.userId(reservation.getUser().getId()).userName(reservation.getUser().getName()).reservationDate(reservation.getReservationDate())
				.startTime(reservation.getStartTime()).endTime(reservation.getEndTime()).status(reservation.getStatus()).build();
	}
}