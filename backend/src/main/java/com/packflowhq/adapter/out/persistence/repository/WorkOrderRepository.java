package com.packflowhq.adapter.out.persistence.repository;

import com.packflowhq.adapter.out.persistence.entity.WorkOrder;
import com.packflowhq.adapter.out.persistence.entity.enums.WorkStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {

    Optional<WorkOrder> findByWorkOrderNo(String workOrderNo);

    /**
     * 오늘 날짜로 시작하는 발주번호 중 가장 큰 번호 조회
     * @param datePrefix 날짜 접두어 (예: "20251205")
     * @return 가장 큰 발주번호 (없으면 null)
     */
    @Query("SELECT MAX(w.workOrderNo) FROM WorkOrder w WHERE w.workOrderNo LIKE :datePrefix%")
    Optional<String> findMaxWorkOrderNoByDatePrefix(@Param("datePrefix") String datePrefix);

    List<WorkOrder> findByStatus(WorkStatus status);

    List<WorkOrder> findByAssignedToId(Long userId);

    List<WorkOrder> findByDueDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    @Query("SELECT w FROM WorkOrder w WHERE w.assignedTo.id = :userId AND w.status = :status")
    List<WorkOrder> findByAssignedToIdAndStatus(@Param("userId") Long userId, @Param("status") WorkStatus status);

    @Query("SELECT w FROM WorkOrder w WHERE w.dueDate < :now AND w.status != :completedStatus")
    List<WorkOrder> findOverdueWorkOrders(@Param("now") LocalDateTime now, @Param("completedStatus") WorkStatus completedStatus);

    boolean existsByWorkOrderNo(String workOrderNo);

    @Query("SELECT COUNT(w) FROM WorkOrder w WHERE w.status = :status")
    long countByStatus(@Param("status") WorkStatus status);

    List<WorkOrder> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
}
