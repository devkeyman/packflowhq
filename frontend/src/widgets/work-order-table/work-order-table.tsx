import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import type { WorkOrderListItem, WorkOrderStatus, WorkOrderPriority } from "@/entities/work-order";

interface WorkOrderTableProps {
  data: WorkOrderListItem[];
  isLoading?: boolean;
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

export const WorkOrderTable: React.FC<WorkOrderTableProps> = ({ data, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          데이터를 불러오는 중...
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-500">
          등록된 작업지시서가 없습니다.
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  발주번호
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  공급구분
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  업체명
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  제품명
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  수량
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  마감일
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  우선순위
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => {
                const statusConfig = STATUS_CONFIG[item.status];
                const priorityConfig = PRIORITY_CONFIG[item.priority];

                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.workOrderNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {SUPPLY_TYPE_LABELS[item.supplyType] || item.supplyType}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.companyName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.productName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.quantity.toLocaleString()} {item.unit || ""}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.dueDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig.className}`}>
                        {priorityConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig.className}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/production/${item.id}`)}
                      >
                        상세
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
