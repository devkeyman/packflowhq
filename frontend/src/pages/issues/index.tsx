import React, { useState } from "react";
import { IssuesGrid } from "@/widgets/issues/issues-grid";
import { IssueForm } from "@/widgets/issues/issue-form";
import { IssueDetail } from "@/widgets/issues/issue-detail";
import {
  useCreateIssue,
  useUpdateIssue,
  useIssues,
} from "@/features/issues/hooks/use-issues";
import {
  Issue,
  CreateIssueRequest,
  UpdateIssueRequest,
} from "@/entities/issues";
import { Button } from "@/shared/components/ui/button";

type ViewMode = "list" | "create" | "edit" | "detail";

const IssuesPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const createIssue = useCreateIssue();
  const updateIssue = useUpdateIssue();
  const { data: issues } = useIssues();

  const handleCreate = () => {
    setSelectedIssue(null);
    setViewMode("create");
  };

  const handleEdit = (issue: Issue) => {
    setSelectedIssue(issue);
    setViewMode("edit");
  };

  const handleView = (issue: Issue) => {
    setSelectedIssue(issue);
    setViewMode("detail");
  };

  const handleCancel = () => {
    setViewMode("list");
    setSelectedIssue(null);
  };

  const handleSubmit = (data: CreateIssueRequest | UpdateIssueRequest) => {
    if (viewMode === "create") {
      createIssue.mutate(data as CreateIssueRequest, {
        onSuccess: () => {
          setViewMode("list");
        },
      });
    } else if (viewMode === "edit" && selectedIssue) {
      updateIssue.mutate(
        { id: selectedIssue.id, data: data as UpdateIssueRequest },
        {
          onSuccess: () => {
            setViewMode("list");
            setSelectedIssue(null);
          },
        }
      );
    }
  };

  const isLoading = createIssue.isPending || updateIssue.isPending;

  return (
    <div className="space-y-8">
      <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">이슈 관리</h1>
            <p className="mt-1 text-sm text-gray-500">생산 현장의 문제점을 추적하고 개선사항을 관리합니다</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md font-medium">
              미해결 {issues?.data?.filter((i: Issue) => i.status === 'OPEN').length || 0}건
            </span>
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded-md font-medium">
              해결완료 {issues?.data?.filter((i: Issue) => i.status === 'RESOLVED').length || 0}건
            </span>
          </div>
        </div>
      </header>

      <main className="space-y-8">
        {viewMode === "list" && (
          <>
            <div className="flex justify-end">
              <Button onClick={handleCreate}>
                새 이슈 등록
              </Button>
            </div>

            <IssuesGrid onEdit={handleEdit} onView={handleView} />
          </>
        )}

        {viewMode === "create" && (
          <IssueForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {viewMode === "edit" && selectedIssue && (
          <IssueForm
            issue={selectedIssue}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        )}

        {viewMode === "detail" && selectedIssue && (
          <IssueDetail
            issue={selectedIssue}
            onEdit={() => handleEdit(selectedIssue)}
            onClose={handleCancel}
          />
        )}
      </main>
    </div>
  );
};

export default IssuesPage;
