import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/shared/api";
import type { CreateWorkOrderRequest, BulkCreateResponse, ApiResponse } from "@/entities/work-order";

export function useBulkCreateWorkOrders() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<BulkCreateResponse>, Error, CreateWorkOrderRequest[]>({
    mutationFn: (data: CreateWorkOrderRequest[]) => workOrdersApi.bulkCreate(data),
    onSuccess: (response) => {
      if (response.success && response.data.successCount > 0) {
        queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      }
    },
  });
}
