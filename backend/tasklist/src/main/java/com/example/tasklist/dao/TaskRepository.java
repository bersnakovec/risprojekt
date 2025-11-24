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

    // Find all tasks where user is assigned
    @Query("SELECT t FROM Task t JOIN t.users u WHERE u = :user")
    List<Task> findByUsersContaining(@Param("user") User user);

    // Find tasks by user and search term
    @Query("SELECT t FROM Task t JOIN t.users u WHERE u = :user AND LOWER(t.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Task> findByUsersContainingAndNameContainingIgnoreCase(@Param("user") User user, @Param("searchTerm") String searchTerm);

    // Find task by id and user (for security)
    @Query("SELECT t FROM Task t JOIN t.users u WHERE t.id = :id AND u = :user")
    Optional<Task> findByIdAndUsersContaining(@Param("id") Long id, @Param("user") User user);
}
