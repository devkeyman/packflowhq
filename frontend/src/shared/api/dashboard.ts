import apiClient from "./client";
import type { DashboardSummary, RecentWorkOrder, StatusStat } from "@/entities/dashboard";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const DASHBOARD_ENDPOINT = "/dashboard";

export const dashboardApi = {
  // 대시보드 요약 통계
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get<ApiResponse<DashboardSummary>>(
      `${DASHBOARD_ENDPOINT}/summary`
    );
    return response.data.data;
  },

  // 최근 작업지시서 목록
  getRecentWorkOrders: async (limit: number = 5): Promise<RecentWorkOrder[]> => {
    const response = await apiClient.get<ApiResponse<RecentWorkOrder[]>>(
      `${DASHBOARD_ENDPOINT}/recent-work-orders`,
      { params: { limit } }
    );
    return response.data.data;
  },

  // 상태별 작업 통계
  getStatusStats: async (): Promise<StatusStat[]> => {
    const response = await apiClient.get<ApiResponse<StatusStat[]>>(
      `${DASHBOARD_ENDPOINT}/status-stats`
    );
    return response.data.data;
  },
};
