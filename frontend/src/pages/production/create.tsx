import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { WorkOrderForm } from "@/widgets/work-order-form";

const ProductionCreatePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">작업 지시서 등록</h1>
            <p className="mt-1 text-sm text-gray-500">새로운 작업 지시서를 등록합니다</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/production")}>
            목록으로
          </Button>
        </div>
      </header>

      <main>
        <WorkOrderForm />
      </main>
    </div>
  );
};

export default ProductionCreatePage;