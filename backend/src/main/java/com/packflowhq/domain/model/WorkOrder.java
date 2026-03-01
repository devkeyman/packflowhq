package com.packflowhq.domain.model;

import java.time.LocalDateTime;

public class WorkOrder {
    private Long id;
    private String orderNumber;
    private String productName;
    private String productCode;
    private Integer quantity;
    private LocalDateTime dueDate;
    private String priority;
    private String status;
    private String instructions;
    private Integer progress;
    private Long assignedToId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public WorkOrder() {
        this.priority = "MEDIUM";
        this.status = "PENDING";
        this.progress = 0;
    }
    
    public void startWork() {
        if (!"PENDING".equals(this.status)) {
            throw new IllegalStateException("Can only start work from PENDING status");
        }
        this.status = "IN_PROGRESS";
        this.startedAt = LocalDateTime.now();
    }
    
    public void completeWork() {
        if (!"IN_PROGRESS".equals(this.status)) {
            throw new IllegalStateException("Can only complete work from IN_PROGRESS status");
        }
        this.status = "COMPLETED";
        this.progress = 100;
        this.completedAt = LocalDateTime.now();
    }
    
    public void updateProgress(Integer newProgress) {
        if (newProgress < 0 || newProgress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }
        this.progress = newProgress;
    }
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    
    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    
    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }
    
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    
    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
    
    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
    
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}