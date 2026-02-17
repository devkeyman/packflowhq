package com.mes.adapter.in.web.controller;

import com.mes.application.port.in.WorkOrderUseCase;
import com.mes.common.response.ApiResponse;
import com.mes.domain.model.WorkOrderModel;
import com.mes.domain.model.WorkStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DashboardController {

    private final WorkOrderUseCase workOrderUseCase;

    public DashboardController(WorkOrderUseCase workOrderUseCase) {
        this.workOrderUseCase = workOrderUseCase;
    }

    /**
     * 대시보드 요약 통계
     * GET /api/dashboard/summary
     */
    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummary>> getSummary() {
        List<WorkOrderModel> allWorkOrders = workOrderUseCase.findAllWorkOrders();

        DashboardSummary summary = new DashboardSummary();

        // 상태별 카운트
        Map<WorkStatus, Long> statusCounts = allWorkOrders.stream()
                .collect(Collectors.groupingBy(WorkOrderModel::getStatus, Collectors.counting()));

        summary.setTotalCount(allWorkOrders.size());
        summary.setPendingCount(statusCounts.getOrDefault(WorkStatus.PENDING, 0L).intValue());
        summary.setInProgressCount(statusCounts.getOrDefault(WorkStatus.IN_PROGRESS, 0L).intValue());
        summary.setCompletedCount(statusCounts.getOrDefault(WorkStatus.COMPLETED, 0L).intValue());
        summary.setPausedCount(statusCounts.getOrDefault(WorkStatus.PAUSED, 0L).intValue());
        summary.setCancelledCount(statusCounts.getOrDefault(WorkStatus.CANCELLED, 0L).intValue());

        // 우선순위별 카운트 (진행 중인 작업만)
        List<WorkOrderModel> activeWorkOrders = allWorkOrders.stream()
                .filter(wo -> wo.getStatus() == WorkStatus.PENDING
                        || wo.getStatus() == WorkStatus.IN_PROGRESS
                        || wo.getStatus() == WorkStatus.PAUSED)
                .toList();

        Map<com.mes.domain.model.Priority, Long> priorityCounts = activeWorkOrders.stream()
                .collect(Collectors.groupingBy(WorkOrderModel::getPriority, Collectors.counting()));

        summary.setUrgentCount(priorityCounts.getOrDefault(com.mes.domain.model.Priority.URGENT, 0L).intValue());
        summary.setHighPriorityCount(priorityCounts.getOrDefault(com.mes.domain.model.Priority.HIGH, 0L).intValue());

        // 마감 임박 (3일 이내) 작업 수
        LocalDateTime threeDaysLater = LocalDateTime.now().plusDays(3);
        long dueSoonCount = activeWorkOrders.stream()
                .filter(wo -> wo.getDueDate() != null && wo.getDueDate().isBefore(threeDaysLater))
                .count();
        summary.setDueSoonCount((int) dueSoonCount);

        // 마감 초과 작업 수
        LocalDateTime now = LocalDateTime.now();
        long overdueCount = activeWorkOrders.stream()
                .filter(wo -> wo.getDueDate() != null && wo.getDueDate().isBefore(now))
                .count();
        summary.setOverdueCount((int) overdueCount);

        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    /**
     * 최근 작업지시서 목록
     * GET /api/dashboard/recent-work-orders
     */
    @GetMapping("/recent-work-orders")
    public ResponseEntity<ApiResponse<List<RecentWorkOrder>>> getRecentWorkOrders(
            @RequestParam(defaultValue = "5") int limit) {
        List<WorkOrderModel> allWorkOrders = workOrderUseCase.findAllWorkOrders();

        List<RecentWorkOrder> recentWorkOrders = allWorkOrders.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null && b.getCreatedAt() == null) return 0;
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(limit)
                .map(this::toRecentWorkOrder)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(recentWorkOrders));
    }

    /**
     * 상태별 작업 통계
     * GET /api/dashboard/status-stats
     */
    @GetMapping("/status-stats")
    public ResponseEntity<ApiResponse<List<StatusStat>>> getStatusStats() {
        List<WorkOrderModel> allWorkOrders = workOrderUseCase.findAllWorkOrders();

        Map<WorkStatus, Long> statusCounts = allWorkOrders.stream()
                .collect(Collectors.groupingBy(WorkOrderModel::getStatus, Collectors.counting()));

        List<StatusStat> stats = List.of(
                new StatusStat("PENDING", "대기", statusCounts.getOrDefault(WorkStatus.PENDING, 0L).intValue()),
                new StatusStat("IN_PROGRESS", "진행중", statusCounts.getOrDefault(WorkStatus.IN_PROGRESS, 0L).intValue()),
                new StatusStat("COMPLETED", "완료", statusCounts.getOrDefault(WorkStatus.COMPLETED, 0L).intValue()),
                new StatusStat("PAUSED", "일시정지", statusCounts.getOrDefault(WorkStatus.PAUSED, 0L).intValue()),
                new StatusStat("CANCELLED", "취소", statusCounts.getOrDefault(WorkStatus.CANCELLED, 0L).intValue())
        );

        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    private RecentWorkOrder toRecentWorkOrder(WorkOrderModel wo) {
        RecentWorkOrder recent = new RecentWorkOrder();
        recent.setId(wo.getId());
        recent.setWorkOrderNo(wo.getWorkOrderNo());
        recent.setProductName(wo.getProductName());
        recent.setCompanyName(wo.getCompanyName());
        recent.setStatus(wo.getStatus() != null ? wo.getStatus().name() : null);
        recent.setPriority(wo.getPriority() != null ? wo.getPriority().name() : null);
        recent.setDueDate(wo.getDueDate());
        recent.setProgress(wo.getProgress());
        return recent;
    }

    // Response DTOs
    public static class DashboardSummary {
        private int totalCount;
        private int pendingCount;
        private int inProgressCount;
        private int completedCount;
        private int pausedCount;
        private int cancelledCount;
        private int urgentCount;
        private int highPriorityCount;
        private int dueSoonCount;
        private int overdueCount;

        // Getters and Setters
        public int getTotalCount() { return totalCount; }
        public void setTotalCount(int totalCount) { this.totalCount = totalCount; }

        public int getPendingCount() { return pendingCount; }
        public void setPendingCount(int pendingCount) { this.pendingCount = pendingCount; }

        public int getInProgressCount() { return inProgressCount; }
        public void setInProgressCount(int inProgressCount) { this.inProgressCount = inProgressCount; }

        public int getCompletedCount() { return completedCount; }
        public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }

        public int getPausedCount() { return pausedCount; }
        public void setPausedCount(int pausedCount) { this.pausedCount = pausedCount; }

        public int getCancelledCount() { return cancelledCount; }
        public void setCancelledCount(int cancelledCount) { this.cancelledCount = cancelledCount; }

        public int getUrgentCount() { return urgentCount; }
        public void setUrgentCount(int urgentCount) { this.urgentCount = urgentCount; }

        public int getHighPriorityCount() { return highPriorityCount; }
        public void setHighPriorityCount(int highPriorityCount) { this.highPriorityCount = highPriorityCount; }

        public int getDueSoonCount() { return dueSoonCount; }
        public void setDueSoonCount(int dueSoonCount) { this.dueSoonCount = dueSoonCount; }

        public int getOverdueCount() { return overdueCount; }
        public void setOverdueCount(int overdueCount) { this.overdueCount = overdueCount; }
    }

    public static class RecentWorkOrder {
        private Long id;
        private String workOrderNo;
        private String productName;
        private String companyName;
        private String status;
        private String priority;
        private LocalDateTime dueDate;
        private Integer progress;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getWorkOrderNo() { return workOrderNo; }
        public void setWorkOrderNo(String workOrderNo) { this.workOrderNo = workOrderNo; }

        public String getProductName() { return productName; }
        public void setProductName(String productName) { this.productName = productName; }

        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }

        public String getPriority() { return priority; }
        public void setPriority(String priority) { this.priority = priority; }

        public LocalDateTime getDueDate() { return dueDate; }
        public void setDueDate(LocalDateTime dueDate) { this.dueDate = dueDate; }

        public Integer getProgress() { return progress; }
        public void setProgress(Integer progress) { this.progress = progress; }
    }

    public static class StatusStat {
        private String status;
        private String label;
        private int count;

        public StatusStat(String status, String label, int count) {
            this.status = status;
            this.label = label;
            this.count = count;
        }

        // Getters
        public String getStatus() { return status; }
        public String getLabel() { return label; }
        public int getCount() { return count; }
    }
}
