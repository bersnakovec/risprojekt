package com.example.tasklist.dao;

import com.example.tasklist.models.TaskAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for TaskAttachment entity.
 * Provides database operations for task file attachments.
 */
@Repository
public interface TaskAttachmentRepository extends JpaRepository<TaskAttachment, Long> {

    /**
     * Find all attachments for a specific task
     * @param taskId the ID of the task
     * @return list of attachments for the task
     */
    List<TaskAttachment> findByTaskId(Long taskId);

    /**
     * Delete all attachments for a specific task
     * @param taskId the ID of the task
     */
    void deleteByTaskId(Long taskId);
}
