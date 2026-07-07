package com.studyroom.reservation.auth.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.studyroom.reservation.auth.dto.LoginRequest;
import com.studyroom.reservation.auth.dto.LoginResponse;
import com.studyroom.reservation.auth.dto.RefreshTokenRequest;
import com.studyroom.reservation.auth.dto.SignupRequest;
import com.studyroom.reservation.auth.dto.SignupResponse;
import com.studyroom.reservation.auth.dto.TokenRefreshResponse;
import com.studyroom.reservation.common.exception.BusinessException;
import com.studyroom.reservation.common.exception.ErrorCode;
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
			throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
		}

		User user = User.builder().email(request.getEmail()).name(request.getName()).password(passwordEncoder.encode(request.getPassword()))
				.role(UserRole.USER).active(true).build();

		User savedUser = userRepository.save(user);

		return SignupResponse.from(savedUser);
	}

	public LoginResponse login(LoginRequest request) {
		User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new BusinessException(ErrorCode.INVALID_LOGIN_INFO));

		if (!user.isActive()) {
			throw new BusinessException(ErrorCode.USER_NOT_FOUND);
		}

		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BusinessException(ErrorCode.INVALID_LOGIN_INFO);
		}

		String accessToken = jwtTokenProvider.createAccessToken(user);
		String refreshToken = jwtTokenProvider.createRefreshToken(user);

		user.updateRefreshToken(refreshToken);

		return LoginResponse.of(accessToken, refreshToken, user);
	}

	public TokenRefreshResponse refresh(RefreshTokenRequest request) {
		String refreshToken = request.getRefreshToken();

		if (!jwtTokenProvider.validateToken(refreshToken)) {
			throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
		}

		Long userId = jwtTokenProvider.getUserId(refreshToken);

		User user = userRepository.findById(userId).orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

		if (!user.isActive()) {
			throw new BusinessException(ErrorCode.USER_NOT_FOUND);
		}

		if (user.getRefreshToken() == null || !user.getRefreshToken().equals(refreshToken)) {
			throw new BusinessException(ErrorCode.INVALID_REFRESH_TOKEN);
		}

		String newAccessToken = jwtTokenProvider.createAccessToken(user);

		return new TokenRefreshResponse(newAccessToken, "Bearer");
	}
}