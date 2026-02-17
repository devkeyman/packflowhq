import React from "react";
import { useParams } from "react-router-dom";
import { useWorkOrder } from "@/features/work-order";
import { WorkOrderDetail } from "@/widgets/work-order-detail";

const ProductionDetailPage: React.FC = () => {
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

  return <WorkOrderDetail data={workOrder} />;
};

export default ProductionDetailPage;
