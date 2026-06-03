package com.gss.inventory.inventory.infrastructure;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageStorageService {

    @Value("${app.upload.dir:/app/uploads}")
    private String uploadDir;

    public String store(Long itemId, MultipartFile file) {
        try {
            String original = file.getOriginalFilename();
            String ext = (original != null && original.contains("."))
                ? original.substring(original.lastIndexOf('.'))
                : "";
            String fileName = UUID.randomUUID() + ext.toLowerCase();
            String relativePath = itemId + "/" + fileName;
            Path target = Path.of(uploadDir).resolve(relativePath);
            Files.createDirectories(target.getParent());
            Files.write(target, file.getBytes());
            return relativePath;
        } catch (IOException e) {
            throw new RuntimeException("Greška pri pohrani fotografije", e);
        }
    }

    public void delete(String filePath) {
        try {
            Files.deleteIfExists(Path.of(uploadDir).resolve(filePath));
        } catch (IOException ignored) {
        }
    }
}
