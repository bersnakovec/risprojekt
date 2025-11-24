package com.example.tasklist.controllers;

import com.example.tasklist.dao.TaskRepository;
import com.example.tasklist.models.Task;
import com.example.tasklist.models.User;
import com.example.tasklist.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository repository;

    @Autowired
    private UserService userService;

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
            return repository.findByUserAndNameContainingIgnoreCase(user, search.trim());
        }
        return repository.findByUser(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getById(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        return repository.findByIdAndUser(id, user)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Task> create(@RequestBody Task task) {
        User user = getAuthenticatedUser();
        task.setUser(user);
        Task saved = repository.save(task);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> update(@PathVariable Long id, @RequestBody Task task) {
        User user = getAuthenticatedUser();
        return repository.findByIdAndUser(id, user).map(existing -> {
            existing.setName(task.getName());
            existing.setDateDue(task.getDateDue());
            existing.setChecked(task.isChecked());
            Task updated = repository.save(existing);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        if (!repository.findByIdAndUser(id, user).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}
