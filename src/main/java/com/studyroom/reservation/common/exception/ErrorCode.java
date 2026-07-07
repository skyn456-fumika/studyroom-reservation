package com.studyroom.reservation.common.exception;

import org.springframework.http.HttpStatus;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

	// Common
	INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "잘못된 입력값입니다."),

	// User
	USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."), EMAIL_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 사용 중인 이메일입니다."),
	INVALID_LOGIN_INFO(HttpStatus.UNAUTHORIZED, "이메일 또는 비밀번호가 일치하지 않습니다."),

	// Room
	ROOM_NOT_FOUND(HttpStatus.NOT_FOUND, "공간을 찾을 수 없습니다."), INVALID_FILE(HttpStatus.BAD_REQUEST, "파일이 비어있거나 올바르지 않습니다."),
	INVALID_FILE_TYPE(HttpStatus.BAD_REQUEST, "이미지 파일만 업로드할 수 있습니다."), FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드에 실패했습니다."),
	ROOM_INACTIVE(HttpStatus.BAD_REQUEST, "예약 가능한 공간이 아닙니다."), INVALID_ROOM_TIME(HttpStatus.BAD_REQUEST, "운영 시작 시간은 종료 시간보다 빨라야 합니다."),

	// Reservation
	RESERVATION_NOT_FOUND(HttpStatus.NOT_FOUND, "예약을 찾을 수 없습니다."), RESERVATION_NOT_OWNER(HttpStatus.FORBIDDEN, "본인의 예약만 취소할 수 있습니다."),
	INVALID_RESERVATION_TIME(HttpStatus.BAD_REQUEST, "예약 시작 시간은 종료 시간보다 빨라야 합니다."),
	RESERVATION_OUT_OF_ROOM_TIME(HttpStatus.BAD_REQUEST, "운영 시간 내에서만 예약할 수 있습니다."),
	RESERVATION_ALREADY_EXISTS(HttpStatus.BAD_REQUEST, "이미 예약된 시간대입니다."), RESERVATION_PAST_TIME(HttpStatus.BAD_REQUEST, "지난 시간은 예약할 수 없습니다."),
	RESERVATION_ALREADY_CANCELED(HttpStatus.BAD_REQUEST, "이미 취소된 예약입니다."),
	RESERVATION_ALREADY_REJECTED(HttpStatus.BAD_REQUEST, "거절된 예약은 취소할 수 없습니다."),
	RESERVATION_NOT_PENDING(HttpStatus.BAD_REQUEST, "승인 대기 중인 예약만 처리할 수 있습니다.");

	private final HttpStatus status;
	private final String message;
}