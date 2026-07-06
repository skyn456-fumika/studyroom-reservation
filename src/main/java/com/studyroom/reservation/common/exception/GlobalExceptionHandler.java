package com.studyroom.reservation.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.studyroom.reservation.common.dto.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ErrorResponse> handleBusinessException(BusinessException e, HttpServletRequest request) {
		ErrorCode errorCode = e.getErrorCode();

		ErrorResponse response = ErrorResponse.of(errorCode.getStatus(), errorCode.getMessage(), request.getRequestURI());

		return ResponseEntity.status(errorCode.getStatus()).body(response);
	}

	@ExceptionHandler(IllegalArgumentException.class)
	public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e, HttpServletRequest request) {
		ErrorResponse response = ErrorResponse.of(HttpStatus.BAD_REQUEST, e.getMessage(), request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException e, HttpServletRequest request) {
		String message = e.getBindingResult().getFieldErrors().stream().findFirst().map(error -> error.getDefaultMessage()).orElse("잘못된 요청입니다.");

		ErrorResponse response = ErrorResponse.of(HttpStatus.BAD_REQUEST, message, request.getRequestURI());

		return ResponseEntity.badRequest().body(response);
	}
}