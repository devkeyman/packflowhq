package com.packflowhq.common.dto.workorder;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class CreateWorkOrderDto {

    // 발주번호(workOrderNo)는 서버에서 자동 생성되므로 요청에 포함하지 않음

    @NotBlank(message = "Supply type is required")
    private String supplyType;                      // 공급구분 (신규)

    @NotBlank(message = "Company name is required")
    private String companyName;                     // 업체 (신규)

    @NotBlank(message = "Product name is required")
    private String productName;                     // 제품명

    private String productCode;                     // 제품코드

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;                       // 수량

    private String unit;                            // 단위 (신규)

    @NotNull(message = "Due date is required")
    @FutureOrPresent(message = "Due date must be today or in the future")
    private LocalDateTime dueDate;                  // 마감일

    private String priority = "MEDIUM";             // 우선순위

    private String workType;                        // 작업유형 (신규)

    private String instructions;                    // 설명

    private String selection;                       // 선택 (신규)

    private String attachmentUrl;                   // 파일첨부 (신규 - 보류)

    private Long assignedToId;                      // 담당자 ID

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
