package com.packflowhq.common.dto.user;

import jakarta.validation.constraints.Size;

public class UpdateUserDto {
    
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    private String role;
    
    private Boolean isActive;
    
    @Size(min = 6, message = "Password must be at least 6 characters")
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