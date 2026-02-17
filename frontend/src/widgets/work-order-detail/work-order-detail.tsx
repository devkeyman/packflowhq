import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  useDeleteWorkOrder,
  useChangeWorkOrderStatus,
  getAvailableActions,
  actionLabels,
} from "@/features/work-order";
import type { WorkOrder, WorkOrderStatus, WorkOrderPriority } from "@/entities/work-order";

interface WorkOrderDetailProps {
  data: WorkOrder;
}

// 상태 라벨 및 스타일
const STATUS_CONFIG: Record<WorkOrderStatus, { label: string; className: string }> = {
  PENDING: { label: "대기", className: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "진행중", className: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "완료", className: "bg-green-100 text-green-800" },
  PAUSED: { label: "일시정지", className: "bg-yellow-100 text-yellow-800" },
  CANCELLED: { label: "취소", className: "bg-red-100 text-red-800" },
};

// 우선순위 라벨 및 스타일
const PRIORITY_CONFIG: Record<WorkOrderPriority, { label: string; className: string }> = {
  LOW: { label: "낮음", className: "bg-gray-100 text-gray-600" },
  MEDIUM: { label: "보통", className: "bg-blue-100 text-blue-600" },
  HIGH: { label: "높음", className: "bg-orange-100 text-orange-600" },
  URGENT: { label: "긴급", className: "bg-red-100 text-red-600" },
};

// 공급구분 라벨
const SUPPLY_TYPE_LABELS: Record<string, string> = {
  PRIMARY: "원청",
  SUBCONTRACT: "하청",
};

// 작업유형 라벨
const WORK_TYPE_LABELS: Record<string, string> = {
  PRODUCTION: "생산",
  ASSEMBLY: "조립",
  PACKAGING: "포장",
  INSPECTION: "검수",
  OTHER: "기타",
};

// 액션별 버튼 스타일
const actionButtonStyles: Record<string, string> = {
  start: "bg-blue-600 hover:bg-blue-700 text-white",
  complete: "bg-green-600 hover:bg-green-700 text-white",
  pause: "bg-yellow-600 hover:bg-yellow-700 text-white",
  resume: "bg-blue-600 hover:bg-blue-700 text-white",
  cancel: "bg-red-600 hover:bg-red-700 text-white",
  reactivate: "bg-gray-600 hover:bg-gray-700 text-white",
};

export const WorkOrderDetail: React.FC<WorkOrderDetailProps> = ({ data }) => {
  const navigate = useNavigate();
  const deleteWorkOrder = useDeleteWorkOrder();
  const changeStatus = useChangeWorkOrderStatus();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const statusConfig = STATUS_CONFIG[data.status];
  const priorityConfig = PRIORITY_CONFIG[data.priority];
  const availableActions = getAvailableActions(data.status);

  const handleDelete = async () => {
    await deleteWorkOrder.mutateAsync(data.id);
    navigate("/production");
  };

  const handleStatusChange = async (action: "start" | "complete" | "pause" | "resume" | "cancel" | "reactivate") => {
    await changeStatus.mutateAsync({ id: data.id, action });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex py-3 border-b border-gray-100 last:border-b-0">
      <dt className="w-32 flex-shrink-0 text-sm font-medium text-gray-500">{label}</dt>
      <dd className="text-sm text-gray-900">{value || "-"}</dd>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">{data.workOrderNo}</h2>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${priorityConfig.className}`}>
            {priorityConfig.label}
          </span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/production")}>
            목록
          </Button>
          <Button onClick={() => navigate(`/production/${data.id}/edit`)}>
            수정
          </Button>
          <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
            삭제
          </Button>
        </div>
      </div>

      {/* 상태 변경 버튼 */}
      {availableActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">작업 상태 변경</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {availableActions.map((action) => (
                <Button
                  key={action}
                  className={actionButtonStyles[action]}
                  onClick={() => handleStatusChange(action)}
                  disabled={changeStatus.isPending}
                >
                  {changeStatus.isPending ? "처리 중..." : actionLabels[action]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 삭제 확인 다이얼로그 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">삭제 확인</h3>
            <p className="text-sm text-gray-600 mb-4">
              작업 지시서 <strong>{data.workOrderNo}</strong>을(를) 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteWorkOrder.isPending}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteWorkOrder.isPending}
              >
                {deleteWorkOrder.isPending ? "삭제 중..." : "삭제"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            <InfoRow label="발주번호" value={data.workOrderNo} />
            <InfoRow label="공급구분" value={SUPPLY_TYPE_LABELS[data.supplyType] || data.supplyType} />
            <InfoRow label="업체명" value={data.companyName} />
          </dl>
        </CardContent>
      </Card>

      {/* 제품 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">제품 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            <InfoRow label="제품명" value={data.productName} />
            <InfoRow label="제품코드" value={data.productCode} />
            <InfoRow label="수량" value={`${data.quantity.toLocaleString()} ${data.unit || ""}`} />
          </dl>
        </CardContent>
      </Card>

      {/* 작업 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">작업 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            <InfoRow label="마감일" value={formatDate(data.dueDate)} />
            <InfoRow label="우선순위" value={priorityConfig.label} />
            <InfoRow label="작업유형" value={data.workType ? WORK_TYPE_LABELS[data.workType] || data.workType : "-"} />
            <InfoRow label="진행률" value={`${data.progress || 0}%`} />
            <InfoRow label="담당자" value={data.assignedToName} />
          </dl>
        </CardContent>
      </Card>

      {/* 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">상세 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            <InfoRow label="작업 지시 사항" value={data.instructions} />
            <InfoRow label="선택" value={data.selection} />
          </dl>
        </CardContent>
      </Card>

      {/* 시간 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">시간 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-gray-100">
            <InfoRow label="등록일시" value={formatDateTime(data.createdAt)} />
            <InfoRow label="수정일시" value={formatDateTime(data.updatedAt)} />
            <InfoRow label="작업시작" value={formatDateTime(data.startedAt)} />
            <InfoRow label="작업완료" value={formatDateTime(data.completedAt)} />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};
