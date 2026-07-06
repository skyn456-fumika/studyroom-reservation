package com.studyroom.reservation.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

	@GetMapping({ "/", "/login", "/signup", "/my-reservations", "/admin" })
	public String forward() {
		return "forward:/index.html";
	}

	@GetMapping("/rooms/{roomId}")
	public String forwardRoomDetail() {
		return "forward:/index.html";
	}
}