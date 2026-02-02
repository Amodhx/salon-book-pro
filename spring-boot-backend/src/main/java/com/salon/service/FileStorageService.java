package com.salon.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service for handling file uploads (payment slips)
 */
@Service
@Slf4j
public class FileStorageService {

    private final Path uploadPath;

    public FileStorageService(@Value("${file.upload-dir:./uploads}") String uploadDir) {
        this.uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String storeFile(MultipartFile file) {
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
        
        try {
            Path targetLocation = this.uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            log.info("Stored file: {}", uniqueFilename);
            return uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file: " + originalFilename, e);
        }
    }

    public byte[] loadFile(String filename) {
        try {
            Path filePath = this.uploadPath.resolve(filename).normalize();
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    public void deleteFile(String filename) {
        try {
            Path filePath = this.uploadPath.resolve(filename).normalize();
            Files.deleteIfExists(filePath);
            log.info("Deleted file: {}", filename);
        } catch (IOException e) {
            throw new RuntimeException("Could not delete file: " + filename, e);
        }
    }
}
