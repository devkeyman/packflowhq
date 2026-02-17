import { useQuery } from "@tanstack/react-query";
import { workOrdersApi } from "@/shared/api";

export function useWorkOrder(id: number) {
  return useQuery({
    queryKey: ["work-order", id],
    queryFn: () => workOrdersApi.getById(id),
    enabled: !!id,
  });
}
