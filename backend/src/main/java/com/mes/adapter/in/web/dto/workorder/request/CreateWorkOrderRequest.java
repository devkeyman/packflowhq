package com.mes.adapter.in.web.dto.workorder.request;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

/**
 * 작업지시서 등록 요청 DTO
 * 발주번호는 서버에서 자동 생성됨
 */
public class CreateWorkOrderRequest {

    @NotBlank(message = "공급구분은 필수입니다")
    private String supplyType;

    @NotBlank(message = "업체명은 필수입니다")
    private String companyName;

    @NotBlank(message = "제품명은 필수입니다")
    private String productName;

    private String productCode;

    @NotNull(message = "수량은 필수입니다")
    @Min(value = 1, message = "수량은 1 이상이어야 합니다")
    private Integer quantity;

    private String unit;

    @NotNull(message = "마감일은 필수입니다")
    @FutureOrPresent(message = "마감일은 오늘 이후여야 합니다")
    private LocalDateTime dueDate;

    private String priority = "MEDIUM";

    private String workType;

    private String instructions;

    private String selection;

    private String attachmentUrl;

    private Long assignedToId;

    // Getters and Setters
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

    public String getWorkType() { return workType; }
    public void setWorkType(String workType) { this.workType = workType; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getSelection() { return selection; }
    public void setSelection(String selection) { this.selection = selection; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public Long getAssignedToId() { return assignedToId; }
    public void setAssignedToId(Long assignedToId) { this.assignedToId = assignedToId; }
}
