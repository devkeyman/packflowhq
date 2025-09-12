import React from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { StatusBadge, PriorityBadge } from "./components/status-badge";
import { useWorkOrderStore } from "@/features/work-orders/stores/work-order-store";
import { useUpdateWorkOrderStatus } from "@/features/work-orders/hooks";
import { WorkOrderStatus } from "@/entities/work-order";
import { 
  Calendar, 
  Package, 
  User, 
  Clock, 
  FileText,
  Edit,
  CheckCircle,
  XCircle,
  PlayCircle
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const WorkOrderDetail: React.FC = () => {
  const { selectedWorkOrder, setSelectedWorkOrder, openForm } = useWorkOrderStore();
  const updateStatusMutation = useUpdateWorkOrderStatus();

  if (!selectedWorkOrder) return null;

  const handleStatusChange = async (status: WorkOrderStatus) => {
    if (!selectedWorkOrder) return;
    
    try {
      await updateStatusMutation.mutateAsync({
        id: selectedWorkOrder.id,
        status,
      });
      setSelectedWorkOrder(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getNextStatus = (): WorkOrderStatus | null => {
    switch (selectedWorkOrder.status) {
      case "PENDING":
        return "IN_PROGRESS";
      case "IN_PROGRESS":
        return "COMPLETED";
      default:
        return null;
    }
  };

  const nextStatus = getNextStatus();

  return (
    <Sheet 
      open={!!selectedWorkOrder} 
      onClose={() => setSelectedWorkOrder(null)}
    >
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>작업지시서 상세</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                openForm(selectedWorkOrder);
                setSelectedWorkOrder(null);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              수정
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* 기본 정보 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3">기본 정보</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">작업번호</span>
                <span className="font-medium">{selectedWorkOrder.orderNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">제목</span>
                <span className="font-medium">{selectedWorkOrder.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">상태</span>
                <StatusBadge status={selectedWorkOrder.status} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">우선순위</span>
                <PriorityBadge priority={selectedWorkOrder.priority} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">진행률</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        selectedWorkOrder.completionRate === 100
                          ? "bg-green-500"
                          : "bg-blue-500"
                      )}
                      style={{ width: `${selectedWorkOrder.completionRate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {selectedWorkOrder.completionRate}%
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* 제품 정보 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2" />
              제품 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">제품명</span>
                <span className="font-medium">{selectedWorkOrder.productName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">제품코드</span>
                <span className="font-medium">{selectedWorkOrder.productCode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">수량</span>
                <span className="font-medium">
                  {selectedWorkOrder.quantity} {selectedWorkOrder.unit}
                </span>
              </div>
            </div>
          </Card>

          {/* 일정 정보 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              일정 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">계획 시작일</span>
                <span className="font-medium">
                  {new Date(selectedWorkOrder.startDate).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">계획 종료일</span>
                <span className="font-medium">
                  {new Date(selectedWorkOrder.endDate).toLocaleDateString("ko-KR")}
                </span>
              </div>
              {selectedWorkOrder.actualStartDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">실제 시작일</span>
                  <span className="font-medium">
                    {new Date(selectedWorkOrder.actualStartDate).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              )}
              {selectedWorkOrder.actualEndDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">실제 종료일</span>
                  <span className="font-medium">
                    {new Date(selectedWorkOrder.actualEndDate).toLocaleDateString("ko-KR")}
                  </span>
                </div>
              )}
            </div>
          </Card>

          {/* 담당자 정보 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <User className="h-4 w-4 mr-2" />
              담당자 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">담당자</span>
                <span className="font-medium">{selectedWorkOrder.assignedTo}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">작성자</span>
                <span className="font-medium">{selectedWorkOrder.createdBy}</span>
              </div>
            </div>
          </Card>

          {/* 설명 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              상세 설명
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {selectedWorkOrder.description}
            </p>
          </Card>

          {/* 비고 */}
          {selectedWorkOrder.notes && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3">비고</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {selectedWorkOrder.notes}
              </p>
            </Card>
          )}

          {/* 타임스탬프 */}
          <Card className="p-4">
            <h3 className="font-semibold mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              생성/수정 정보
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">생성일시</span>
                <span className="font-medium">
                  {new Date(selectedWorkOrder.createdAt).toLocaleString("ko-KR")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">수정일시</span>
                <span className="font-medium">
                  {new Date(selectedWorkOrder.updatedAt).toLocaleString("ko-KR")}
                </span>
              </div>
            </div>
          </Card>

          {/* 상태 변경 버튼 */}
          <div className="flex gap-2">
            {nextStatus && (
              <Button
                className="flex-1"
                onClick={() => handleStatusChange(nextStatus)}
                disabled={updateStatusMutation.isPending}
              >
                {nextStatus === "IN_PROGRESS" && (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    작업 시작
                  </>
                )}
                {nextStatus === "COMPLETED" && (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    작업 완료
                  </>
                )}
              </Button>
            )}
            {selectedWorkOrder.status !== "CANCELLED" && 
             selectedWorkOrder.status !== "COMPLETED" && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleStatusChange("CANCELLED")}
                disabled={updateStatusMutation.isPending}
              >
                <XCircle className="h-4 w-4 mr-2" />
                작업 취소
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};