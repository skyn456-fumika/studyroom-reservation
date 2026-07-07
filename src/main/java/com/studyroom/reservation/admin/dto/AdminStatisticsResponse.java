package com.studyroom.reservation.admin.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class AdminStatisticsResponse {

	private long totalRooms;
	private long activeRooms;
	private long inactiveRooms;

	private long totalReservations;
	private long pendingReservations;
	private long approvedReservations;
	private long rejectedReservations;
	private long canceledReservations;

	private long totalRevenue;
}