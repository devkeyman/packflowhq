import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/shared/api";
import type { CreateWorkOrderRequest, WorkOrder, ApiResponse } from "@/entities/work-order";

interface UpdateWorkOrderVariables {
  id: number;
  data: Partial<CreateWorkOrderRequest>;
}

export function useUpdateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<WorkOrder>, Error, UpdateWorkOrderVariables>({
    mutationFn: ({ id, data }) => workOrdersApi.update(id, data),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["work-orders"] });
        queryClient.invalidateQueries({ queryKey: ["work-order", variables.id] });
      }
    },
  });
}
