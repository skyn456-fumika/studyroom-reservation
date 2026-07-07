package com.studyroom.reservation.room.dto;

import com.studyroom.reservation.room.entity.Room;
import com.studyroom.reservation.room.type.RoomStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RoomResponse {

	private Long id;
	private String name;
	private String description;
	private String location;
	private int capacity;
	private int hourlyPrice;
	private int openHour;
	private int closeHour;
	private RoomStatus status;
	private String imageUrl;

	public static RoomResponse from(Room room) {
		return RoomResponse.builder().id(room.getId()).name(room.getName()).description(room.getDescription()).location(room.getLocation())
				.capacity(room.getCapacity()).hourlyPrice(room.getHourlyPrice()).openHour(room.getOpenHour()).closeHour(room.getCloseHour())
				.status(room.getStatus()).imageUrl(room.getImageUrl()).build();
	}
}