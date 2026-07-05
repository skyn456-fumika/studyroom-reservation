package com.studyroom.reservation.reservation.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReservationCreateRequest {

	@NotNull(message = "공간 ID는 필수입니다.")
	private Long roomId;

	@NotNull(message = "예약 날짜는 필수입니다.")
	@FutureOrPresent(message = "예약 날짜는 오늘 또는 미래 날짜여야 합니다.")
	private LocalDate reservationDate;

	@NotNull(message = "시작 시간은 필수입니다.")
	private LocalTime startTime;

	@NotNull(message = "종료 시간은 필수입니다.")
	private LocalTime endTime;
}