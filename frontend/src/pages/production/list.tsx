import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useWorkOrders } from "@/features/work-order";
import { WorkOrderTable } from "@/widgets/work-order-table";
import { ExcelUploadDialog } from "@/widgets/excel-upload-dialog";

const ProductionListPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: workOrders = [], isLoading, isError } = useWorkOrders();
  const [excelDialogOpen, setExcelDialogOpen] = useState(false);

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">생산 관리</h1>
            <p className="mt-1 text-sm text-gray-500">작업 지시서를 관리하고 생산 현황을 모니터링합니다</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setExcelDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              엑셀 업로드
            </Button>
            <Button onClick={() => navigate("/production/new")}>
              새 작업 지시서
            </Button>
          </div>
        </div>
      </header>

      <ExcelUploadDialog
        open={excelDialogOpen}
        onClose={() => setExcelDialogOpen(false)}
      />

      <main className="space-y-8">
        {isError ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">데이터를 불러오는데 실패했습니다.</p>
          </div>
        ) : (
          <WorkOrderTable data={workOrders} isLoading={isLoading} />
        )}
      </main>
    </div>
  );
};

export default ProductionListPage;
