// 작업지시서 상태
export type WorkOrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "PAUSED" | "CANCELLED";

// 우선순위
export type WorkOrderPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

// 공급구분
export type SupplyType = "PRIMARY" | "SUBCONTRACT";

// 작업유형
export type WorkType = "PRODUCTION" | "ASSEMBLY" | "PACKAGING" | "INSPECTION" | "OTHER";

// 작업지시서 응답 타입
export interface WorkOrder {
  id: number;
  workOrderNo: string; // 발주번호 (서버에서 자동 생성, 형식: YYYYMMDD + 순번 3자리)
  supplyType: string;
  companyName: string;
  productName: string;
  productCode?: string;
  quantity: number;
  unit?: string;
  dueDate: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  workType?: string;
  instructions?: string;
  selection?: string;
  attachmentUrl?: string;
  progress?: number;
  assignedToId?: number;
  assignedToName?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

// 작업지시서 목록 응답 타입
export interface WorkOrderListItem {
  id: number;
  workOrderNo: string; // 발주번호 (서버에서 자동 생성)
  supplyType: string;
  companyName: string;
  productName: string;
  quantity: number;
  unit?: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  dueDate: string;
}

// 작업지시서 생성 요청 타입
// 발주번호(workOrderNo)는 서버에서 자동 생성되므로 요청에 포함하지 않음
export interface CreateWorkOrderRequest {
  supplyType: string;
  companyName: string;
  productName: string;
  productCode?: string;
  quantity: number;
  unit?: string;
  dueDate: string;
  priority?: WorkOrderPriority;
  workType?: string;
  instructions?: string;
  selection?: string;
  attachmentUrl?: string;
  assignedToId?: number;
}

// 작업지시서 생성 응답 타입
export interface CreateWorkOrderResponse {
  id: number;
  workOrderNo: string; // 서버에서 자동 생성된 발주번호
  supplyType: string;
  companyName: string;
  productName: string;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  dueDate: string;
  createdAt: string;
}

// API 검증 실패 정보
export interface ValidationResult {
  code: string;
  message: string;
  details?: Record<string, string>;
}

// API 응답 래퍼 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  validation?: ValidationResult;
}
