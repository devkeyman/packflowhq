import React from "react";
import { DashboardSummary } from "@/widgets/dashboard-summary";

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
            <p className="mt-1 text-sm text-gray-500">스마트 팩토리 MES 시스템 현황을 한눈에 확인하세요</p>
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </div>
        </div>
      </header>

      <main>
        <DashboardSummary />
      </main>
    </div>
  );
};

export default DashboardPage;
