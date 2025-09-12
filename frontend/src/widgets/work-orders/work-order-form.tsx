import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Select } from "@/shared/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/shared/components/ui/sheet";
import { useWorkOrderStore } from "@/features/work-orders/stores/work-order-store";
import { useCreateWorkOrder, useUpdateWorkOrder } from "@/features/work-orders/hooks";
import { CreateWorkOrderRequest, UpdateWorkOrderRequest, WorkOrderPriority } from "@/entities/work-order";

interface WorkOrderFormData {
  title: string;
  description: string;
  productName: string;
  productCode: string;
  quantity: number;
  unit: string;
  priority: WorkOrderPriority;
  assignedToId: number;
  startDate: string;
  endDate: string;
  notes?: string;
}

export const WorkOrderForm: React.FC = () => {
  const { isFormOpen, editingWorkOrder, closeForm } = useWorkOrderStore();
  const createMutation = useCreateWorkOrder();
  const updateMutation = useUpdateWorkOrder();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<WorkOrderFormData>();

  useEffect(() => {
    if (editingWorkOrder) {
      setValue("title", editingWorkOrder.title);
      setValue("description", editingWorkOrder.description);
      setValue("productName", editingWorkOrder.productName);
      setValue("productCode", editingWorkOrder.productCode);
      setValue("quantity", editingWorkOrder.quantity);
      setValue("unit", editingWorkOrder.unit);
      setValue("priority", editingWorkOrder.priority);
      setValue("assignedToId", editingWorkOrder.assignedToId);
      setValue("startDate", editingWorkOrder.startDate.split("T")[0]);
      setValue("endDate", editingWorkOrder.endDate.split("T")[0]);
      setValue("notes", editingWorkOrder.notes);
    } else {
      reset();
    }
  }, [editingWorkOrder, setValue, reset]);

  const onSubmit = async (data: WorkOrderFormData) => {
    try {
      if (editingWorkOrder) {
        await updateMutation.mutateAsync({
          id: editingWorkOrder.id,
          data: data as UpdateWorkOrderRequest,
        });
      } else {
        await createMutation.mutateAsync(data as CreateWorkOrderRequest);
      }
      closeForm();
      reset();
    } catch (error) {
      console.error("Error saving work order:", error);
    }
  };

  return (
    <Sheet open={isFormOpen} onClose={closeForm}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editingWorkOrder ? "작업지시서 수정" : "새 작업지시서"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              {...register("title", { required: "제목을 입력해주세요" })}
              placeholder="작업지시서 제목"
            />
            {errors.title && (
              <span className="text-sm text-red-600">{errors.title.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">설명 *</Label>
            <Textarea
              id="description"
              {...register("description", { required: "설명을 입력해주세요" })}
              placeholder="작업 내용에 대한 상세 설명"
              rows={3}
            />
            {errors.description && (
              <span className="text-sm text-red-600">{errors.description.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productName">제품명 *</Label>
              <Input
                id="productName"
                {...register("productName", { required: "제품명을 입력해주세요" })}
                placeholder="제품명"
              />
              {errors.productName && (
                <span className="text-sm text-red-600">{errors.productName.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productCode">제품코드 *</Label>
              <Input
                id="productCode"
                {...register("productCode", { required: "제품코드를 입력해주세요" })}
                placeholder="제품코드"
              />
              {errors.productCode && (
                <span className="text-sm text-red-600">{errors.productCode.message}</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">수량 *</Label>
              <Input
                id="quantity"
                type="number"
                {...register("quantity", {
                  required: "수량을 입력해주세요",
                  min: { value: 1, message: "수량은 1 이상이어야 합니다" },
                })}
                placeholder="수량"
              />
              {errors.quantity && (
                <span className="text-sm text-red-600">{errors.quantity.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">단위 *</Label>
              <Input
                id="unit"
                {...register("unit", { required: "단위를 입력해주세요" })}
                placeholder="개, 박스, kg 등"
              />
              {errors.unit && (
                <span className="text-sm text-red-600">{errors.unit.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">우선순위 *</Label>
            <Select
              id="priority"
              {...register("priority", { required: "우선순위를 선택해주세요" })}
            >
              <option value="">선택하세요</option>
              <option value="LOW">낮음</option>
              <option value="NORMAL">보통</option>
              <option value="MEDIUM">중간</option>
              <option value="HIGH">높음</option>
              <option value="URGENT">긴급</option>
            </Select>
            {errors.priority && (
              <span className="text-sm text-red-600">{errors.priority.message}</span>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedToId">담당자 *</Label>
            <Select
              id="assignedToId"
              {...register("assignedToId", {
                required: "담당자를 선택해주세요",
                valueAsNumber: true,
              })}
            >
              <option value="">선택하세요</option>
              <option value="1">김생산</option>
              <option value="2">이제조</option>
              <option value="3">박품질</option>
              <option value="4">최작업</option>
            </Select>
            {errors.assignedToId && (
              <span className="text-sm text-red-600">{errors.assignedToId.message}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">시작일 *</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", { required: "시작일을 선택해주세요" })}
              />
              {errors.startDate && (
                <span className="text-sm text-red-600">{errors.startDate.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">종료일 *</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate", { required: "종료일을 선택해주세요" })}
              />
              {errors.endDate && (
                <span className="text-sm text-red-600">{errors.endDate.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">비고</Label>
            <Textarea
              id="notes"
              {...register("notes")}
              placeholder="추가 메모 사항"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? "저장중..."
                : editingWorkOrder
                ? "수정"
                : "등록"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                closeForm();
                reset();
              }}
            >
              취소
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};