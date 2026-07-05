package com.studyroom.reservation.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.studyroom.reservation.user.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);
}