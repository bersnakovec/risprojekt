package com.example.tasklist.service;

import com.example.tasklist.dao.UserRepository;
import com.example.tasklist.models.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class) 
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    @DisplayName("Uspešna registracija uporabnika (pozitivni scenarij)")
    void shouldRegisterUserSuccessfully() {
        
        Mockito.when(userRepository.existsByUsername("test"))
                .thenReturn(false);
        Mockito.when(userRepository.existsByEmail("test@mail.com"))
                .thenReturn(false);
        Mockito.when(passwordEncoder.encode("password"))
                .thenReturn("hashedPassword");

        Mockito.when(userRepository.save(Mockito.any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        
        User result = userService.registerUser(
                "test",
                "test@mail.com",
                "password"
        );

        
        Assertions.assertNotNull(result);
        Assertions.assertEquals("test", result.getUsername());
        Assertions.assertEquals("test@mail.com", result.getEmail());
        Assertions.assertEquals("hashedPassword", result.getPassword());
    }

    @Test
    @DisplayName("Registracija spodleti, če uporabniško ime že obstaja (negativni scenarij)")
    void shouldFailWhenUsernameAlreadyExists() {
        
        Mockito.when(userRepository.existsByUsername("test"))
                .thenReturn(true);

        
        RuntimeException exception = Assertions.assertThrows(
                RuntimeException.class,
                () -> userService.registerUser(
                        "test",
                        "test@mail.com",
                        "password"
                )
        );

        Assertions.assertEquals("Username already exists", exception.getMessage());
    }
}
