package com.example.tasklist.controllers;

import com.example.tasklist.dao.TaskRepository;
import com.example.tasklist.models.Task;
import com.example.tasklist.models.TaskAttachment;
import com.example.tasklist.models.User;
import com.example.tasklist.service.FileStorageService;
import com.example.tasklist.service.UserService;
import org.springframework.core.io.Resource;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repository;

    @Autowired
    private UserService userService;

    @Autowired
    private FileStorageService fileStorageService;

    public TaskController(TaskRepository repository) {
        this.repository = repository;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userService.findByUsername(username);
    }

    @GetMapping
    public List<Task> getAll(@RequestParam(required = false) String search) {
        User user = getAuthenticatedUser();
        if (search != null && !search.trim().isEmpty()) {
            return repository.findByUsersContainingAndNameContainingIgnoreCase(user, search.trim());
        }
        return repository.findByUsersContaining(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        return repository.findByIdAndUsersContaining(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task) {
        User user = getAuthenticatedUser();
        task.getUsers().add(user);
        Task saved = repository.save(task);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task task) {
        User user = getAuthenticatedUser();
        return repository.findByIdAndUsersContaining(id, user).map(existing -> {
            existing.setName(task.getName());
            existing.setDateDue(task.getDateDue());
            existing.setChecked(task.isChecked());
            existing.setUsers(task.getUsers());
            existing.setStartTime(task.getStartTime());
            existing.setEndTime(task.getEndTime());
            Task updated = repository.save(existing);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (!repository.findByIdAndUsersContaining(id, user).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Add user to a task by username
    @PostMapping("/{id}/addUser")
    public ResponseEntity<Task> addUserToTask(@PathVariable Long id, @RequestParam String username) {
        User userToAdd;
        try {
            userToAdd = userService.findByUsername(username);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User currentUser = getAuthenticatedUser();
        return repository.findByIdAndUsersContaining(id, currentUser).map(task -> {
            task.getUsers().add(userToAdd);
            Task updated = repository.save(task);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Remove user from a task by username
    @PostMapping("/{id}/removeUser")
    public ResponseEntity<Task> removeUserFromTask(@PathVariable Long id, @RequestParam String username) {
        User userToRemove;
        try {
            userToRemove = userService.findByUsername(username);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        User currentUser = getAuthenticatedUser();
        return repository.findByIdAndUsersContaining(id, currentUser).map(task -> {
            task.getUsers().remove(userToRemove);
            Task updated = repository.save(task);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * Upload a file attachment to a task
     */
    @PostMapping("/{id}/upload")
    public ResponseEntity<?> uploadFile(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        try {
            User currentUser = getAuthenticatedUser();
            Task task = repository.findByIdAndUsersContaining(id, currentUser)
                    .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

            TaskAttachment attachment = fileStorageService.storeFile(file, task);
            return ResponseEntity.ok(attachment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not upload file: " + e.getMessage());
        }
    }

    /**
     * Get all attachments for a task
     */
    @GetMapping("/{id}/files")
    public ResponseEntity<List<TaskAttachment>> getTaskFiles(@PathVariable Long id) {
        try {
            User currentUser = getAuthenticatedUser();
            Task task = repository.findByIdAndUsersContaining(id, currentUser)
                    .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

            List<TaskAttachment> attachments = fileStorageService.getTaskAttachments(id);
            return ResponseEntity.ok(attachments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Download a file attachment
     */
    @GetMapping("/{taskId}/files/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long taskId, @PathVariable Long fileId) {
        try {
            User currentUser = getAuthenticatedUser();
            Task task = repository.findByIdAndUsersContaining(taskId, currentUser)
                    .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

            TaskAttachment attachment = fileStorageService.getAttachment(fileId);

            // Verify the attachment belongs to this task
            if (!attachment.getTask().getId().equals(taskId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            Resource resource = fileStorageService.loadFileAsResource(attachment.getFilename());

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attachment.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + attachment.getOriginalFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Delete a file attachment
     */
    @DeleteMapping("/{taskId}/files/{fileId}")
    public ResponseEntity<?> deleteFile(@PathVariable Long taskId, @PathVariable Long fileId) {
        try {
            User currentUser = getAuthenticatedUser();
            Task task = repository.findByIdAndUsersContaining(taskId, currentUser)
                    .orElseThrow(() -> new RuntimeException("Task not found or access denied"));

            TaskAttachment attachment = fileStorageService.getAttachment(fileId);

            // Verify the attachment belongs to this task
            if (!attachment.getTask().getId().equals(taskId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            fileStorageService.deleteFile(fileId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Could not delete file: " + e.getMessage());
        }
    }

}
