import { useQuery } from "@tanstack/react-query";
import { workOrdersApi } from "@/shared/api";

export function useWorkOrders() {
  return useQuery({
    queryKey: ["work-orders"],
    queryFn: () => workOrdersApi.getAll(),
  });
}
