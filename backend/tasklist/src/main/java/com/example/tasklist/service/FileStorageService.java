package com.example.tasklist.service;

import com.example.tasklist.dao.TaskAttachmentRepository;
import com.example.tasklist.models.Task;
import com.example.tasklist.models.TaskAttachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Service for handling file storage operations.
 * Manages uploading, downloading, and deleting file attachments.
 */
@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final TaskAttachmentRepository attachmentRepository;

    @Autowired
    public FileStorageService(
            @Value("${file.upload-dir:uploads}") String uploadDir,
            TaskAttachmentRepository attachmentRepository) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        this.attachmentRepository = attachmentRepository;

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    /**
     * Store a file and create database record
     * @param file the file to store
     * @param task the task to attach the file to
     * @return the created TaskAttachment entity
     */
    public TaskAttachment storeFile(MultipartFile file, Task task) {
        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        // Normalize file name
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());

        // Validate filename
        if (originalFilename.contains("..")) {
            throw new IllegalArgumentException("Filename contains invalid path sequence: " + originalFilename);
        }

        // Generate unique filename
        String fileExtension = "";
        int lastDotIndex = originalFilename.lastIndexOf('.');
        if (lastDotIndex > 0) {
            fileExtension = originalFilename.substring(lastDotIndex);
        }
        String storedFilename = UUID.randomUUID().toString() + fileExtension;

        try {
            // Copy file to upload location
            Path targetLocation = this.fileStorageLocation.resolve(storedFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Create database record
            TaskAttachment attachment = new TaskAttachment();
            attachment.setFilename(storedFilename);
            attachment.setOriginalFilename(originalFilename);
            attachment.setFileSize(file.getSize());
            attachment.setContentType(file.getContentType());
            attachment.setTask(task);

            return attachmentRepository.save(attachment);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + originalFilename + ". Please try again!", ex);
        }
    }

    /**
     * Load a file as a Resource
     * @param filename the filename to load
     * @return the file as a Resource
     */
    public Resource loadFileAsResource(String filename) {
        try {
            Path filePath = this.fileStorageLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("File not found: " + filename);
            }
        } catch (Exception ex) {
            throw new RuntimeException("File not found: " + filename, ex);
        }
    }

    /**
     * Delete a file from storage and database
     * @param attachmentId the ID of the attachment to delete
     */
    public void deleteFile(Long attachmentId) {
        TaskAttachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + attachmentId));

        try {
            // Delete from filesystem
            Path filePath = this.fileStorageLocation.resolve(attachment.getFilename()).normalize();
            Files.deleteIfExists(filePath);

            // Delete from database
            attachmentRepository.delete(attachment);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file: " + attachment.getFilename(), ex);
        }
    }

    /**
     * Get all attachments for a task
     * @param taskId the ID of the task
     * @return list of attachments
     */
    public List<TaskAttachment> getTaskAttachments(Long taskId) {
        return attachmentRepository.findByTaskId(taskId);
    }

    /**
     * Get a specific attachment by ID
     * @param attachmentId the ID of the attachment
     * @return the attachment
     */
    public TaskAttachment getAttachment(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + attachmentId));
    }
}
