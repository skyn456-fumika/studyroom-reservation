package com.studyroom.reservation.room.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RoomUpdateRequest {

	@NotBlank(message = "공간 이름은 필수입니다.")
	@Size(max = 100, message = "공간 이름은 100자 이하로 입력해주세요.")
	private String name;

	@NotBlank(message = "공간 설명은 필수입니다.")
	@Size(max = 1000, message = "공간 설명은 1000자 이하로 입력해주세요.")
	private String description;

	@NotBlank(message = "위치는 필수입니다.")
	@Size(max = 255, message = "위치는 255자 이하로 입력해주세요.")
	private String location;

	@Min(value = 1, message = "수용 인원은 1명 이상이어야 합니다.")
	@Max(value = 100, message = "수용 인원은 100명 이하로 입력해주세요.")
	private int capacity;

	@Min(value = 0, message = "시간당 가격은 0원 이상이어야 합니다.")
	private int hourlyPrice;

	@Min(value = 0, message = "운영 시작 시간은 0시 이상이어야 합니다.")
	@Max(value = 23, message = "운영 시작 시간은 23시 이하이어야 합니다.")
	private int openHour;

	@Min(value = 1, message = "운영 종료 시간은 1시 이상이어야 합니다.")
	@Max(value = 24, message = "운영 종료 시간은 24시 이하이어야 합니다.")
	private int closeHour;
}