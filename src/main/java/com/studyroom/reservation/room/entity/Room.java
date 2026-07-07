package com.studyroom.reservation.room.entity;

import java.time.LocalDateTime;

import com.studyroom.reservation.room.type.RoomStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Room {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// 공간 이름
	@Column(nullable = false, length = 100)
	private String name;

	// 공간 설명
	@Column(nullable = false, length = 1000)
	private String description;

	// 위치
	@Column(nullable = false, length = 255)
	private String location;

	// 수용 인원
	@Column(nullable = false)
	private int capacity;

	// 시간당 가격
	@Column(nullable = false)
	private int hourlyPrice;

	// 운영 시작 시간, 예: 9
	@Column(nullable = false)
	private int openHour;

	// 운영 종료 시간, 예: 22
	@Column(nullable = false)
	private int closeHour;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private RoomStatus status;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@Column(length = 1000)
	private String imageUrl;

	@Builder
	private Room(String name, String description, String location, int capacity, int hourlyPrice, int openHour, int closeHour, RoomStatus status,
			String imageUrl) {
		this.name = name;
		this.description = description;
		this.location = location;
		this.capacity = capacity;
		this.hourlyPrice = hourlyPrice;
		this.openHour = openHour;
		this.closeHour = closeHour;
		this.status = status;
		this.imageUrl = imageUrl;
	}

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();

		if (this.status == null) {
			this.status = RoomStatus.ACTIVE;
		}
	}

	public void update(String name, String description, String location, int capacity, int hourlyPrice, int openHour, int closeHour,
			String imageUrl) {
		this.name = name;
		this.description = description;
		this.location = location;
		this.capacity = capacity;
		this.hourlyPrice = hourlyPrice;
		this.openHour = openHour;
		this.closeHour = closeHour;
		this.imageUrl = imageUrl;
	}

	public void activate() {
		this.status = RoomStatus.ACTIVE;
	}

	public void deactivate() {
		this.status = RoomStatus.INACTIVE;
	}
}