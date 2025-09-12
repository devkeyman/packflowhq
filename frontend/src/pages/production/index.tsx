import React, { useState } from "react";
import { WorkOrdersTable } from "@/widgets/production/work-orders-table";
import { WorkOrderForm } from "@/widgets/production/work-order-form";
import { WorkOrderDetail } from "@/widgets/production/work-order-detail";
import {
  useCreateWorkOrder,
  useUpdateWorkOrder,
  useWorkOrders,
} from "@/features/production/hooks/use-work-orders";
import {
  WorkOrder,
  CreateWorkOrderRequest,
  UpdateWorkOrderRequest,
} from "@/entities/production";
import { Button } from "@/shared/components/ui/button";

type ViewMode = "list" | "create" | "edit" | "detail";

const ProductionPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(
    null
  );

  const createWorkOrder = useCreateWorkOrder();
  const updateWorkOrder = useUpdateWorkOrder();
  const { data: workOrders } = useWorkOrders();

  const handleCreate = () => {
    setSelectedWorkOrder(null);
    setViewMode("create");
  };

  const handleEdit = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setViewMode("edit");
  };

  const handleView = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setViewMode("detail");
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedWorkOrder(null);
  };

  const handleSubmit = (
    data: CreateWorkOrderRequest | UpdateWorkOrderRequest
  ) => {
    if (viewMode === "create") {
      createWorkOrder.mutate(data as CreateWorkOrderRequest, {
        onSuccess: () => {
          setViewMode("list");
        },
      });
    } else if (viewMode === "edit" && selectedWorkOrder) {
      updateWorkOrder.mutate(
        { id: selectedWorkOrder.id, data: data as UpdateWorkOrderRequest },
        {
          onSuccess: () => {
            setViewMode("list");
            setSelectedWorkOrder(null);
          },
        }
      );
    }
  };

  const isLoading = createWorkOrder.isPending || updateWorkOrder.isPending;

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">생산 관리</h1>
            <p className="mt-1 text-sm text-gray-500">작업 지시서를 관리하고 생산 현황을 모니터링합니다</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
              작업 지시서 {workOrders?.data?.length || 0}건
            </span>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {viewMode === "list" && (
          <>
            <div className="flex justify-end">
              <Button onClick={handleCreate}>
                새 작업 지시서
              </Button>
            </div>

            <WorkOrdersTable onEdit={handleEdit} onView={handleView} />
          </>
        )}

        {viewMode === "create" && (
          <WorkOrderForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {viewMode === "edit" && selectedWorkOrder && (
          <WorkOrderForm
            workOrder={selectedWorkOrder}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {viewMode === "detail" && selectedWorkOrder && (
          <WorkOrderDetail
            workOrder={selectedWorkOrder}
            onEdit={() => handleEdit(selectedWorkOrder)}
            onClose={handleCancel}
          />
        )}
      </main>
    </div>
  );
};

export default ProductionPage;
