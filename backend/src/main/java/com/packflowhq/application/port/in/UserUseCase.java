package com.packflowhq.application.port.in;

import com.packflowhq.domain.model.User;
import java.util.List;
import java.util.Optional;

public interface UserUseCase {
    User createUser(CreateUserCommand command);
    Optional<User> findUserById(Long id);
    Optional<User> findUserByEmail(String email);
    List<User> findAllUsers();
    User updateUser(Long id, UpdateUserCommand command);
    void deleteUser(Long id);
    boolean authenticate(String email, String password);
    
    class CreateUserCommand {
        private String email;
        private String name;
        private String password;
        private String role;
        
        public CreateUserCommand(String email, String name, String password, String role) {
            this.email = email;
            this.name = name;
            this.password = password;
            this.role = role;
        }
        
        public String getEmail() { return email; }
        public String getName() { return name; }
        public String getPassword() { return password; }
        public String getRole() { return role; }
    }
    
    class UpdateUserCommand {
        private String name;
        private String role;
        private Boolean isActive;
        private String password;
        
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
        
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}