package com.studyroom.reservation.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.studyroom.reservation.user.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtTokenProvider {

	private final SecretKey secretKey;
	private final long accessExpiration;
	private final long refreshExpiration;

	public JwtTokenProvider(@Value("${jwt.secret}") String secret, @Value("${jwt.expiration}") long accessExpiration,
			@Value("${jwt.refresh-expiration}") long refreshExpiration) {
		this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
		this.accessExpiration = accessExpiration;
		this.refreshExpiration = refreshExpiration;
	}

	public String createAccessToken(User user) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + accessExpiration);

		return Jwts.builder().subject(String.valueOf(user.getId())).claim("email", user.getEmail()).claim("name", user.getName())
				.claim("role", user.getRole().name()).issuedAt(now).expiration(expiryDate).signWith(secretKey).compact();
	}

	public String createRefreshToken(User user) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + refreshExpiration);

		return Jwts.builder().subject(String.valueOf(user.getId())).issuedAt(now).expiration(expiryDate).signWith(secretKey).compact();
	}

	public boolean validateToken(String token) {
		try {
			getClaims(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public Long getUserId(String token) {
		String subject = getClaims(token).getSubject();
		return Long.parseLong(subject);
	}

	private Claims getClaims(String token) {
		return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
	}
}