package com.mes.adapter.in.web.controller;

import com.mes.adapter.in.web.dto.workorder.request.CreateWorkOrderRequest;
import com.mes.adapter.in.web.dto.workorder.request.UpdateWorkOrderRequest;
import com.mes.adapter.in.web.dto.workorder.response.CreateWorkOrderResponse;
import com.mes.adapter.in.web.dto.workorder.response.UpdateWorkOrderResponse;
import com.mes.adapter.in.web.dto.workorder.response.WorkOrderDetailResponse;
import com.mes.adapter.in.web.dto.workorder.response.WorkOrderListResponse;
import com.mes.application.port.in.WorkOrderUseCase;
import com.mes.application.port.in.WorkOrderUseCase.CreateWorkOrderCommand;
import com.mes.application.port.in.WorkOrderUseCase.UpdateWorkOrderCommand;
import com.mes.common.exception.EntityNotFoundException;
import com.mes.common.exception.ErrorCode;
import com.mes.common.response.ApiResponse;
import com.mes.domain.model.WorkOrderModel;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class WorkOrderController {

    private final WorkOrderUseCase workOrderUseCase;

    public WorkOrderController(WorkOrderUseCase workOrderUseCase) {
        this.workOrderUseCase = workOrderUseCase;
    }

    /**
     * 작업지시서 등록
     * POST /api/work-orders
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CreateWorkOrderResponse>> createWorkOrder(
            @Valid @RequestBody CreateWorkOrderRequest request) {

        CreateWorkOrderCommand command = toCommand(request);
        WorkOrderModel created = workOrderUseCase.createWorkOrder(command);
        CreateWorkOrderResponse response = toCreateResponse(created);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .body(ApiResponse.success(response));
    }

    /**
     * Request -> Command 변환
     * 발주번호는 서버에서 자동 생성되므로 Request에서 받지 않음
     */
    private CreateWorkOrderCommand toCommand(CreateWorkOrderRequest request) {
        CreateWorkOrderCommand command = new CreateWorkOrderCommand();
        command.setSupplyType(request.getSupplyType());
        command.setCompanyName(request.getCompanyName());
        command.setProductName(request.getProductName());
        command.setProductCode(request.getProductCode());
        command.setQuantity(request.getQuantity());
        command.setUnit(request.getUnit());
        command.setDueDate(request.getDueDate());
        command.setPriority(request.getPriority());
        command.setWorkType(request.getWorkType());
        command.setInstructions(request.getInstructions());
        command.setSelection(request.getSelection());
        command.setAttachmentUrl(request.getAttachmentUrl());
        command.setAssignedToId(request.getAssignedToId());
        return command;
    }

    /**
     * 작업지시서 목록 조회
     * GET /api/work-orders
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<WorkOrderListResponse>>> getAllWorkOrders() {
        List<WorkOrderModel> workOrders = workOrderUseCase.findAllWorkOrders();
        List<WorkOrderListResponse> responses = workOrders.stream()
                .map(this::toListResponse)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    /**
     * 작업지시서 단건 조회
     * GET /api/work-orders/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<WorkOrderDetailResponse>> getWorkOrder(@PathVariable Long id) {
        WorkOrderModel workOrder = workOrderUseCase.findWorkOrderById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND));

        WorkOrderDetailResponse response = toDetailResponse(workOrder);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 작업지시서 수정
     * PUT /api/work-orders/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<UpdateWorkOrderResponse>> updateWorkOrder(
            @PathVariable Long id,
            @Valid @RequestBody UpdateWorkOrderRequest request) {

        UpdateWorkOrderCommand command = toUpdateCommand(request);
        WorkOrderModel updated = workOrderUseCase.updateWorkOrder(id, command);
        UpdateWorkOrderResponse response = toUpdateResponse(updated);

        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * 작업지시서 삭제
     * DELETE /api/work-orders/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteWorkOrder(@PathVariable Long id) {
        workOrderUseCase.deleteWorkOrder(id);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    /**
     * 작업 시작
     * PATCH /api/work-orders/{id}/start
     */
    @PatchMapping("/{id}/start")
    public ResponseEntity<ApiResponse<WorkOrderDetailResponse>> startWork(@PathVariable Long id) {
        workOrderUseCase.startWork(id);
        WorkOrderModel workOrder = workOrderUseCase.findWorkOrderById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.success(toDetailResponse(workOrder)));
    }

    /**
     * 작업 완료
     * PATCH /api/work-orders/{id}/complete
     */
    @PatchMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<WorkOrderDetailResponse>> completeWork(@PathVariable Long id) {
        workOrderUseCase.completeWork(id);
        WorkOrderModel workOrder = workOrderUseCase.findWorkOrderById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.success(toDetailResponse(workOrder)));
    }

    /**
     * 작업 일시정지
     * PATCH /api/work-orders/{id}/pause
     */
    @PatchMapping("/{id}/pause")
    public ResponseEntity<ApiResponse<WorkOrderDetailResponse>> pauseWork(@PathVariable Long id) {
        workOrderUseCase.pauseWork(id);
        WorkOrderModel workOrder = workOrderUseCase.findWorkOrderById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.success(toDetailResponse(workOrder)));
    }

    /**
     * 작업 재개
     * PATCH /api/work-orders/{id}/resume
     */
    @PatchMapping("/{id}/resume")
    public ResponseEntity<ApiResponse<WorkOrderDetailResponse>> resumeWork(@PathVariable Long id) {
        workOrderUseCase.resumeWork(id);
        WorkOrderModel workOrder = workOrderUseCase.findWorkOrderById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.success(toDetailResponse(workOrder)));
    }

    /**
     * 작업 취소
     * PATCH /api/work-orders/{id}/cancel
     */
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<WorkOrderDetailResponse>> cancelWork(@PathVariable Long id) {
        workOrderUseCase.cancelWork(id);
        WorkOrderModel workOrder = workOrderUseCase.findWorkOrderById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.success(toDetailResponse(workOrder)));
    }

    /**
     * 작업 재활성화 (취소 -> 대기)
     * PATCH /api/work-orders/{id}/reactivate
     */
    @PatchMapping("/{id}/reactivate")
    public ResponseEntity<ApiResponse<WorkOrderDetailResponse>> reactivateWork(@PathVariable Long id) {
        workOrderUseCase.reactivateWork(id);
        WorkOrderModel workOrder = workOrderUseCase.findWorkOrderById(id)
                .orElseThrow(() -> new EntityNotFoundException(ErrorCode.WORK_ORDER_NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.success(toDetailResponse(workOrder)));
    }

    /**
     * Request -> UpdateWorkOrderCommand 변환
     * 발주번호는 수정 불가이므로 Request에서 받지 않음
     */
    private UpdateWorkOrderCommand toUpdateCommand(UpdateWorkOrderRequest request) {
        UpdateWorkOrderCommand command = new UpdateWorkOrderCommand();
        command.setSupplyType(request.getSupplyType());
        command.setCompanyName(request.getCompanyName());
        command.setProductName(request.getProductName());
        command.setProductCode(request.getProductCode());
        command.setQuantity(request.getQuantity());
        command.setUnit(request.getUnit());
        command.setDueDate(request.getDueDate());
        command.setPriority(request.getPriority());
        command.setWorkType(request.getWorkType());
        command.setInstructions(request.getInstructions());
        command.setSelection(request.getSelection());
        command.setAttachmentUrl(request.getAttachmentUrl());
        command.setAssignedToId(request.getAssignedToId());
        return command;
    }

    /**
     * Domain Model -> CreateWorkOrderResponse 변환
     */
    private CreateWorkOrderResponse toCreateResponse(WorkOrderModel domain) {
        CreateWorkOrderResponse response = new CreateWorkOrderResponse();
        response.setId(domain.getId());
        response.setWorkOrderNo(domain.getWorkOrderNo());
        response.setSupplyType(domain.getSupplyType());
        response.setCompanyName(domain.getCompanyName());
        response.setProductName(domain.getProductName());
        response.setStatus(domain.getStatus() != null ? domain.getStatus().name() : null);
        response.setPriority(domain.getPriority() != null ? domain.getPriority().name() : null);
        response.setDueDate(domain.getDueDate());
        response.setCreatedAt(domain.getCreatedAt());
        return response;
    }

    /**
     * Domain Model -> WorkOrderListResponse 변환
     */
    private WorkOrderListResponse toListResponse(WorkOrderModel domain) {
        WorkOrderListResponse response = new WorkOrderListResponse();
        response.setId(domain.getId());
        response.setWorkOrderNo(domain.getWorkOrderNo());
        response.setSupplyType(domain.getSupplyType());
        response.setCompanyName(domain.getCompanyName());
        response.setProductName(domain.getProductName());
        response.setQuantity(domain.getQuantity());
        response.setUnit(domain.getUnit());
        response.setStatus(domain.getStatus() != null ? domain.getStatus().name() : null);
        response.setPriority(domain.getPriority() != null ? domain.getPriority().name() : null);
        response.setDueDate(domain.getDueDate());
        return response;
    }

    /**
     * Domain Model -> WorkOrderDetailResponse 변환
     */
    private WorkOrderDetailResponse toDetailResponse(WorkOrderModel domain) {
        WorkOrderDetailResponse response = new WorkOrderDetailResponse();
        response.setId(domain.getId());
        response.setWorkOrderNo(domain.getWorkOrderNo());
        response.setSupplyType(domain.getSupplyType());
        response.setCompanyName(domain.getCompanyName());
        response.setProductName(domain.getProductName());
        response.setProductCode(domain.getProductCode());
        response.setQuantity(domain.getQuantity());
        response.setUnit(domain.getUnit());
        response.setStatus(domain.getStatus() != null ? domain.getStatus().name() : null);
        response.setPriority(domain.getPriority() != null ? domain.getPriority().name() : null);
        response.setWorkType(domain.getWorkType());
        response.setInstructions(domain.getInstructions());
        response.setSelection(domain.getSelection());
        response.setAttachmentUrl(domain.getAttachmentUrl());
        response.setAssignedToId(domain.getAssignedToId());
        response.setDueDate(domain.getDueDate());
        response.setCreatedAt(domain.getCreatedAt());
        response.setUpdatedAt(domain.getUpdatedAt());
        return response;
    }

    /**
     * Domain Model -> UpdateWorkOrderResponse 변환
     */
    private UpdateWorkOrderResponse toUpdateResponse(WorkOrderModel domain) {
        UpdateWorkOrderResponse response = new UpdateWorkOrderResponse();
        response.setId(domain.getId());
        response.setWorkOrderNo(domain.getWorkOrderNo());
        response.setSupplyType(domain.getSupplyType());
        response.setCompanyName(domain.getCompanyName());
        response.setProductName(domain.getProductName());
        response.setStatus(domain.getStatus() != null ? domain.getStatus().name() : null);
        response.setPriority(domain.getPriority() != null ? domain.getPriority().name() : null);
        response.setDueDate(domain.getDueDate());
        response.setUpdatedAt(domain.getUpdatedAt());
        return response;
    }
}
