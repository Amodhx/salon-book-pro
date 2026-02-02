package com.salon.controller;

import com.salon.dto.ApiResponse;
import com.salon.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

/**
 * REST Controller for file uploads
 */
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload management")
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload file", description = "Upload a payment slip or other image")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(
            @RequestParam("file") MultipartFile file) {
        
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png"))) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("Only JPEG and PNG files are allowed"));
        }
        
        // Validate file size (5MB max)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error("File size must be less than 5MB"));
        }
        
        String filename = fileStorageService.storeFile(file);
        Map<String, String> response = new HashMap<>();
        response.put("filename", filename);
        response.put("url", "/api/files/" + filename);
        
        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success("File uploaded successfully", response));
    }

    @GetMapping("/{filename}")
    @Operation(summary = "Get file", description = "Retrieve an uploaded file")
    public ResponseEntity<byte[]> getFile(@PathVariable String filename) {
        byte[] fileContent = fileStorageService.loadFile(filename);
        
        String contentType = "application/octet-stream";
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            contentType = "image/jpeg";
        } else if (filename.endsWith(".png")) {
            contentType = "image/png";
        }
        
        return ResponseEntity
            .ok()
            .contentType(MediaType.parseMediaType(contentType))
            .body(fileContent);
    }

    @DeleteMapping("/{filename}")
    @Operation(summary = "Delete file", description = "Delete an uploaded file")
    public ResponseEntity<ApiResponse<Void>> deleteFile(@PathVariable String filename) {
        fileStorageService.deleteFile(filename);
        return ResponseEntity.ok(ApiResponse.success("File deleted successfully", null));
    }
}
