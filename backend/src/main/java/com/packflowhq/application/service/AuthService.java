package com.packflowhq.application.service;

import com.packflowhq.adapter.in.web.security.CustomUserDetailsService;
import com.packflowhq.adapter.in.web.security.JwtTokenProvider;
import com.packflowhq.adapter.out.persistence.entity.User;
import com.packflowhq.adapter.out.persistence.repository.UserRepository;
import com.packflowhq.application.port.in.AuthUseCase;
import com.packflowhq.common.dto.auth.LoginRequestDto;
import com.packflowhq.common.dto.auth.LoginResponseDto;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService implements AuthUseCase {
    
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    public AuthService(AuthenticationManager authenticationManager,
                      JwtTokenProvider tokenProvider,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public LoginResponseDto login(LoginRequestDto loginRequest) {
        System.out.println("=== AuthService Login Debug ===");
        System.out.println("Email received: " + loginRequest.getEmail());
        System.out.println("Password received (length): " + loginRequest.getPassword().length());
        
        // DB에서 사용자 조회
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElse(null);
        
        if (user == null) {
            System.out.println("User not found in database!");
        } else {
            System.out.println("User found: " + user.getEmail());
            System.out.println("User active: " + user.getIsActive());
            System.out.println("Stored password hash: " + user.getPassword());
            
            // 비밀번호 직접 검증
            boolean passwordMatches = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            System.out.println("Password verification result: " + passwordMatches);
            
            if (!passwordMatches) {
                // 테스트용 암호화된 비밀번호 생성
                String testEncoded = passwordEncoder.encode(loginRequest.getPassword());
                System.out.println("Test encoding of input password: " + testEncoded);
            }
        }
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(),
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(loginRequest.getEmail());
        
        CustomUserDetailsService.CustomUserDetails userDetails = 
            (CustomUserDetailsService.CustomUserDetails) authentication.getPrincipal();
        
        User authenticatedUser = userRepository.findByEmail(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new LoginResponseDto(
            jwt,
            refreshToken,
            userDetails.getId(),
            userDetails.getUsername(),
            userDetails.getName(),
            authenticatedUser.getRole() != null ? authenticatedUser.getRole().name() : "WORKER"
        );
    }
    
    @Override
    public LoginResponseDto refreshToken(String refreshToken) {
        if (tokenProvider.validateToken(refreshToken)) {
            String username = tokenProvider.getUsernameFromToken(refreshToken);
            User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            String newAccessToken = tokenProvider.generateTokenFromUsername(username);
            String newRefreshToken = tokenProvider.generateRefreshToken(username);
            
            return new LoginResponseDto(
                newAccessToken,
                newRefreshToken,
                user.getId(),
                user.getEmail(),
                user.getName(),
                user.getRole() != null ? user.getRole().name() : "WORKER"
            );
        }
        throw new RuntimeException("Invalid refresh token");
    }
    
    @Override
    public void logout(String email) {
        // In JWT, logout is typically handled on the client side by removing the token
        // Here we can add additional logic if needed (e.g., token blacklisting)
        SecurityContextHolder.clearContext();
    }
}