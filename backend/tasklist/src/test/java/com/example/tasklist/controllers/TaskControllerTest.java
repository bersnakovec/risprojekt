package com.example.tasklist.controllers;

import org.junit.jupiter.api.AfterEach;
import org.springframework.security.core.context.SecurityContextHolder;
import com.example.tasklist.dao.TaskRepository;
import com.example.tasklist.models.Task;
import com.example.tasklist.models.User;
import com.example.tasklist.service.UserService;
import com.example.tasklist.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(TaskController.class)
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {
    
    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @MockBean
    private TaskRepository taskRepository;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Dodeli nalogo drugemu uporabniku (share task)")
    void shouldShareTaskWithAnotherUser() throws Exception {
        // Setup users and task
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");
        Set<User> users = new HashSet<>();
        users.add(user1);
        Task task = new Task("Test task", LocalDate.now(), false, users);
        task.setId(100L);

        Mockito.when(userService.findByUsername("user2")).thenReturn(user2);
        Mockito.when(userService.findByUsername("user1")).thenReturn(user1);
        // Simulate authenticated user1
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn("user1");
        SecurityContextHolder.getContext().setAuthentication(auth);
        // Mock repository to return the task for user1
        Mockito.when(taskRepository.findByIdAndUsersContaining(100L, user1)).thenReturn(java.util.Optional.of(task));
        Mockito.when(taskRepository.save(Mockito.any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Simulate sharing task
        mockMvc.perform(post("/api/tasks/100/addUser")
            .param("username", "user2"))
            .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Označi skupno nalogo kot opravljeno z drugim uporabnikom")
    void shouldMarkSharedTaskDoneByAnotherUser() throws Exception {
        // Setup users and task
        User user1 = new User();
        user1.setId(1L);
        user1.setUsername("user1");
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("user2");
        Set<User> users = new HashSet<>();
        users.add(user1);
        users.add(user2);
        Task task = new Task("Test task", LocalDate.now(), false, users);
        task.setId(101L);

        Mockito.when(userService.findByUsername("user2")).thenReturn(user2);
        // Simulate authenticated user2
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getName()).thenReturn("user2");
        SecurityContextHolder.getContext().setAuthentication(auth);
        // Mock repository to return the task for user2
        Mockito.when(taskRepository.findByIdAndUsersContaining(101L, user2)).thenReturn(java.util.Optional.of(task));
        Mockito.when(taskRepository.save(Mockito.any(Task.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Simulate marking as done
        task.setChecked(true);
        mockMvc.perform(put("/api/tasks/101")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(task)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.checked").value(true));
    }
}
