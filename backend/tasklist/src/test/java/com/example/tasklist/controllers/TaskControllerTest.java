package com.example.tasklist.controllers;

import com.example.tasklist.dao.TaskRepository;
import com.example.tasklist.models.Task;
import com.example.tasklist.models.User;
import com.example.tasklist.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test razred za TaskController.
 *
 * Testira REST API končne točke za upravljanje nalog (tasks).
 * Uporablja MockMvc za simulacijo HTTP zahtevkov in Mockito za
 * simulacijo odvisnosti (repository, service).
 *
 * @author Timotej Lipic
 */
@WebMvcTest(
    controllers = TaskController.class,
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.REGEX,
        pattern = "com\\.example\\.tasklist\\.security\\..*"
    )
)
@AutoConfigureMockMvc(addFilters = false)
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TaskRepository taskRepository;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private User mockUser;
    private Task mockTask;

    /**
     * Priprava testnih podatkov pred vsakim testom.
     *
     * Ustvari testnega uporabnika in testno nalogo, ki ju uporabljajo testi.
     * Ta metoda se izvede pred vsakim testom (@BeforeEach anotacija).
     */
    @BeforeEach
    void setUp() {
        // Ustvari testnega uporabnika
        mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@mail.com");

        // Ustvari testno nalogo
        mockTask = new Task();
        mockTask.setId(1L);
        mockTask.setName("Testna naloga");
        mockTask.setDateDue(LocalDate.of(2025, 12, 31));
        mockTask.setChecked(false);
        mockTask.setUsers(new HashSet<>());
        mockTask.getUsers().add(mockUser);

        // Simulacija Security Context za pridobivanje avtenticiranega uporabnika
        Authentication authentication = Mockito.mock(Authentication.class);
        SecurityContext securityContext = Mockito.mock(SecurityContext.class);
        Mockito.when(securityContext.getAuthentication()).thenReturn(authentication);
        Mockito.when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);

        // Mock za UserService.findByUsername
        Mockito.when(userService.findByUsername("testuser")).thenReturn(mockUser);
    }

    /**
     * Test 1: Uspešno kreiranje nove naloge
     *
     * POZITIVNI SCENARIJ
     *
     * Preveri, ali se nova naloga pravilno ustvari preko POST /api/tasks endpointa.
     * Test preverja:
     * - Ali se vrne HTTP status 201 CREATED
     * - Ali se vrne pravilna JSON struktura z vsemi podatki naloge
     * - Ali je trenutno avtenticirani uporabnik avtomatsko dodan med uporabnike naloge
     *
     * Uporablja @WithMockUser anotacijo za simulacijo avtentifikacije uporabnika,
     * kar omogoča testiranje varnostnih vidikov brez potrebe po dejanskem JWT žetonu.
     *
     * @throws Exception če pride do napake pri izvajanju HTTP zahtevka
     */
    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Uspešno kreiranje nove naloge (pozitivni scenarij)")
    void shouldCreateTaskSuccessfully() throws Exception {
        // Arrange - Pripravi testne podatke
        Task newTask = new Task();
        newTask.setName("Nova naloga");
        newTask.setDateDue(LocalDate.of(2025, 12, 20));
        newTask.setChecked(false);
        newTask.setUsers(new HashSet<>());

        Task savedTask = new Task();
        savedTask.setId(2L);
        savedTask.setName("Nova naloga");
        savedTask.setDateDue(LocalDate.of(2025, 12, 20));
        savedTask.setChecked(false);
        savedTask.setUsers(new HashSet<>());
        savedTask.getUsers().add(mockUser);

        // Mock repository.save()
        Mockito.when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Act & Assert - Izvedi HTTP zahtevek in preveri odgovor
        mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newTask)))
                .andExpect(status().isCreated())  // Pričakujemo HTTP 201
                .andExpect(jsonPath("$.id").value(2))  // Preveri ID
                .andExpect(jsonPath("$.name").value("Nova naloga"))  // Preveri ime
                .andExpect(jsonPath("$.dateDue").value("2025-12-20"))  // Preveri datum
                .andExpect(jsonPath("$.checked").value(false));  // Preveri status

        // Preveri, da je bila repository.save() metoda klicana enkrat
        Mockito.verify(taskRepository, Mockito.times(1)).save(any(Task.class));
    }

    /**
     * Test 2: Brisanje neobstoječe naloge
     *
     * NEGATIVNI SCENARIJ
     *
     * Preveri, ali sistem pravilno obravnava poskus brisanja naloge, ki ne obstaja
     * ali do katere uporabnik nima dostopa.
     *
     * Test preverja:
     * - Ali se vrne HTTP status 404 NOT FOUND, ko naloga ne obstaja
     * - Ali je varnost pravilno implementirana (preverja se, ali je naloga vezana na uporabnika)
     * - Ali repository.deleteById() NIKOLI ni klican, če naloga ne obstaja
     *
     * Ta test je pomemben za varnost aplikacije, saj zagotavlja, da uporabniki
     * ne morejo brisati nalog drugih uporabnikov ali neobstoječih nalog.
     *
     * Uporablja @WithMockUser anotacijo za simulacijo avtentifikacije.
     *
     * @throws Exception če pride do napake pri izvajanju HTTP zahtevka
     */
    @Test
    @WithMockUser(username = "testuser")
    @DisplayName("Brisanje neobstoječe naloge vrne 404 (negativni scenarij)")
    void shouldReturnNotFoundWhenDeletingNonExistentTask() throws Exception {
        // Arrange - Pripravi testne podatke
        Long nonExistentTaskId = 999L;

        // Mock repository.findByIdAndUsersContaining() - vrne prazen Optional (naloga ne obstaja)
        Mockito.when(taskRepository.findByIdAndUsersContaining(nonExistentTaskId, mockUser))
                .thenReturn(Optional.empty());

        // Act & Assert - Izvedi HTTP DELETE zahtevek in preveri odgovor
        mockMvc.perform(delete("/api/tasks/" + nonExistentTaskId))
                .andExpect(status().isNotFound());  // Pričakujemo HTTP 404

        // Preveri, da repository.deleteById() NIKOLI ni bila klicana
        Mockito.verify(taskRepository, Mockito.never()).deleteById(anyLong());

        // Preveri, da je bila findByIdAndUsersContaining() klicana točno enkrat
        Mockito.verify(taskRepository, Mockito.times(1))
                .findByIdAndUsersContaining(nonExistentTaskId, mockUser);
    }
}
