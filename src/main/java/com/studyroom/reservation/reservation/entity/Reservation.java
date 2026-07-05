package com.studyroom.reservation.reservation.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.studyroom.reservation.reservation.type.ReservationStatus;
import com.studyroom.reservation.room.entity.Room;
import com.studyroom.reservation.user.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "reservations")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Reservation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	// 예약자
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	// 예약 공간
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "room_id", nullable = false)
	private Room room;

	// 예약 날짜
	@Column(nullable = false)
	private LocalDate reservationDate;

	// 시작 시간
	@Column(nullable = false)
	private LocalTime startTime;

	// 종료 시간
	@Column(nullable = false)
	private LocalTime endTime;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private ReservationStatus status;

	@Column(nullable = false)
	private LocalDateTime createdAt;

	@Builder
	private Reservation(User user, Room room, LocalDate reservationDate, LocalTime startTime, LocalTime endTime, ReservationStatus status) {
		this.user = user;
		this.room = room;
		this.reservationDate = reservationDate;
		this.startTime = startTime;
		this.endTime = endTime;
		this.status = status;
	}

	@PrePersist
	public void prePersist() {
		this.createdAt = LocalDateTime.now();

		if (this.status == null) {
			this.status = ReservationStatus.PENDING;
		}
	}

	public void cancel(Long userId) {
		if (!this.user.getId().equals(userId)) {
			throw new IllegalArgumentException("본인의 예약만 취소할 수 있습니다.");
		}

		if (this.status == ReservationStatus.CANCELED) {
			throw new IllegalArgumentException("이미 취소된 예약입니다.");
		}

		if (this.status == ReservationStatus.REJECTED) {
			throw new IllegalArgumentException("거절된 예약은 취소할 수 없습니다.");
		}

		this.status = ReservationStatus.CANCELED;
	}

	public void approve() {
		if (this.status != ReservationStatus.PENDING) {
			throw new IllegalArgumentException("승인 대기 상태의 예약만 승인할 수 있습니다.");
		}

		this.status = ReservationStatus.APPROVED;
	}

	public void reject() {
		if (this.status != ReservationStatus.PENDING) {
			throw new IllegalArgumentException("승인 대기 상태의 예약만 거절할 수 있습니다.");
		}

		this.status = ReservationStatus.REJECTED;
	}
}