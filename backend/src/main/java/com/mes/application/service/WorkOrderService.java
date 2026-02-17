package com.mes.application.service;

import com.mes.application.port.in.WorkOrderUseCase;
import com.mes.application.port.out.WorkOrderPort;
import com.mes.common.exception.BusinessException;
import com.mes.common.exception.EntityNotFoundException;
import com.mes.common.exception.ErrorCode;
import com.mes.common.exception.InvalidStateException;
import com.mes.domain.model.Priority;
import com.mes.domain.model.WorkOrderModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class WorkOrderService implements WorkOrderUseCase {

    private static final Logger log = LoggerFactory.getLogger(WorkOrderService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final int MAX_RETRY_ATTEMPTS = 5;

    private final WorkOrderPort workOrderPort;
    private final TransactionTemplate transactionTemplate;

    public WorkOrderService(WorkOrderPort workOrderPort,
                            PlatformTransactionManager transactionManager) {
        this.workOrderPort = workOrderPort;
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    // ========== 생성 (발주번호 중복 시 재시도) ==========

    @Override
    public WorkOrderModel createWorkOrder(CreateWorkOrderCommand command) {
        WorkOrderModel workOrder = buildFromCommand(command);
        return saveWithRetry(workOrder);
    }

    /**
     * 발주번호 생성 + 저장을 시도하고, 중복 키 예외 시 재시도한다.
     * 각 시도마다 독립적인 트랜잭션을 사용한다.
     */
    private WorkOrderModel saveWithRetry(WorkOrderModel workOrder) {
        for (int attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
            workOrder.setWorkOrderNo(generateWorkOrderNo());

            try {
                return transactionTemplate.execute(status -> workOrderPort.save(workOrder));
            } catch (DataIntegrityViolationException e) {
                if (!isDuplicateKeyException(e)) {
                    throw e;
                }
                if (attempt == MAX_RETRY_ATTEMPTS) {
                    log.error("발주번호 생성 실패: {}회 재시도 후 포기", MAX_RETRY_ATTEMPTS);
                    throw new BusinessException(ErrorCode.WORK_ORDER_NO_GENERATION_FAILED,
                        "발주번호 생성 실패: " + MAX_RETRY_ATTEMPTS + "회 재시도 후 실패");
                }
                log.warn("발주번호 중복 발생 (시도 {}/{}), 재생성합니다", attempt, MAX_RETRY_ATTEMPTS);
            }
        }

        // 도달 불가
        throw new BusinessException(ErrorCode.WORK_ORDER_NO_GENERATION_FAILED);
    }

    private WorkOrderModel buildFromCommand(CreateWorkOrderCommand command) {
        WorkOrderModel workOrder = new WorkOrderModel();
        workOrder.setSupplyType(command.getSupplyType());
        workOrder.setCompanyName(command.getCompanyName());
        workOrder.setProductName(command.getProductName());
        workOrder.setProductCode(command.getProductCode());
        workOrder.setQuantity(command.getQuantity());
        workOrder.setUnit(command.getUnit());
        workOrder.setDueDate(command.getDueDate());
        workOrder.setPriority(command.getPriority() != null
            ? Priority.valueOf(command.getPriority())
            : Priority.MEDIUM);
        workOrder.setWorkType(command.getWorkType());
        workOrder.setInstructions(command.getInstructions());
        workOrder.setSelection(command.getSelection());
        workOrder.setAttachmentUrl(command.getAttachmentUrl());
        workOrder.setAssignedToId(command.getAssignedToId());
        return workOrder;
    }

    /**
     * work_order_no 컬럼의 Duplicate entry인지 판별한다.
     * MySQL의 중복 키 에러 메시지에 "Duplicate entry"가 포함된다.
     */
    private boolean isDuplicateKeyException(DataIntegrityViolationException e) {
        String message = e.getMostSpecificCause().getMessage();
        return message != null && message.contains("Duplicate entry");
    }

    /**
     * 발주번호 자동 생성
     * 형식: YYYYMMDD + 순번 3자리 (예: 20251205001)
     */
    private String generateWorkOrderNo() {
        String todayPrefix = LocalDate.now().format(DATE_FORMATTER);
        Optional<String> maxWorkOrderNo = workOrderPort.findMaxWorkOrderNoByDatePrefix(todayPrefix);

        int nextSequence = 1;
        if (maxWorkOrderNo.isPresent()) {
            String sequencePart = maxWorkOrderNo.get().substring(8);
            nextSequence = Integer.parseInt(sequencePart) + 1;
        }

        return todayPrefix + String.format("%03d", nextSequence);
    }

    // ========== 조회 ==========

    @Override
    @Transactional(readOnly = true)
    public Optional<WorkOrderModel> findWorkOrderById(Long id) {
        return workOrderPort.findById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkOrderModel> findAllWorkOrders() {
        return workOrderPort.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkOrderModel> findWorkOrdersByStatus(String status) {
        return workOrderPort.findByStatus(status);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkOrderModel> findWorkOrdersByAssignee(Long userId) {
        return workOrderPort.findByAssignedToId(userId);
    }

    // ========== 수정 (status, progress, startedAt, completedAt는 변경 불가) ==========

    @Override
    @Transactional
    public WorkOrderModel updateWorkOrder(Long id, UpdateWorkOrderCommand command) {
        WorkOrderModel workOrder = findOrThrow(id);

        if (command.getSupplyType() != null) {
            workOrder.setSupplyType(command.getSupplyType());
        }
        if (command.getCompanyName() != null) {
            workOrder.setCompanyName(command.getCompanyName());
        }
        if (command.getProductName() != null) {
            workOrder.setProductName(command.getProductName());
        }
        if (command.getProductCode() != null) {
            workOrder.setProductCode(command.getProductCode());
        }
        if (command.getQuantity() != null) {
            workOrder.setQuantity(command.getQuantity());
        }
        if (command.getUnit() != null) {
            workOrder.setUnit(command.getUnit());
        }
        if (command.getDueDate() != null) {
            workOrder.setDueDate(command.getDueDate());
        }
        if (command.getPriority() != null) {
            workOrder.setPriority(Priority.valueOf(command.getPriority()));
        }
        if (command.getWorkType() != null) {
            workOrder.setWorkType(command.getWorkType());
        }
        if (command.getInstructions() != null) {
            workOrder.setInstructions(command.getInstructions());
        }
        if (command.getSelection() != null) {
            workOrder.setSelection(command.getSelection());
        }
        if (command.getAttachmentUrl() != null) {
            workOrder.setAttachmentUrl(command.getAttachmentUrl());
        }
        if (command.getAssignedToId() != null) {
            workOrder.setAssignedToId(command.getAssignedToId());
        }
        workOrder.setUpdatedAt(LocalDateTime.now());

        return workOrderPort.save(workOrder);
    }

    // ========== 삭제 ==========

    @Override
    @Transactional
    public void deleteWorkOrder(Long id) {
        findOrThrow(id);
        workOrderPort.deleteById(id);
    }

    // ========== 상태 전이 (도메인 모델에 위임) ==========

    @Override
    @Transactional
    public void startWork(Long workOrderId) {
        WorkOrderModel workOrder = findOrThrow(workOrderId);
        try {
            workOrder.startWork();
        } catch (IllegalStateException e) {
            throw new InvalidStateException(ErrorCode.WORK_ORDER_INVALID_STATUS, e.getMessage());
        }
        workOrder.setUpdatedAt(LocalDateTime.now());
        workOrderPort.save(workOrder);
    }

    @Override
    @Transactional
    public void completeWork(Long workOrderId) {
        WorkOrderModel workOrder = findOrThrow(workOrderId);
        try {
            workOrder.completeWork();
        } catch (IllegalStateException e) {
            throw new InvalidStateException(ErrorCode.WORK_ORDER_INVALID_STATUS, e.getMessage());
        }
        workOrder.setUpdatedAt(LocalDateTime.now());
        workOrderPort.save(workOrder);
    }

    @Override
    @Transactional
    public void pauseWork(Long workOrderId) {
        WorkOrderModel workOrder = findOrThrow(workOrderId);
        try {
            workOrder.pauseWork();
        } catch (IllegalStateException e) {
            throw new InvalidStateException(ErrorCode.WORK_ORDER_INVALID_STATUS, e.getMessage());
        }
        workOrder.setUpdatedAt(LocalDateTime.now());
        workOrderPort.save(workOrder);
    }

    @Override
    @Transactional
    public void resumeWork(Long workOrderId) {
        WorkOrderModel workOrder = findOrThrow(workOrderId);
        try {
            workOrder.resumeWork();
        } catch (IllegalStateException e) {
            throw new InvalidStateException(ErrorCode.WORK_ORDER_INVALID_STATUS, e.getMessage());
        }
        workOrder.setUpdatedAt(LocalDateTime.now());
        workOrderPort.save(workOrder);
    }

    @Override
    @Transactional
    public void cancelWork(Long workOrderId) {
        WorkOrderModel workOrder = findOrThrow(workOrderId);
        try {
            workOrder.cancelWork();
        } catch (IllegalStateException e) {
            throw new InvalidStateException(ErrorCode.WORK_ORDER_INVALID_STATUS, e.getMessage());
        }
        workOrder.setUpdatedAt(LocalDateTime.now());
        workOrderPort.save(workOrder);
    }

    @Override
    @Transactional
    public void reactivateWork(Long workOrderId) {
        WorkOrderModel workOrder = findOrThrow(workOrderId);
        try {
            workOrder.reactivateWork();
        } catch (IllegalStateException e) {
            throw new InvalidStateException(ErrorCode.WORK_ORDER_INVALID_STATUS, e.getMessage());
        }
        workOrder.setUpdatedAt(LocalDateTime.now());
        workOrderPort.save(workOrder);
    }

    @Override
    @Transactional
    public void updateProgress(Long workOrderId, Integer progress) {
        WorkOrderModel workOrder = findOrThrow(workOrderId);
        workOrder.updateProgress(progress);
        workOrder.setUpdatedAt(LocalDateTime.now());
        workOrderPort.save(workOrder);
    }

    // ========== 공통 ==========

    private WorkOrderModel findOrThrow(Long id) {
        return workOrderPort.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND,
                "작업지시서를 찾을 수 없습니다 (id: " + id + ")"));
    }
}
