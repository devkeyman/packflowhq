package com.packflowhq.adapter.in.web.controller;

import com.packflowhq.adapter.in.web.security.CustomUserDetailsService;
import com.packflowhq.application.port.in.UserUseCase;
import com.packflowhq.common.dto.user.ChangePasswordDto;
import com.packflowhq.common.dto.user.CreateUserDto;
import com.packflowhq.common.dto.user.UpdateUserDto;
import com.packflowhq.common.dto.user.UserDto;
import com.packflowhq.common.exception.ResourceNotFoundException;
import com.packflowhq.common.exception.UnauthorizedException;
import com.packflowhq.domain.model.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {
    
    private final UserUseCase userUseCase;
    private final PasswordEncoder passwordEncoder;
    
    public UserController(UserUseCase userUseCase, PasswordEncoder passwordEncoder) {
        this.userUseCase = userUseCase;
        this.passwordEncoder = passwordEncoder;
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserDto> createUser(@Valid @RequestBody CreateUserDto createUserDto) {
        UserUseCase.CreateUserCommand command = new UserUseCase.CreateUserCommand(
            createUserDto.getEmail(),
            createUserDto.getName(),
            passwordEncoder.encode(createUserDto.getPassword()),
            createUserDto.getRole()
        );
        
        User user = userUseCase.createUser(command);
        UserDto userDto = convertToDto(user);
        
        return new ResponseEntity<>(userDto, HttpStatus.CREATED);
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userUseCase.findAllUsers();
        List<UserDto> userDtos = users.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDtos);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') or #id == authentication.principal.id")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        User user = userUseCase.findUserById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        
        UserDto userDto = convertToDto(user);
        return ResponseEntity.ok(userDto);
    }
    
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or (#id == authentication.principal.id and #updateUserDto.role == null)")
    public ResponseEntity<UserDto> updateUser(@PathVariable Long id, 
                                              @Valid @RequestBody UpdateUserDto updateUserDto,
                                              Authentication authentication) {
        
        CustomUserDetailsService.CustomUserDetails currentUser = 
            (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
        
        // Non-admins can only update their own profile (excluding role)
        if (!authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            if (!currentUser.getId().equals(id)) {
                throw new UnauthorizedException("You can only update your own profile");
            }
            if (updateUserDto.getRole() != null) {
                throw new UnauthorizedException("You cannot change your own role");
            }
        }
        
        UserUseCase.UpdateUserCommand command = new UserUseCase.UpdateUserCommand();
        command.setName(updateUserDto.getName());
        command.setRole(updateUserDto.getRole());
        command.setIsActive(updateUserDto.getIsActive());
        
        if (updateUserDto.getPassword() != null) {
            User existingUser = userUseCase.findUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
            existingUser.setPassword(passwordEncoder.encode(updateUserDto.getPassword()));
            userUseCase.updateUser(id, command);
        }
        
        User user = userUseCase.updateUser(id, command);
        UserDto userDto = convertToDto(user);
        
        return ResponseEntity.ok(userDto);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userUseCase.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    
    
    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<?> changePassword(@PathVariable Long id,
                                           @RequestBody ChangePasswordDto changePasswordDto,
                                           Authentication authentication) {
        CustomUserDetailsService.CustomUserDetails currentUser = 
            (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
        
        // If not admin, verify current password
        if (!authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            if (!currentUser.getId().equals(id)) {
                throw new UnauthorizedException("You can only change your own password");
            }
            
            // Verify current password
            User existingUser = userUseCase.findUserById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
            
            if (!passwordEncoder.matches(changePasswordDto.getCurrentPassword(), existingUser.getPassword())) {
                throw new UnauthorizedException("Current password is incorrect");
            }
        }
        
        // Update password
        User user = userUseCase.findUserById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User", id));
        
        UserUseCase.UpdateUserCommand command = new UserUseCase.UpdateUserCommand();
        command.setPassword(passwordEncoder.encode(changePasswordDto.getNewPassword()));
        
        userUseCase.updateUser(id, command);
        
        return ResponseEntity.ok(java.util.Map.of("message", "Password changed successfully"));
    }
    
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        return dto;
    }
}