package com.gss.inventory.api.controller;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/uploads")
public class UploadsController {

    @Value("${app.upload.dir:/app/uploads}")
    private String uploadDir;

    @GetMapping("/{itemId}/{filename:.+}")
    public ResponseEntity<Resource> serve(@PathVariable String itemId, @PathVariable String filename) {
        Path filePath = Path.of(uploadDir).resolve(itemId).resolve(filename);
        Resource resource = new FileSystemResource(filePath);
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        String lower = filename.toLowerCase();
        MediaType contentType = lower.endsWith(".png") ? MediaType.IMAGE_PNG
            : lower.endsWith(".gif") ? MediaType.IMAGE_GIF
            : lower.endsWith(".webp") ? MediaType.parseMediaType("image/webp")
            : MediaType.IMAGE_JPEG;
        return ResponseEntity.ok()
            .contentType(contentType)
            .body(resource);
    }
}
