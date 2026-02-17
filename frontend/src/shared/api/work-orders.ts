import apiClient from "./client";
import type {
  WorkOrder,
  WorkOrderListItem,
  CreateWorkOrderRequest,
  CreateWorkOrderResponse,
  ApiResponse,
} from "@/entities/work-order";

const WORK_ORDERS_ENDPOINT = "/work-orders";

export const workOrdersApi = {
  // 작업지시서 목록 조회
  getAll: async (): Promise<WorkOrderListItem[]> => {
    const response = await apiClient.get<ApiResponse<WorkOrderListItem[]>>(
      WORK_ORDERS_ENDPOINT
    );
    return response.data.data;
  },

  // 작업지시서 단건 조회
  getById: async (id: number): Promise<WorkOrder> => {
    const response = await apiClient.get<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}`
    );
    return response.data.data;
  },

  // 작업지시서 생성
  create: async (
    data: CreateWorkOrderRequest
  ): Promise<ApiResponse<CreateWorkOrderResponse>> => {
    const response = await apiClient.post<ApiResponse<CreateWorkOrderResponse>>(
      WORK_ORDERS_ENDPOINT,
      data
    );
    return response.data;
  },

  // 작업지시서 수정
  update: async (
    id: number,
    data: Partial<CreateWorkOrderRequest>
  ): Promise<ApiResponse<WorkOrder>> => {
    const response = await apiClient.put<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}`,
      data
    );
    return response.data;
  },

  // 작업지시서 삭제
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${WORK_ORDERS_ENDPOINT}/${id}`);
  },

  // 작업 시작
  startWork: async (id: number): Promise<ApiResponse<WorkOrder>> => {
    const response = await apiClient.patch<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}/start`
    );
    return response.data;
  },

  // 작업 완료
  completeWork: async (id: number): Promise<ApiResponse<WorkOrder>> => {
    const response = await apiClient.patch<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}/complete`
    );
    return response.data;
  },

  // 작업 일시정지
  pauseWork: async (id: number): Promise<ApiResponse<WorkOrder>> => {
    const response = await apiClient.patch<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}/pause`
    );
    return response.data;
  },

  // 작업 재개
  resumeWork: async (id: number): Promise<ApiResponse<WorkOrder>> => {
    const response = await apiClient.patch<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}/resume`
    );
    return response.data;
  },

  // 작업 취소
  cancelWork: async (id: number): Promise<ApiResponse<WorkOrder>> => {
    const response = await apiClient.patch<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}/cancel`
    );
    return response.data;
  },

  // 작업 재활성화 (취소 -> 대기)
  reactivateWork: async (id: number): Promise<ApiResponse<WorkOrder>> => {
    const response = await apiClient.patch<ApiResponse<WorkOrder>>(
      `${WORK_ORDERS_ENDPOINT}/${id}/reactivate`
    );
    return response.data;
  },
};
