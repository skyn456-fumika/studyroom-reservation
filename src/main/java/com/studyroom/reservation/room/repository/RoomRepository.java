package com.studyroom.reservation.room.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyroom.reservation.room.entity.Room;
import com.studyroom.reservation.room.type.RoomStatus;

public interface RoomRepository extends JpaRepository<Room, Long> {

	List<Room> findByStatusOrderByIdDesc(RoomStatus status);

	List<Room> findAllByOrderByIdDesc();
}