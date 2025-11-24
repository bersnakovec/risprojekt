package com.example.tasklist.controllers;

import com.example.tasklist.dao.TaskRepository;
import com.example.tasklist.models.Task;
import com.example.tasklist.models.User;
import com.example.tasklist.service.UserService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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

}
