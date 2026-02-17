package com.mes.adapter.out.persistence.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Comment;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Comment("사용자 정보")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("사용자 고유 ID")
    private Long id;

    @Column(unique = true, nullable = false)
    @Comment("이메일 (로그인 ID)")
    private String email;

    @Column(nullable = false)
    @Comment("사용자 이름")
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Comment("역할 (ADMIN: 관리자, MANAGER: 매니저, WORKER: 작업자)")
    private Role role = Role.WORKER;

    @Column(nullable = false)
    @Comment("암호화된 비밀번호")
    private String password;

    @Column(name = "created_at")
    @Comment("생성일시")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Comment("수정일시")
    private LocalDateTime updatedAt;

    @Column(name = "is_active")
    @Comment("계정 활성화 여부")
    private Boolean isActive = true;

    @OneToMany(mappedBy = "assignedTo", cascade = CascadeType.ALL)
    private List<WorkOrder> workOrders = new ArrayList<>();

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }


    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }


    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public List<WorkOrder> getWorkOrders() { return workOrders; }
    public void setWorkOrders(List<WorkOrder> workOrders) { this.workOrders = workOrders; }
}
