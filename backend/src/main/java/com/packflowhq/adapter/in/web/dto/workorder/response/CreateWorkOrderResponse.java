package com.packflowhq.adapter.in.web.dto.workorder.response;

import java.time.LocalDateTime;

/**
 * 작업지시서 등록 응답 DTO
 * - 등록 완료 후 생성된 정보 반환
 */
public class CreateWorkOrderResponse {

    private Long id;
    private String workOrderNo;
    private String supplyType;
    private String companyName;
    private String productName;
    private String status;
    private String priority;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;

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

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDateTime getDueDate() { return dueDate; }
    public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
