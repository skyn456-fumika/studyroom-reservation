package com.studyroom.reservation.reservation.dto;

import java.time.LocalTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AvailableTimeResponse {

	private LocalTime startTime;
	private LocalTime endTime;
	private boolean available;

	public static AvailableTimeResponse of(LocalTime startTime, LocalTime endTime, boolean available) {
		return AvailableTimeResponse.builder().startTime(startTime).endTime(endTime).available(available).build();
	}
}