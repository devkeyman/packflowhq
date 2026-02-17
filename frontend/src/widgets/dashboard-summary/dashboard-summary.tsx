import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useDashboardSummary, useRecentWorkOrders } from "@/features/dashboard";
import type { RecentWorkOrder } from "@/entities/dashboard";

// 상태 라벨 및 스타일
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: "대기", className: "bg-gray-100 text-gray-800" },
  IN_PROGRESS: { label: "진행중", className: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "완료", className: "bg-green-100 text-green-800" },
  PAUSED: { label: "일시정지", className: "bg-yellow-100 text-yellow-800" },
  CANCELLED: { label: "취소", className: "bg-red-100 text-red-800" },
};

// 우선순위 라벨 및 스타일
const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  LOW: { label: "낮음", className: "text-gray-600" },
  MEDIUM: { label: "보통", className: "text-blue-600" },
  HIGH: { label: "높음", className: "text-orange-600" },
  URGENT: { label: "긴급", className: "text-red-600" },
};

// 통계 카드 컴포넌트
const StatCard: React.FC<{
  title: string;
  value: number;
  description?: string;
  className?: string;
  onClick?: () => void;
}> = ({ title, value, description, className = "", onClick }) => (
  <Card
    className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}
    onClick={onClick}
  >
    <CardContent className="p-6">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm font-medium text-gray-600">{title}</div>
      {description && (
        <div className="text-xs text-gray-400 mt-1">{description}</div>
      )}
    </CardContent>
  </Card>
);

// 최근 작업 목록 아이템
const RecentWorkOrderItem: React.FC<{
  workOrder: RecentWorkOrder;
  onClick: () => void;
}> = ({ workOrder, onClick }) => {
  const statusConfig = STATUS_CONFIG[workOrder.status] || STATUS_CONFIG.PENDING;
  const priorityConfig = PRIORITY_CONFIG[workOrder.priority] || PRIORITY_CONFIG.MEDIUM;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 px-2 -mx-2 rounded"
      onClick={onClick}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 truncate">
            {workOrder.workOrderNo}
          </span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1 truncate">
          {workOrder.productName} - {workOrder.companyName}
        </div>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <span className={`text-xs font-medium ${priorityConfig.className}`}>
          {priorityConfig.label}
        </span>
        <span className="text-xs text-gray-400">
          {formatDate(workOrder.dueDate)}
        </span>
      </div>
    </div>
  );
};

export const DashboardSummary: React.FC = () => {
  const navigate = useNavigate();
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: recentWorkOrders, isLoading: recentLoading } = useRecentWorkOrders(5);

  if (summaryLoading || recentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 주요 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="전체 작업"
          value={summary?.totalCount || 0}
          onClick={() => navigate("/production")}
        />
        <StatCard
          title="진행중"
          value={summary?.inProgressCount || 0}
          className="border-l-4 border-l-blue-500"
          onClick={() => navigate("/production")}
        />
        <StatCard
          title="대기중"
          value={summary?.pendingCount || 0}
          className="border-l-4 border-l-gray-400"
          onClick={() => navigate("/production")}
        />
        <StatCard
          title="완료"
          value={summary?.completedCount || 0}
          className="border-l-4 border-l-green-500"
          onClick={() => navigate("/production")}
        />
      </div>

      {/* 알림 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(summary?.overdueCount || 0) > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-red-600">
                  {summary?.overdueCount}
                </div>
                <div>
                  <div className="text-sm font-medium text-red-800">마감 초과</div>
                  <div className="text-xs text-red-600">즉시 확인 필요</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {(summary?.dueSoonCount || 0) > 0 && (
          <Card className="border-l-4 border-l-orange-500 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-orange-600">
                  {summary?.dueSoonCount}
                </div>
                <div>
                  <div className="text-sm font-medium text-orange-800">마감 임박</div>
                  <div className="text-xs text-orange-600">3일 이내 마감</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {(summary?.urgentCount || 0) > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold text-red-600">
                  {summary?.urgentCount}
                </div>
                <div>
                  <div className="text-sm font-medium text-red-800">긴급 작업</div>
                  <div className="text-xs text-red-600">우선 처리 필요</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 최근 작업 목록 */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">최근 작업 지시서</CardTitle>
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={() => navigate("/production")}
          >
            전체 보기
          </button>
        </CardHeader>
        <CardContent>
          {recentWorkOrders && recentWorkOrders.length > 0 ? (
            <div className="space-y-1">
              {recentWorkOrders.map((workOrder) => (
                <RecentWorkOrderItem
                  key={workOrder.id}
                  workOrder={workOrder}
                  onClick={() => navigate(`/production/${workOrder.id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              작업 지시서가 없습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 상태별 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">상태별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-600">
                {summary?.pendingCount || 0}
              </div>
              <div className="text-xs text-gray-500">대기</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">
                {summary?.inProgressCount || 0}
              </div>
              <div className="text-xs text-gray-500">진행중</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600">
                {summary?.pausedCount || 0}
              </div>
              <div className="text-xs text-gray-500">일시정지</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600">
                {summary?.completedCount || 0}
              </div>
              <div className="text-xs text-gray-500">완료</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">
                {summary?.cancelledCount || 0}
              </div>
              <div className="text-xs text-gray-500">취소</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
