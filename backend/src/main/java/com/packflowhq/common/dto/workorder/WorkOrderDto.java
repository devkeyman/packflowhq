package com.packflowhq.common.dto.workorder;

import java.time.LocalDateTime;

public class WorkOrderDto {
    private Long id;
    private String workOrderNo;            // 발주번호 (자동생성: YYYYMMDD + 순번 3자리)
    private String supplyType;             // 공급구분
    private String companyName;            // 업체 (신규)
    private String productName;            // 제품명
    private String productCode;            // 제품코드
    private Integer quantity;              // 수량
    private String unit;                   // 단위 (신규)
    private LocalDateTime dueDate;         // 마감일
    private String priority;               // 우선순위
    private String status;                 // 상태
    private String workType;               // 작업유형 (신규)
    private String instructions;           // 설명
    private String selection;              // 선택 (신규)
    private String attachmentUrl;          // 파일첨부 (신규 - 보류)
    private Integer progress;              // 진행률
    private Long assignedToId;             // 담당자 ID
    private String assignedToName;         // 담당자명
    private LocalDateTime startedAt;       // 작업 시작 시간
    private LocalDateTime completedAt;     // 작업 완료 시간
    private LocalDateTime createdAt;       // 생성 시간
    private LocalDateTime updatedAt;       // 수정 시간

    // Getters and Setters
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

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

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

    public String getAssignedToName() { return assignedToName; }
    public void setAssignedToName(String assignedToName) { this.assignedToName = assignedToName; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}