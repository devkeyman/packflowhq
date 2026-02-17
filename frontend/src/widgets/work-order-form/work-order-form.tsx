import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select } from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { useCreateWorkOrder, useUpdateWorkOrder } from "@/features/work-order";
import type { CreateWorkOrderRequest, WorkOrderPriority, WorkOrder } from "@/entities/work-order";

// 공급구분 옵션
const SUPPLY_TYPE_OPTIONS = [
  { value: "PRIMARY", label: "원청" },
  { value: "SUBCONTRACT", label: "하청" },
];

// 우선순위 옵션
const PRIORITY_OPTIONS = [
  { value: "LOW", label: "낮음" },
  { value: "MEDIUM", label: "보통" },
  { value: "HIGH", label: "높음" },
  { value: "URGENT", label: "긴급" },
];

// 작업유형 옵션
const WORK_TYPE_OPTIONS = [
  { value: "PRODUCTION", label: "생산" },
  { value: "ASSEMBLY", label: "조립" },
  { value: "PACKAGING", label: "포장" },
  { value: "INSPECTION", label: "검사" },
  { value: "OTHER", label: "기타" },
];

// 단위 옵션
const UNIT_OPTIONS = [
  { value: "EA", label: "EA (개)" },
  { value: "BOX", label: "BOX (박스)" },
  { value: "SET", label: "SET (세트)" },
  { value: "KG", label: "KG (킬로그램)" },
  { value: "M", label: "M (미터)" },
];

interface FormData {
  supplyType: string;
  companyName: string;
  productName: string;
  productCode: string;
  quantity: string;
  unit: string;
  dueDate: string;
  priority: WorkOrderPriority;
  workType: string;
  instructions: string;
  selection: string;
}

const initialFormData: FormData = {
  supplyType: "",
  companyName: "",
  productName: "",
  productCode: "",
  quantity: "",
  unit: "EA",
  dueDate: "",
  priority: "MEDIUM",
  workType: "",
  instructions: "",
  selection: "",
};

interface FormErrors {
  [key: string]: string;
}

interface WorkOrderFormProps {
  mode?: "create" | "edit";
  initialData?: WorkOrder;
}

export const WorkOrderForm: React.FC<WorkOrderFormProps> = ({
  mode = "create",
  initialData,
}) => {
  const navigate = useNavigate();
  const createWorkOrder = useCreateWorkOrder();
  const updateWorkOrder = useUpdateWorkOrder();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditMode = mode === "edit";
  const isPending = isEditMode ? updateWorkOrder.isPending : createWorkOrder.isPending;

  // 수정 모드에서 초기 데이터 설정
  useEffect(() => {
    if (isEditMode && initialData) {
      setFormData({
        supplyType: initialData.supplyType || "",
        companyName: initialData.companyName || "",
        productName: initialData.productName || "",
        productCode: initialData.productCode || "",
        quantity: String(initialData.quantity || ""),
        unit: initialData.unit || "EA",
        dueDate: initialData.dueDate ? initialData.dueDate.split("T")[0] : "",
        priority: initialData.priority || "MEDIUM",
        workType: initialData.workType || "",
        instructions: initialData.instructions || "",
        selection: initialData.selection || "",
      });
    }
  }, [isEditMode, initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드 에러 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.supplyType) {
      newErrors.supplyType = "공급구분을 선택해주세요";
    }

    if (!formData.companyName) {
      newErrors.companyName = "업체명을 입력해주세요";
    }

    if (!formData.productName) {
      newErrors.productName = "제품명을 입력해주세요";
    }

    if (!formData.quantity) {
      newErrors.quantity = "수량을 입력해주세요";
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 1) {
      newErrors.quantity = "수량은 1 이상의 숫자여야 합니다";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "마감일을 선택해주세요";
    } else if (!isEditMode) {
      // 등록 모드에서만 날짜 검증
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.dueDate = "마감일은 오늘 이후여야 합니다";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 중복 요청 방지
    if (isPending) {
      return;
    }

    if (!validate()) {
      return;
    }

    const requestData: CreateWorkOrderRequest = {
      supplyType: formData.supplyType,
      companyName: formData.companyName,
      productName: formData.productName,
      productCode: formData.productCode || undefined,
      quantity: Number(formData.quantity),
      unit: formData.unit || undefined,
      dueDate: `${formData.dueDate}T00:00:00`,
      priority: formData.priority,
      workType: formData.workType || undefined,
      instructions: formData.instructions || undefined,
      selection: formData.selection || undefined,
    };

    if (isEditMode && initialData) {
      const response = await updateWorkOrder.mutateAsync({
        id: initialData.id,
        data: requestData,
      });

      if (response.success) {
        navigate(`/production/${initialData.id}`);
      } else {
        if (response.validation?.details) {
          setErrors((prev) => ({ ...prev, ...response.validation!.details }));
        } else if (response.validation?.message) {
          setErrors((prev) => ({ ...prev, _form: response.validation!.message }));
        }
      }
    } else {
      const response = await createWorkOrder.mutateAsync(requestData);

      if (response.success) {
        navigate("/production");
      } else {
        if (response.validation?.details) {
          setErrors((prev) => ({ ...prev, ...response.validation!.details }));
        } else if (response.validation?.message) {
          setErrors((prev) => ({ ...prev, _form: response.validation!.message }));
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 공급구분 */}
          <div className="space-y-2">
            <Label htmlFor="supplyType">
              공급구분 <span className="text-red-500">*</span>
            </Label>
            <Select
              id="supplyType"
              name="supplyType"
              value={formData.supplyType}
              onChange={handleChange}
              className={errors.supplyType ? "border-red-500" : ""}
            >
              <option value="">선택하세요</option>
              {SUPPLY_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {errors.supplyType && (
              <p className="text-sm text-red-500">{errors.supplyType}</p>
            )}
          </div>

          {/* 업체명 */}
          <div className="space-y-2">
            <Label htmlFor="companyName">
              업체명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              placeholder="업체명 입력"
              value={formData.companyName}
              onChange={handleChange}
              className={errors.companyName ? "border-red-500" : ""}
            />
            {errors.companyName && (
              <p className="text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 제품 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">제품 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 제품명 */}
          <div className="space-y-2">
            <Label htmlFor="productName">
              제품명 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="productName"
              name="productName"
              type="text"
              placeholder="제품명 입력"
              value={formData.productName}
              onChange={handleChange}
              className={errors.productName ? "border-red-500" : ""}
            />
            {errors.productName && (
              <p className="text-sm text-red-500">{errors.productName}</p>
            )}
          </div>

          {/* 제품코드 */}
          <div className="space-y-2">
            <Label htmlFor="productCode">제품코드</Label>
            <Input
              id="productCode"
              name="productCode"
              type="text"
              placeholder="제품코드 입력"
              value={formData.productCode}
              onChange={handleChange}
            />
          </div>

          {/* 수량 */}
          <div className="space-y-2">
            <Label htmlFor="quantity">
              수량 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              placeholder="수량 입력"
              value={formData.quantity}
              onChange={handleChange}
              className={errors.quantity ? "border-red-500" : ""}
            />
            {errors.quantity && (
              <p className="text-sm text-red-500">{errors.quantity}</p>
            )}
          </div>

          {/* 단위 */}
          <div className="space-y-2">
            <Label htmlFor="unit">단위</Label>
            <Select
              id="unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
            >
              {UNIT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 작업 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">작업 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 마감일 */}
          <div className="space-y-2">
            <Label htmlFor="dueDate">
              마감일 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dueDate"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className={errors.dueDate ? "border-red-500" : ""}
            />
            {errors.dueDate && (
              <p className="text-sm text-red-500">{errors.dueDate}</p>
            )}
          </div>

          {/* 우선순위 */}
          <div className="space-y-2">
            <Label htmlFor="priority">우선순위</Label>
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* 작업유형 */}
          <div className="space-y-2">
            <Label htmlFor="workType">작업유형</Label>
            <Select
              id="workType"
              name="workType"
              value={formData.workType}
              onChange={handleChange}
            >
              <option value="">선택하세요</option>
              {WORK_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* 선택 */}
          <div className="space-y-2">
            <Label htmlFor="selection">선택</Label>
            <Input
              id="selection"
              name="selection"
              type="text"
              placeholder="선택 사항 입력"
              value={formData.selection}
              onChange={handleChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">상세 정보</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 작업 지시 사항 */}
          <div className="space-y-2">
            <Label htmlFor="instructions">작업 지시 사항</Label>
            <Textarea
              id="instructions"
              name="instructions"
              placeholder="작업 지시 사항을 입력하세요"
              value={formData.instructions}
              onChange={handleChange}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(isEditMode && initialData ? `/production/${initialData.id}` : "/production")}
        >
          취소
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (isEditMode ? "수정 중..." : "등록 중...") : (isEditMode ? "수정" : "등록")}
        </Button>
      </div>

      {/* 폼 전체 에러 메시지 */}
      {errors._form && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors._form}</p>
        </div>
      )}
    </form>
  );
};
