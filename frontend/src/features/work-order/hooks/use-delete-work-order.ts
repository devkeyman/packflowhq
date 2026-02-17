import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workOrdersApi } from "@/shared/api";

export function useDeleteWorkOrder() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id) => workOrdersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-orders"] });
    },
  });
}
