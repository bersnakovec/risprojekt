package com.example.tasklist.dao;

import com.example.tasklist.models.Task;
import com.example.tasklist.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // Find tasks where name contains searchTerm (case-insensitive)
    @Query("SELECT t FROM Task t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Task> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);

    // Find all tasks for a specific user
    List<Task> findByUser(User user);

    // Find tasks by user and search term
    @Query("SELECT t FROM Task t WHERE t.user = :user AND LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Task> findByUserAndNameContainingIgnoreCase(@Param("user") User user, @Param("searchTerm") String searchTerm);

    // Find task by id and user (for security)
    Optional<Task> findByIdAndUser(Long id, User user);
}
