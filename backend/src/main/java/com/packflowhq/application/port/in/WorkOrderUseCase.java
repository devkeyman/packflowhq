package com.packflowhq.application.port.in;

import com.packflowhq.domain.model.WorkOrderModel;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface WorkOrderUseCase {
    WorkOrderModel createWorkOrder(CreateWorkOrderCommand command);
    Optional<WorkOrderModel> findWorkOrderById(Long id);
    List<WorkOrderModel> findAllWorkOrders();
    List<WorkOrderModel> findWorkOrdersByStatus(String status);
    List<WorkOrderModel> findWorkOrdersByAssignee(Long userId);
    WorkOrderModel updateWorkOrder(Long id, UpdateWorkOrderCommand command);
    void deleteWorkOrder(Long id);
    void startWork(Long workOrderId);
    void completeWork(Long workOrderId);
    void pauseWork(Long workOrderId);
    void resumeWork(Long workOrderId);
    void cancelWork(Long workOrderId);
    void reactivateWork(Long workOrderId);
    void updateProgress(Long workOrderId, Integer progress);

    class CreateWorkOrderCommand {
        // 발주번호는 서버에서 자동 생성됨
        private String supplyType;          // 공급구분
        private String companyName;         // 업체
        private String productName;         // 제품명
        private String productCode;         // 제품코드
        private Integer quantity;           // 수량
        private String unit;                // 단위
        private LocalDateTime dueDate;      // 마감일
        private String priority;            // 우선순위
        private String workType;            // 작업유형
        private String instructions;        // 설명
        private String selection;           // 선택
        private String attachmentUrl;       // 파일첨부 (보류)
        private Long assignedToId;          // 담당자 ID

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

    class UpdateWorkOrderCommand {
        // 발주번호는 수정 불가 (자동 생성된 값)
        private String supplyType;          // 공급구분
        private String companyName;         // 업체
        private String productName;         // 제품명
        private String productCode;         // 제품코드
        private Integer quantity;           // 수량
        private String unit;                // 단위
        private LocalDateTime dueDate;      // 마감일
        private String priority;            // 우선순위
        private String workType;            // 작업유형
        private String instructions;        // 설명
        private String selection;           // 선택
        private String attachmentUrl;       // 파일첨부 (보류)
        private Long assignedToId;          // 담당자 ID

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
}
