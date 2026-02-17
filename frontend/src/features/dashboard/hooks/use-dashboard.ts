import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/shared/api";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: () => dashboardApi.getSummary(),
  });
}

export function useRecentWorkOrders(limit: number = 5) {
  return useQuery({
    queryKey: ["dashboard", "recent-work-orders", limit],
    queryFn: () => dashboardApi.getRecentWorkOrders(limit),
  });
}

export function useStatusStats() {
  return useQuery({
    queryKey: ["dashboard", "status-stats"],
    queryFn: () => dashboardApi.getStatusStats(),
  });
}
