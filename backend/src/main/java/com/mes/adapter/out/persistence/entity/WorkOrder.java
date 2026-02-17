package com.mes.adapter.out.persistence.entity;

import com.mes.adapter.out.persistence.entity.enums.Priority;
import com.mes.adapter.out.persistence.entity.enums.SupplyType;
import com.mes.adapter.out.persistence.entity.enums.WorkStatus;
import com.mes.adapter.out.persistence.entity.enums.WorkType;
import jakarta.persistence.*;
import org.hibernate.annotations.Comment;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Entity
@Table(name = "work_orders")
@Comment("작업 지시서")
public class WorkOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Comment("고유 ID")
    private Long id;

    @Column(name = "work_order_no", unique = true, nullable = false, length = 20)
    @Comment("발주번호 (형식: YYYYMMDD + 순번 3자리, 예: 20251205001)")
    private String workOrderNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "supply_type", nullable = false)
    @Comment("공급구분 (PRIMARY: 원청, SUBCONTRACT: 하청)")
    private SupplyType supplyType;

    @Column(name = "company_name", nullable = false)
    @Comment("업체명")
    private String companyName;

    @Column(name = "product_name", nullable = false)
    @Comment("제품명")
    private String productName;

    @Column(name = "product_code")
    @Comment("제품코드")
    private String productCode;

    @Column(nullable = false)
    @Comment("수량")
    private Integer quantity;

    @Column(name = "unit")
    @Comment("단위 (EA, BOX, KG 등)")
    private String unit;

    @Column(name = "due_date", nullable = false)
    @Comment("마감일")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Comment("우선순위 (LOW, MEDIUM, HIGH, URGENT)")
    private Priority priority = Priority.MEDIUM;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Comment("상태 (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)")
    private WorkStatus status = WorkStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "work_type")
    @Comment("작업유형 (PRODUCTION, ASSEMBLY, PACKAGING, INSPECTION, OTHER)")
    private WorkType workType;

    @Column(columnDefinition = "TEXT")
    @Comment("설명/작업지시 내용")
    private String instructions;

    @Column(name = "selection")
    @Comment("선택 옵션")
    private String selection;

    @Column(name = "attachment_url")
    @Comment("파일첨부 URL (보류)")
    private String attachmentUrl;

    @Column(nullable = false)
    @Comment("진행률 (0-100)")
    private Integer progress = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    @Comment("담당자 ID")
    private User assignedTo;

    @Column(name = "started_at")
    @Comment("작업 시작 시간")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    @Comment("작업 완료 시간")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    @Comment("생성 시간")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @Comment("수정 시간")
    private LocalDateTime updatedAt;

    @Column(name = "actual_quantity")
    @Comment("실제 생산 수량")
    private Integer actualQuantity;

    @Column(columnDefinition = "TEXT")
    @Comment("비고")
    private String notes;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getWorkOrderNo() { return workOrderNo; }
    public void setWorkOrderNo(String workOrderNo) { this.workOrderNo = workOrderNo; }

    public SupplyType getSupplyType() { return supplyType; }
    public void setSupplyType(SupplyType supplyType) { this.supplyType = supplyType; }

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

    public WorkType getWorkType() { return workType; }
    public void setWorkType(WorkType workType) { this.workType = workType; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getSelection() { return selection; }
    public void setSelection(String selection) { this.selection = selection; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public User getAssignedTo() { return assignedTo; }
    public void setAssignedTo(User assignedTo) { this.assignedTo = assignedTo; }

    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Integer getActualQuantity() { return actualQuantity; }
    public void setActualQuantity(Integer actualQuantity) { this.actualQuantity = actualQuantity; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}