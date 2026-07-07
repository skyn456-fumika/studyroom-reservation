package com.studyroom.reservation.room.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.studyroom.reservation.common.exception.BusinessException;
import com.studyroom.reservation.common.exception.ErrorCode;

@Service
public class RoomImageService {

	private static final String UPLOAD_DIR = "uploads/rooms";
	private static final String IMAGE_URL_PREFIX = "/uploads/rooms/";

	public String uploadRoomImage(MultipartFile file) {
		validateFile(file);

		try {
			Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();

			if (!Files.exists(uploadPath)) {
				Files.createDirectories(uploadPath);
			}

			String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
			String extension = getExtension(originalFilename);
			String storedFilename = UUID.randomUUID() + extension;

			Path filePath = uploadPath.resolve(storedFilename);
			file.transferTo(filePath.toFile());

			return IMAGE_URL_PREFIX + storedFilename;
		} catch (IOException e) {
			throw new BusinessException(ErrorCode.FILE_UPLOAD_FAILED);
		}
	}

	private void validateFile(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new BusinessException(ErrorCode.INVALID_FILE);
		}

		String contentType = file.getContentType();

		if (contentType == null || !contentType.startsWith("image/")) {
			throw new BusinessException(ErrorCode.INVALID_FILE_TYPE);
		}
	}

	private String getExtension(String filename) {
		if (!StringUtils.hasText(filename)) {
			return "";
		}

		int dotIndex = filename.lastIndexOf(".");

		if (dotIndex == -1) {
			return "";
		}

		return filename.substring(dotIndex);
	}
}