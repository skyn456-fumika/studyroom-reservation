package com.studyroom.reservation.reservation.dto;

import java.time.LocalTime;

import com.studyroom.reservation.reservation.entity.Reservation;
import com.studyroom.reservation.reservation.type.ReservationStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomReservationResponse {

	private Long id;
	private LocalTime startTime;
	private LocalTime endTime;
	private ReservationStatus status;

	public static RoomReservationResponse from(Reservation reservation) {
		return RoomReservationResponse.builder().id(reservation.getId()).startTime(reservation.getStartTime()).endTime(reservation.getEndTime())
				.status(reservation.getStatus()).build();
	}
}