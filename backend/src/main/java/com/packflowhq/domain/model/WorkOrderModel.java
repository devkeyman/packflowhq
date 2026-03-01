package com.packflowhq.domain.model;

import java.time.LocalDateTime;

public class WorkOrderModel {
    private Long id;
    private String workOrderNo;           // 발주번호 (자동생성: YYYYMMDD + 순번 3자리)
    private String supplyType;            // 공급구분 (원청/하청)
    private String companyName;           // 업체
    private String productName;           // 제품명
    private String productCode;           // 제품코드
    private Integer quantity;             // 수량
    private String unit;                  // 단위
    private LocalDateTime dueDate;        // 마감일
    private Priority priority;            // 우선순위
    private WorkStatus status;            // 상태
    private String workType;              // 작업유형
    private String instructions;          // 설명
    private String selection;             // 선택
    private String attachmentUrl;         // 파일첨부 (보류)
    private Integer progress;             // 진행률
    private Long assignedToId;            // 담당자 ID
    private LocalDateTime startedAt;      // 작업 시작 시간
    private LocalDateTime completedAt;    // 작업 완료 시간
    private LocalDateTime createdAt;      // 생성 시간
    private LocalDateTime updatedAt;      // 수정 시간

    public WorkOrderModel() {
        this.priority = Priority.MEDIUM;
        this.status = WorkStatus.PENDING;
        this.progress = 0;
    }

    // ========== 상태 전이 메서드 (상태 변경은 반드시 이 메서드를 통해서만) ==========

    public void startWork() {
        if (this.status != WorkStatus.PENDING) {
            throw new IllegalStateException("Can only start work from PENDING status");
        }
        this.status = WorkStatus.IN_PROGRESS;
        this.startedAt = LocalDateTime.now();
    }

    public void completeWork() {
        if (this.status != WorkStatus.IN_PROGRESS) {
            throw new IllegalStateException("Can only complete work from IN_PROGRESS status");
        }
        this.status = WorkStatus.COMPLETED;
        this.progress = 100;
        this.completedAt = LocalDateTime.now();
    }

    public void pauseWork() {
        if (this.status != WorkStatus.IN_PROGRESS) {
            throw new IllegalStateException("Can only pause work from IN_PROGRESS status");
        }
        this.status = WorkStatus.PAUSED;
    }

    public void resumeWork() {
        if (this.status != WorkStatus.PAUSED) {
            throw new IllegalStateException("Can only resume work from PAUSED status");
        }
        this.status = WorkStatus.IN_PROGRESS;
    }

    public void cancelWork() {
        if (this.status == WorkStatus.COMPLETED || this.status == WorkStatus.CANCELLED) {
            throw new IllegalStateException("Cannot cancel completed or already cancelled work");
        }
        this.status = WorkStatus.CANCELLED;
    }

    public void reactivateWork() {
        if (this.status != WorkStatus.CANCELLED && this.status != WorkStatus.COMPLETED) {
            throw new IllegalStateException("Can only reactivate work from CANCELLED or COMPLETED status");
        }
        this.status = WorkStatus.PENDING;
        this.startedAt = null;
        this.completedAt = null;
        this.progress = 0;
    }

    public void updateProgress(Integer newProgress) {
        if (newProgress < 0 || newProgress > 100) {
            throw new IllegalArgumentException("Progress must be between 0 and 100");
        }
        this.progress = newProgress;
    }

    // ========== Getters and Setters ==========

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWorkOrderNo() { return workOrderNo; }
    public void setWorkOrderNo(String workOrderNo) { this.workOrderNo = workOrderNo; }

    public String getSupplyType() { return supplyType; }
    public void setSupplyType(String supplyType) { this.supplyType = supplyType; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public WorkStatus getStatus() { return status; }
    public void setStatus(WorkStatus status) { this.status = status; }

    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getSelection() { return selection; }
    public void setSelection(String selection) { this.selection = selection; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

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
