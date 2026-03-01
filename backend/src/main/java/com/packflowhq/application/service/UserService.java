package com.packflowhq.application.service;

import com.packflowhq.application.port.in.UserUseCase;
import com.packflowhq.application.port.out.UserPort;
import com.packflowhq.domain.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserUseCase {
    
    private final UserPort userPort;
    
    public UserService(UserPort userPort) {
        this.userPort = userPort;
    }
    
    @Override
    public User createUser(CreateUserCommand command) {
        if (userPort.existsByEmail(command.getEmail())) {
            throw new IllegalArgumentException("Email already exists: " + command.getEmail());
        }
        
        User user = new User();
        user.setEmail(command.getEmail());
        user.setName(command.getName());
        user.setPassword(command.getPassword());
        user.setRole(command.getRole() != null ? command.getRole() : "WORKER");
        user.setIsActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        return userPort.save(user);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findUserById(Long id) {
        return userPort.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<User> findUserByEmail(String email) {
        return userPort.findByEmail(email);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userPort.findAll();
    }
    
    @Override
    public User updateUser(Long id, UpdateUserCommand command) {
        User user = userPort.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        
        if (command.getName() != null) {
            user.setName(command.getName());
        }
        if (command.getRole() != null) {
            user.setRole(command.getRole());
        }
        if (command.getIsActive() != null) {
            user.setIsActive(command.getIsActive());
        }
        if (command.getPassword() != null) {
            user.setPassword(command.getPassword());
        }
        user.setUpdatedAt(LocalDateTime.now());
        
        return userPort.save(user);
    }
    
    @Override
    public void deleteUser(Long id) {
        if (!userPort.findById(id).isPresent()) {
            throw new IllegalArgumentException("User not found with id: " + id);
        }
        userPort.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean authenticate(String email, String password) {
        Optional<User> user = userPort.findByEmail(email);
        return user.isPresent() && 
               user.get().getPassword().equals(password) && 
               user.get().getIsActive();
    }
}