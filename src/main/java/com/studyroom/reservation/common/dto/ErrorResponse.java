package com.studyroom.reservation.common.dto;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ErrorResponse {

	private LocalDateTime timestamp;
	private int status;
	private String error;
	private String message;
	private String path;

	public static ErrorResponse of(HttpStatus status, String message, String path) {
		return new ErrorResponse(LocalDateTime.now(), status.value(), status.getReasonPhrase(), message, path);
	}
}