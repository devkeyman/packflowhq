import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/shared/api";
import type { CreateWorkOrderRequest, CreateWorkOrderResponse, ApiResponse } from "@/entities/work-order";

export function useCreateWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<CreateWorkOrderResponse>, Error, CreateWorkOrderRequest>({
    mutationFn: (data: CreateWorkOrderRequest) => workOrdersApi.create(data),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["work-orders"] });
      }
    },
  });
}
