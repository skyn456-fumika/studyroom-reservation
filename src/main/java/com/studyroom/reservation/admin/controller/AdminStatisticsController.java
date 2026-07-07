package com.studyroom.reservation.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.studyroom.reservation.admin.dto.AdminStatisticsResponse;
import com.studyroom.reservation.admin.service.AdminStatisticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/statistics")
public class AdminStatisticsController {

	private final AdminStatisticsService adminStatisticsService;

	@GetMapping
	public ResponseEntity<AdminStatisticsResponse> getStatistics() {
		return ResponseEntity.ok(adminStatisticsService.getStatistics());
	}
}