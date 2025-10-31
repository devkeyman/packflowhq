import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";

const ProductionDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleDelete = () => {
    // Delete logic will be here
    console.log("Delete production:", id);
  };

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">작업 지시서 상세</h1>
            <p className="mt-1 text-sm text-gray-500">작업 지시서 상세 정보를 확인합니다</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/production")}>
              목록
            </Button>
            <Button variant="outline" onClick={() => navigate(`/production/${id}/edit`)}>
              수정
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {/* Production detail will be here */}
        <p className="text-sm text-gray-500">작업 지시서 ID: {id}</p>
      </main>
    </div>
  );
};

export default ProductionDetailPage;
