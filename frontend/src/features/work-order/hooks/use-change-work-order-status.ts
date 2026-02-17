import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/shared/api";
import type { WorkOrder, ApiResponse, WorkOrderStatus } from "@/entities/work-order";

type StatusAction = "start" | "complete" | "pause" | "resume" | "cancel" | "reactivate";

const actionMap: Record<StatusAction, (id: number) => Promise<ApiResponse<WorkOrder>>> = {
  start: workOrdersApi.startWork,
  complete: workOrdersApi.completeWork,
  pause: workOrdersApi.pauseWork,
  resume: workOrdersApi.resumeWork,
  cancel: workOrdersApi.cancelWork,
  reactivate: workOrdersApi.reactivateWork,
};

// 현재 상태에서 가능한 액션 목록
export const getAvailableActions = (status: WorkOrderStatus): StatusAction[] => {
  switch (status) {
    case "PENDING":
      return ["start", "cancel"];
    case "IN_PROGRESS":
      return ["complete", "pause", "cancel"];
    case "PAUSED":
      return ["resume", "cancel"];
    case "COMPLETED":
      return ["reactivate"];
    case "CANCELLED":
      return ["reactivate"];
    default:
      return [];
  }
};

// 액션 라벨
export const actionLabels: Record<StatusAction, string> = {
  start: "작업 시작",
  complete: "작업 완료",
  pause: "일시정지",
  resume: "작업 재개",
  cancel: "작업 취소",
  reactivate: "대기로 변경",
};

interface ChangeStatusVariables {
  id: number;
  action: StatusAction;
}

export function useChangeWorkOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<WorkOrder>, Error, ChangeStatusVariables>({
    mutationFn: ({ id, action }) => actionMap[action](id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      queryClient.invalidateQueries({ queryKey: ["work-order", variables.id] });
    },
  });
}
