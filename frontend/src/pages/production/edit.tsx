import React from "react";
import { useParams } from "react-router-dom";
import { useWorkOrder } from "@/features/work-order";
import { WorkOrderForm } from "@/widgets/work-order-form";

const ProductionEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const workOrderId = Number(id);
  const { data: workOrder, isLoading, isError } = useWorkOrder(workOrderId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (isError || !workOrder) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-sm text-red-600">작업 지시서를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">작업 지시서 수정</h1>
          <p className="mt-1 text-sm text-gray-500">
            {workOrder.workOrderNo} - 작업 지시서 정보를 수정합니다
          </p>
        </div>
      </header>

      <main>
        <WorkOrderForm mode="edit" initialData={workOrder} />
      </main>
    </div>
  );
};

export default ProductionEditPage;
