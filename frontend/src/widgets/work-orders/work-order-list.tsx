import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Select } from "@/shared/components/ui/select";
import { Card } from "@/shared/components/ui/card";
import { StatusBadge, PriorityBadge } from "./components/status-badge";
import { useWorkOrders } from "@/features/work-orders/hooks";
import { useWorkOrderStore } from "@/features/work-orders/stores/work-order-store";
import { WorkOrderStatus, WorkOrderPriority } from "@/entities/work-order";
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Eye,
  Trash2 
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

export const WorkOrderList: React.FC = () => {
  const { filters, updateFilter, clearFilters, openForm, setSelectedWorkOrder } = useWorkOrderStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  const {
    workOrders,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    updateParams,
  } = useWorkOrders({
    page: 1,
    limit: 10,
    filters,
  });

  const handleSearch = () => {
    updateFilter("search", searchTerm);
    updateParams({ page: 1, filters: { ...filters, search: searchTerm } });
  };

  const handleStatusFilter = (status: WorkOrderStatus | "ALL") => {
    if (status === "ALL") {
      updateFilter("status", undefined);
      updateParams({ page: 1, filters: { ...filters, status: undefined } });
    } else {
      updateFilter("status", status);
      updateParams({ page: 1, filters: { ...filters, status } });
    }
  };

  const handlePriorityFilter = (priority: WorkOrderPriority | "ALL") => {
    if (priority === "ALL") {
      updateFilter("priority", undefined);
      updateParams({ page: 1, filters: { ...filters, priority: undefined } });
    } else {
      updateFilter("priority", priority);
      updateParams({ page: 1, filters: { ...filters, priority } });
    }
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const handleSort = (field: string) => {
    updateParams({ sort: field, order: "desc" });
  };

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          작업지시서를 불러오는 중 오류가 발생했습니다.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 필터 및 검색 영역 */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Select
              value={filters.status || "ALL"}
              onChange={(e) => handleStatusFilter(e.target.value as WorkOrderStatus | "ALL")}
            >
              <option value="ALL">모든 상태</option>
              <option value="PENDING">대기중</option>
              <option value="IN_PROGRESS">진행중</option>
              <option value="COMPLETED">완료</option>
              <option value="CANCELLED">취소됨</option>
            </Select>
            
            <Select
              value={filters.priority || "ALL"}
              onChange={(e) => handlePriorityFilter(e.target.value as WorkOrderPriority | "ALL")}
            >
              <option value="ALL">모든 우선순위</option>
              <option value="LOW">낮음</option>
              <option value="NORMAL">보통</option>
              <option value="MEDIUM">중간</option>
              <option value="HIGH">높음</option>
              <option value="URGENT">긴급</option>
            </Select>
            
            <Button variant="outline" onClick={clearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              초기화
            </Button>
            
            <Button onClick={() => openForm()}>
              <Plus className="h-4 w-4 mr-2" />
              새 작업지시서
            </Button>
          </div>
        </div>
      </Card>

      {/* 테이블 */}
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("orderNumber")}>
                작업번호
              </TableHead>
              <TableHead>제목</TableHead>
              <TableHead>제품</TableHead>
              <TableHead className="text-right">수량</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>우선순위</TableHead>
              <TableHead>담당자</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("startDate")}>
                시작일
              </TableHead>
              <TableHead>진행률</TableHead>
              <TableHead className="text-center">작업</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  로딩중...
                </TableCell>
              </TableRow>
            ) : workOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  작업지시서가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              workOrders.map((workOrder) => (
                <TableRow key={workOrder.id}>
                  <TableCell className="font-medium">
                    {workOrder.orderNumber}
                  </TableCell>
                  <TableCell>{workOrder.title}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{workOrder.productName}</div>
                      <div className="text-sm text-gray-500">{workOrder.productCode}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {workOrder.quantity} {workOrder.unit}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={workOrder.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={workOrder.priority} />
                  </TableCell>
                  <TableCell>{workOrder.assignedTo}</TableCell>
                  <TableCell>
                    {new Date(workOrder.startDate).toLocaleDateString("ko-KR")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={cn(
                            "h-2 rounded-full",
                            workOrder.completionRate === 100
                              ? "bg-green-500"
                              : "bg-blue-500"
                          )}
                          style={{ width: `${workOrder.completionRate}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">
                        {workOrder.completionRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedWorkOrder(workOrder)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openForm(workOrder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              총 {total}개 중 {(currentPage - 1) * 10 + 1}-
              {Math.min(currentPage * 10, total)}개 표시
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                )
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2">...</span>
                    )}
                    <Button
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};