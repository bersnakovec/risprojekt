package com.example.tasklist.service;

import com.example.tasklist.dto.LoginRequest;
import com.example.tasklist.models.User;
import com.example.tasklist.controllers.AuthController;
import com.example.tasklist.util.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.Authentication;


import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false) 
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationManager authenticationManager;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Uspešna prijava vrne 200 OK in JWT (pozitivni scenarij)")
    void shouldLoginSuccessfully() throws Exception {

        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword("password");

        User user = new User();
        user.setId(1L);
        user.setUsername("user");
        user.setEmail("user@mail.com");

        UserDetails userDetails = Mockito.mock(UserDetails.class);

        Mockito.when(authenticationManager.authenticate(
                Mockito.any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(Mockito.mock(Authentication.class));

        Mockito.when(userService.loadUserByUsername("user"))
                .thenReturn(userDetails);
        Mockito.when(userService.findByUsername("user"))
                .thenReturn(user);
        Mockito.when(jwtUtil.generateToken(userDetails))
                .thenReturn("mock-token");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("mock-token"))
                .andExpect(jsonPath("$.username").value("user"))
                .andExpect(jsonPath("$.email").value("user@mail.com"));
    }

    @Test
    @DisplayName("Napačni podatki vrnejo 401 Unauthorized (negativni scenarij)")
    void shouldReturnUnauthorizedWhenCredentialsAreWrong() throws Exception {
        
        LoginRequest request = new LoginRequest();
        request.setUsername("user");
        request.setPassword("wrong");

        Mockito.when(authenticationManager.authenticate(Mockito.any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid username or password"));
    }
}
