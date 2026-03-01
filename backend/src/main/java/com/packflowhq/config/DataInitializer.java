package com.packflowhq.config;

import com.packflowhq.adapter.out.persistence.entity.Role;
import com.packflowhq.adapter.out.persistence.entity.User;
import com.packflowhq.adapter.out.persistence.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {
    
    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin user exists
            if (!userRepository.existsByEmail("admin@mes.com")) {
                User admin = new User();
                admin.setEmail("admin@mes.com");
                admin.setName("관리자");
                admin.setRole(Role.ADMIN);
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setIsActive(true);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setUpdatedAt(LocalDateTime.now());
                userRepository.save(admin);
                System.out.println("Admin user created: admin@mes.com / admin123");
            }
            
            // Create test manager
            if (!userRepository.existsByEmail("manager@mes.com")) {
                User manager = new User();
                manager.setEmail("manager@mes.com");
                manager.setName("매니저");
                manager.setRole(Role.MANAGER);
                manager.setPassword(passwordEncoder.encode("manager123"));
                manager.setIsActive(true);
                manager.setCreatedAt(LocalDateTime.now());
                manager.setUpdatedAt(LocalDateTime.now());
                userRepository.save(manager);
                System.out.println("Manager user created: manager@mes.com / manager123");
            }
            
            // Create test worker
            if (!userRepository.existsByEmail("worker@mes.com")) {
                User worker = new User();
                worker.setEmail("worker@mes.com");
                worker.setName("작업자");
                worker.setRole(Role.WORKER);
                worker.setPassword(passwordEncoder.encode("worker123"));
                worker.setIsActive(true);
                worker.setCreatedAt(LocalDateTime.now());
                worker.setUpdatedAt(LocalDateTime.now());
                userRepository.save(worker);
                System.out.println("Worker user created: worker@mes.com / worker123");
            }
        };
    }
}