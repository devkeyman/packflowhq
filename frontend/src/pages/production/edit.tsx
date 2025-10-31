import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

const ProductionEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">작업 지시서 수정</h1>
            <p className="mt-1 text-sm text-gray-500">작업 지시서 정보를 수정합니다</p>
          </div>
          <Button variant="outline" onClick={() => navigate(`/production/${id}`)}>
            취소
          </Button>
        </div>
      </header>

      <main className="space-y-8">
        {/* Production edit form will be here */}
        <p className="text-sm text-gray-500">작업 지시서 ID: {id}</p>
      </main>
    </div>
  );
};

export default ProductionEditPage;
