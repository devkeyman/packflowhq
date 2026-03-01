package com.packflowhq.adapter.in.web.security;

import com.packflowhq.adapter.out.persistence.entity.User;
import com.packflowhq.adapter.out.persistence.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        return createUserDetails(user);
    }

    private UserDetails createUserDetails(User user) {
        return new CustomUserDetails(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                user.getName(),
                getAuthorities(user),
                user.getIsActive()
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        String role = user.getRole() != null ? user.getRole().name() : "WORKER";
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role));
    }

    public static class CustomUserDetails implements UserDetails {
        private final Long id;
        private final String email;
        private final String password;
        private final String name;
        private final Collection<? extends GrantedAuthority> authorities;
        private final boolean isActive;

        public CustomUserDetails(Long id, String email, String password, String name,
                                Collection<? extends GrantedAuthority> authorities, boolean isActive) {
            this.id = id;
            this.email = email;
            this.password = password;
            this.name = name;
            this.authorities = authorities;
            this.isActive = isActive;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return authorities;
        }

        @Override
        public String getPassword() {
            return password;
        }

        @Override
        public String getUsername() {
            return email;
        }

        @Override
        public boolean isAccountNonExpired() {
            return true;
        }

        @Override
        public boolean isAccountNonLocked() {
            return true;
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return true;
        }

        @Override
        public boolean isEnabled() {
            return isActive;
        }
    }
}