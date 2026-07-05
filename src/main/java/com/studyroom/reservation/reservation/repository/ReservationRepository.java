package com.studyroom.reservation.reservation.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.studyroom.reservation.reservation.entity.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

	@Query("""
			    select count(r) > 0
			    from Reservation r
			    where r.room.id = :roomId
			      and r.reservationDate = :reservationDate
			      and r.status in (
			          com.studyroom.reservation.reservation.type.ReservationStatus.PENDING,
			          com.studyroom.reservation.reservation.type.ReservationStatus.APPROVED
			      )
			      and r.startTime < :endTime
			      and r.endTime > :startTime
			""")
	boolean existsOverlappingReservation(Long roomId, LocalDate reservationDate, LocalTime startTime, LocalTime endTime);

//	특정 사용자의 예약을
//	예약 날짜 최신순
//	같은 날짜에서는 시작 시간 최신순
//	으로 조회
	List<Reservation> findByUserIdOrderByReservationDateDescStartTimeDesc(Long userId);

	List<Reservation> findAllByOrderByReservationDateDescStartTimeDesc();

	@Query("""
			    select r
			    from Reservation r
			    where r.room.id = :roomId
			      and r.reservationDate = :reservationDate
			      and r.status in (
			          com.studyroom.reservation.reservation.type.ReservationStatus.PENDING,
			          com.studyroom.reservation.reservation.type.ReservationStatus.APPROVED
			      )
			    order by r.startTime asc
			""")
	List<Reservation> findRoomReservationsByDate(Long roomId, LocalDate reservationDate);
}