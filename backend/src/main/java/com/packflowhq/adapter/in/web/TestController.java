package com.packflowhq.adapter.in.web;

import com.packflowhq.adapter.out.persistence.entity.User;
import com.packflowhq.adapter.out.persistence.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/health")
    public String health() {
        return "Backend is running! Time: " + java.time.LocalDateTime.now();
    }
    
    @GetMapping("/db")
    public String testDatabase() {
        try {
            long count = userRepository.count();
            return "Database connection OK! User count: " + count;
        } catch (Exception e) {
            return "Database connection failed: " + e.getMessage();
        }
    }
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @PostMapping("/user")
    public User createTestUser() {
        User user = new User();
        user.setEmail("test_" + System.currentTimeMillis() + "@example.com");
        user.setPassword("password123");
        user.setName("테스트 사용자");
        return userRepository.save(user);
    }
}