package com.packflowhq.application.port.out;

import com.packflowhq.domain.model.WorkOrderModel;
import java.util.List;
import java.util.Optional;

public interface WorkOrderPort {
    WorkOrderModel save(WorkOrderModel workOrder);
    Optional<WorkOrderModel> findById(Long id);
    List<WorkOrderModel> findAll();
    List<WorkOrderModel> findByStatus(String status);
    List<WorkOrderModel> findByAssignedToId(Long userId);
    void deleteById(Long id);
    boolean existsByWorkOrderNo(String workOrderNo);

    /**
     * 오늘 날짜 기준 최신 발주번호 조회
     * @param datePrefix 날짜 접두어 (예: "20251205")
     * @return 가장 큰 발주번호 (없으면 빈 Optional)
     */
    Optional<String> findMaxWorkOrderNoByDatePrefix(String datePrefix);
}
