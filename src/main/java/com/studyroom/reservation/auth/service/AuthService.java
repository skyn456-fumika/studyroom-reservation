package com.studyroom.reservation.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyroom.reservation.auth.dto.LoginRequest;
import com.studyroom.reservation.auth.dto.LoginResponse;
import com.studyroom.reservation.auth.dto.SignupRequest;
import com.studyroom.reservation.auth.dto.SignupResponse;
import com.studyroom.reservation.security.JwtTokenProvider;
import com.studyroom.reservation.user.entity.User;
import com.studyroom.reservation.user.repository.UserRepository;
import com.studyroom.reservation.user.type.UserRole;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtTokenProvider jwtTokenProvider;

	public SignupResponse signup(SignupRequest request) {
		if (userRepository.existsByEmail(request.getEmail())) {
			throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
		}

		User user = User.builder().email(request.getEmail()).name(request.getName()).password(passwordEncoder.encode(request.getPassword()))
				.role(UserRole.USER).active(true).build();

		User savedUser = userRepository.save(user);

		return SignupResponse.from(savedUser);
	}

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다."));

		if (!user.isActive()) {
			throw new IllegalArgumentException("비활성화된 계정입니다.");
		}

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new IllegalArgumentException("이메일 또는 비밀번호가 올바르지 않습니다.");
		}

		String accessToken = jwtTokenProvider.createAccessToken(user);

		return LoginResponse.of(accessToken, user);
	}
}