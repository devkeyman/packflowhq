import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

const ProductionListPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">생산 관리</h1>
            <p className="mt-1 text-sm text-gray-500">작업 지시서를 관리하고 생산 현황을 모니터링합니다</p>
          </div>
          <Button onClick={() => navigate("/production/new")}>
            새 작업 지시서
          </Button>
        </div>
      </header>

      <main className="space-y-8">
        {/* Production list table will be here */}
      </main>
    </div>
  );
};

export default ProductionListPage;
