package com.mes.common.mapper;

import com.mes.adapter.out.persistence.entity.User;
import com.mes.adapter.out.persistence.entity.WorkOrder;
import com.mes.adapter.out.persistence.entity.enums.SupplyType;
import com.mes.adapter.out.persistence.entity.enums.WorkType;
import com.mes.common.dto.workorder.WorkOrderDto;
import com.mes.domain.model.Priority;
import com.mes.domain.model.WorkOrderModel;
import com.mes.domain.model.WorkStatus;
import org.springframework.stereotype.Component;

@Component
public class WorkOrderMapper {

    public WorkOrderModel toDomain(WorkOrder entity) {
        if (entity == null) {
            return null;
        }

        WorkOrderModel domain = new WorkOrderModel();
        domain.setId(entity.getId());
        domain.setWorkOrderNo(entity.getWorkOrderNo());
        mapEntityEnumsToDomain(entity, domain);
        mapEntityCommonFields(entity, domain);
        domain.setAssignedToId(entity.getAssignedTo() != null ? entity.getAssignedTo().getId() : null);
        mapEntityTimestamps(entity, domain);

        return domain;
    }

    public WorkOrder toEntity(WorkOrderModel domain) {
        if (domain == null) {
            return null;
        }

        WorkOrder entity = new WorkOrder();
        entity.setId(domain.getId());
        entity.setWorkOrderNo(domain.getWorkOrderNo());
        mapDomainToEntityEnums(domain, entity);
        mapDomainCommonFields(domain, entity);
        mapAssignedUser(domain, entity);
        mapDomainTimestamps(domain, entity);

        return entity;
    }

    public WorkOrderDto toDto(WorkOrder entity) {
        if (entity == null) {
            return null;
        }

        WorkOrderDto dto = new WorkOrderDto();
        dto.setId(entity.getId());
        dto.setWorkOrderNo(entity.getWorkOrderNo());
        mapEntityEnumsToDto(entity, dto);
        mapEntityCommonFields(entity, dto);
        mapAssignedToDto(entity, dto);
        mapEntityTimestamps(entity, dto);

        return dto;
    }

    // ========== Entity -> Domain 매핑 ==========

    private void mapEntityEnumsToDomain(WorkOrder entity, WorkOrderModel target) {
        target.setSupplyType(enumToString(entity.getSupplyType()));
        target.setPriority(entity.getPriority() != null
            ? Priority.valueOf(entity.getPriority().name()) : null);
        target.setStatus(entity.getStatus() != null
            ? WorkStatus.valueOf(entity.getStatus().name()) : null);
        target.setWorkType(enumToString(entity.getWorkType()));
    }

    // ========== Entity -> DTO 매핑 ==========

    private void mapEntityEnumsToDto(WorkOrder entity, WorkOrderDto target) {
        target.setSupplyType(enumToString(entity.getSupplyType()));
        target.setPriority(enumToString(entity.getPriority()));
        target.setStatus(enumToString(entity.getStatus()));
        target.setWorkType(enumToString(entity.getWorkType()));
    }

    private void mapEntityCommonFields(WorkOrder entity, WorkOrderModel target) {
        target.setCompanyName(entity.getCompanyName());
        target.setProductName(entity.getProductName());
        target.setProductCode(entity.getProductCode());
        target.setQuantity(entity.getQuantity());
        target.setUnit(entity.getUnit());
        target.setDueDate(entity.getDueDate());
        target.setInstructions(entity.getInstructions());
        target.setSelection(entity.getSelection());
        target.setAttachmentUrl(entity.getAttachmentUrl());
        target.setProgress(entity.getProgress());
    }

    private void mapEntityCommonFields(WorkOrder entity, WorkOrderDto target) {
        target.setCompanyName(entity.getCompanyName());
        target.setProductName(entity.getProductName());
        target.setProductCode(entity.getProductCode());
        target.setQuantity(entity.getQuantity());
        target.setUnit(entity.getUnit());
        target.setDueDate(entity.getDueDate());
        target.setInstructions(entity.getInstructions());
        target.setSelection(entity.getSelection());
        target.setAttachmentUrl(entity.getAttachmentUrl());
        target.setProgress(entity.getProgress());
    }

    private void mapEntityTimestamps(WorkOrder entity, WorkOrderModel target) {
        target.setStartedAt(entity.getStartedAt());
        target.setCompletedAt(entity.getCompletedAt());
        target.setCreatedAt(entity.getCreatedAt());
        target.setUpdatedAt(entity.getUpdatedAt());
    }

    private void mapEntityTimestamps(WorkOrder entity, WorkOrderDto target) {
        target.setStartedAt(entity.getStartedAt());
        target.setCompletedAt(entity.getCompletedAt());
        target.setCreatedAt(entity.getCreatedAt());
        target.setUpdatedAt(entity.getUpdatedAt());
    }

    private void mapAssignedToDto(WorkOrder entity, WorkOrderDto dto) {
        if (entity.getAssignedTo() != null) {
            dto.setAssignedToId(entity.getAssignedTo().getId());
            dto.setAssignedToName(entity.getAssignedTo().getName());
        }
    }

    // ========== Domain -> Entity 매핑 ==========

    private void mapDomainToEntityEnums(WorkOrderModel domain, WorkOrder entity) {
        entity.setSupplyType(stringToEnum(domain.getSupplyType(), SupplyType.class, null));
        entity.setPriority(domain.getPriority() != null
            ? com.mes.adapter.out.persistence.entity.enums.Priority.valueOf(domain.getPriority().name())
            : com.mes.adapter.out.persistence.entity.enums.Priority.MEDIUM);
        entity.setStatus(domain.getStatus() != null
            ? com.mes.adapter.out.persistence.entity.enums.WorkStatus.valueOf(domain.getStatus().name())
            : com.mes.adapter.out.persistence.entity.enums.WorkStatus.PENDING);
        entity.setWorkType(stringToEnum(domain.getWorkType(), WorkType.class, null));
    }

    private void mapDomainCommonFields(WorkOrderModel domain, WorkOrder entity) {
        entity.setCompanyName(domain.getCompanyName());
        entity.setProductName(domain.getProductName());
        entity.setProductCode(domain.getProductCode());
        entity.setQuantity(domain.getQuantity());
        entity.setUnit(domain.getUnit());
        entity.setDueDate(domain.getDueDate());
        entity.setInstructions(domain.getInstructions());
        entity.setSelection(domain.getSelection());
        entity.setAttachmentUrl(domain.getAttachmentUrl());
        entity.setProgress(domain.getProgress());
    }

    private void mapDomainTimestamps(WorkOrderModel domain, WorkOrder entity) {
        entity.setStartedAt(domain.getStartedAt());
        entity.setCompletedAt(domain.getCompletedAt());
        entity.setCreatedAt(domain.getCreatedAt());
        entity.setUpdatedAt(domain.getUpdatedAt());
    }

    private void mapAssignedUser(WorkOrderModel domain, WorkOrder entity) {
        if (domain.getAssignedToId() != null) {
            User assignedUser = new User();
            assignedUser.setId(domain.getAssignedToId());
            entity.setAssignedTo(assignedUser);
        }
    }

    // ========== 유틸리티 메서드 ==========

    private String enumToString(Enum<?> value) {
        return value != null ? value.name() : null;
    }

    private <T extends Enum<T>> T stringToEnum(String value, Class<T> enumClass, T defaultValue) {
        if (value == null || value.isEmpty()) {
            return defaultValue;
        }
        try {
            return Enum.valueOf(enumClass, value);
        } catch (IllegalArgumentException e) {
            return defaultValue;
        }
    }
}
