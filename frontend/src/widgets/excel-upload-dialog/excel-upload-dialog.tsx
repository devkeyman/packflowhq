import React, { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import { Upload, Download, FileSpreadsheet, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogCloseButton,
} from "@/shared/components/ui/dialog";
import { useBulkCreateWorkOrders } from "@/features/work-order";
import type { CreateWorkOrderRequest, BulkCreateResponse } from "@/entities/work-order";

// 엑셀 헤더 → API 필드 매핑
const HEADER_MAP: Record<string, keyof CreateWorkOrderRequest> = {
  "공급구분": "supplyType",
  "업체명": "companyName",
  "제품명": "productName",
  "제품코드": "productCode",
  "수량": "quantity",
  "단위": "unit",
  "마감일": "dueDate",
  "우선순위": "priority",
  "작업유형": "workType",
  "작업지시사항": "instructions",
};

// 한글 enum → 영문 변환
const SUPPLY_TYPE_MAP: Record<string, string> = {
  "원청": "PRIMARY",
  "하청": "SUBCONTRACT",
};

const PRIORITY_MAP: Record<string, string> = {
  "낮음": "LOW",
  "보통": "MEDIUM",
  "높음": "HIGH",
  "긴급": "URGENT",
};

const WORK_TYPE_MAP: Record<string, string> = {
  "생산": "PRODUCTION",
  "조립": "ASSEMBLY",
  "포장": "PACKAGING",
  "검사": "INSPECTION",
  "기타": "OTHER",
};

const VALID_UNITS = ["EA", "BOX", "SET", "KG", "M"];

interface RowError {
  row: number;
  field: string;
  message: string;
}

interface ParsedRow {
  data: CreateWorkOrderRequest;
  errors: RowError[];
}

type Step = "upload" | "preview" | "result";

interface ExcelUploadDialogProps {
  open: boolean;
  onClose: () => void;
}

export const ExcelUploadDialog: React.FC<ExcelUploadDialogProps> = ({ open, onClose }) => {
  const [step, setStep] = useState<Step>("upload");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [result, setResult] = useState<BulkCreateResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkCreate = useBulkCreateWorkOrders();

  const reset = useCallback(() => {
    setStep("upload");
    setParsedRows([]);
    setFileName("");
    setResult(null);
    bulkCreate.reset();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [bulkCreate]);

  const handleClose = () => {
    reset();
    onClose();
  };

  // 템플릿 다운로드
  const downloadTemplate = () => {
    const headers = Object.keys(HEADER_MAP);
    const sampleRow = ["원청", "샘플업체", "샘플제품", "PRD-001", 100, "EA", "2026-12-31", "보통", "생산", ""];

    const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);
    // 컬럼 너비 설정
    ws["!cols"] = headers.map((h) => ({ wch: Math.max(h.length * 2, 12) }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "작업지시서");
    XLSX.writeFile(wb, "작업지시서_업로드_템플릿.xlsx");
  };

  // 날짜 값 변환
  const parseDateValue = (value: unknown): string | null => {
    if (value == null || value === "") return null;

    // 숫자(엑셀 시리얼 날짜)인 경우
    if (typeof value === "number") {
      const date = XLSX.SSF.parse_date_code(value);
      if (date) {
        const y = date.y;
        const m = String(date.m).padStart(2, "0");
        const d = String(date.d).padStart(2, "0");
        return `${y}-${m}-${d}`;
      }
    }

    const str = String(value).trim();
    // YYYY-MM-DD 형식 검증
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
      return str;
    }
    // YYYY/MM/DD → YYYY-MM-DD
    if (/^\d{4}\/\d{2}\/\d{2}$/.test(str)) {
      return str.replace(/\//g, "-");
    }

    return str;
  };

  // 엑셀 파일 파싱
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result;
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { raw: true });

      if (jsonData.length === 0) {
        setParsedRows([]);
        setStep("preview");
        return;
      }

      const rows: ParsedRow[] = jsonData.map((row, index) => {
        const errors: RowError[] = [];
        const rowNum = index + 1;

        // 한글 헤더 → 영문 필드 매핑
        const mapped: Record<string, unknown> = {};
        for (const [korHeader, engField] of Object.entries(HEADER_MAP)) {
          if (row[korHeader] !== undefined) {
            mapped[engField] = row[korHeader];
          }
        }

        // 공급구분 변환
        let supplyType = "";
        if (mapped.supplyType) {
          const raw = String(mapped.supplyType).trim();
          supplyType = SUPPLY_TYPE_MAP[raw] || raw;
          if (!SUPPLY_TYPE_MAP[raw] && raw !== "PRIMARY" && raw !== "SUBCONTRACT") {
            errors.push({ row: rowNum, field: "공급구분", message: "허용값: 원청, 하청" });
          }
        }

        // 우선순위 변환
        let priority = "MEDIUM";
        if (mapped.priority) {
          const raw = String(mapped.priority).trim();
          priority = PRIORITY_MAP[raw] || raw;
          if (!PRIORITY_MAP[raw] && !["LOW", "MEDIUM", "HIGH", "URGENT"].includes(raw)) {
            errors.push({ row: rowNum, field: "우선순위", message: "허용값: 낮음, 보통, 높음, 긴급" });
          }
        }

        // 작업유형 변환
        let workType: string | undefined;
        if (mapped.workType) {
          const raw = String(mapped.workType).trim();
          workType = WORK_TYPE_MAP[raw] || raw;
          if (!WORK_TYPE_MAP[raw] && !["PRODUCTION", "ASSEMBLY", "PACKAGING", "INSPECTION", "OTHER"].includes(raw)) {
            errors.push({ row: rowNum, field: "작업유형", message: "허용값: 생산, 조립, 포장, 검사, 기타" });
          }
        }

        // 수량 변환 및 검증
        const quantity = Number(mapped.quantity);
        if (!mapped.quantity || isNaN(quantity) || quantity < 1) {
          errors.push({ row: rowNum, field: "수량", message: "1 이상의 숫자를 입력하세요" });
        }

        // 단위 검증
        const unit = mapped.unit ? String(mapped.unit).trim() : undefined;
        if (unit && !VALID_UNITS.includes(unit)) {
          errors.push({ row: rowNum, field: "단위", message: `허용값: ${VALID_UNITS.join(", ")}` });
        }

        // 마감일 변환
        const dueDateStr = parseDateValue(mapped.dueDate);

        // 필수 필드 검증
        if (!mapped.supplyType) errors.push({ row: rowNum, field: "공급구분", message: "필수 항목입니다" });
        if (!mapped.companyName) errors.push({ row: rowNum, field: "업체명", message: "필수 항목입니다" });
        if (!mapped.productName) errors.push({ row: rowNum, field: "제품명", message: "필수 항목입니다" });
        if (!dueDateStr) errors.push({ row: rowNum, field: "마감일", message: "YYYY-MM-DD 형식으로 입력하세요" });

        const request: CreateWorkOrderRequest = {
          supplyType,
          companyName: mapped.companyName ? String(mapped.companyName).trim() : "",
          productName: mapped.productName ? String(mapped.productName).trim() : "",
          productCode: mapped.productCode ? String(mapped.productCode).trim() : undefined,
          quantity: isNaN(quantity) ? 0 : quantity,
          unit,
          dueDate: dueDateStr ? `${dueDateStr}T00:00:00` : "",
          priority: priority as CreateWorkOrderRequest["priority"],
          workType,
          instructions: mapped.instructions ? String(mapped.instructions).trim() : undefined,
        };

        return { data: request, errors };
      });

      setParsedRows(rows);
      setStep("preview");
    };

    reader.readAsArrayBuffer(file);
  };

  // 업로드 실행
  const handleUpload = () => {
    const validRows = parsedRows.filter((r) => r.errors.length === 0);
    if (validRows.length === 0) return;

    bulkCreate.mutate(
      validRows.map((r) => r.data),
      {
        onSuccess: (response) => {
          setResult(response.data);
          setStep("result");
        },
      }
    );
  };

  const totalRows = parsedRows.length;
  const validRows = parsedRows.filter((r) => r.errors.length === 0).length;
  const errorRows = totalRows - validRows;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent className="w-[800px] max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            엑셀 업로드
          </DialogTitle>
          <DialogCloseButton onClick={handleClose} />
        </DialogHeader>

        <DialogBody>
          {/* Step 1: 파일 선택 */}
          {step === "upload" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-900">엑셀 템플릿을 먼저 다운로드하세요</p>
                  <p className="text-xs text-blue-700 mt-1">템플릿에 맞춰 데이터를 입력한 후 업로드하세요</p>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  <Download className="h-4 w-4 mr-2" />
                  템플릿 다운로드
                </Button>
              </div>

              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-4 text-sm text-gray-600">
                  클릭하여 엑셀 파일을 선택하세요
                </p>
                <p className="mt-1 text-xs text-gray-400">.xlsx, .xls 파일 지원</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Step 2: 미리보기 */}
          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600">
                    파일: <span className="font-medium">{fileName}</span>
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-600">전체 {totalRows}건</span>
                    <span className="text-green-600">유효 {validRows}건</span>
                    {errorRows > 0 && (
                      <span className="text-red-600">오류 {errorRows}건</span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={reset}>
                  다시 선택
                </Button>
              </div>

              {totalRows === 0 ? (
                <div className="p-8 text-center text-gray-500 bg-gray-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  데이터가 없습니다. 엑셀 파일을 확인해주세요.
                </div>
              ) : (
                <div className="border rounded-lg overflow-auto max-h-[400px]">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-12">행</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">상태</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">공급구분</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">업체명</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">제품명</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">수량</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">마감일</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">우선순위</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {parsedRows.map((row, i) => {
                        const hasError = row.errors.length > 0;
                        const errorFields = new Set(row.errors.map((e) => e.field));
                        return (
                          <React.Fragment key={i}>
                            <tr className={hasError ? "bg-red-50" : ""}>
                              <td className="px-3 py-2 text-gray-500">{i + 1}</td>
                              <td className="px-3 py-2">
                                {hasError ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                )}
                              </td>
                              <td className={`px-3 py-2 ${errorFields.has("공급구분") ? "text-red-600 font-medium" : ""}`}>
                                {row.data.supplyType === "PRIMARY" ? "원청" : row.data.supplyType === "SUBCONTRACT" ? "하청" : row.data.supplyType || "-"}
                              </td>
                              <td className={`px-3 py-2 ${errorFields.has("업체명") ? "text-red-600 font-medium" : ""}`}>
                                {row.data.companyName || "-"}
                              </td>
                              <td className={`px-3 py-2 ${errorFields.has("제품명") ? "text-red-600 font-medium" : ""}`}>
                                {row.data.productName || "-"}
                              </td>
                              <td className={`px-3 py-2 ${errorFields.has("수량") ? "text-red-600 font-medium" : ""}`}>
                                {row.data.quantity || "-"}
                              </td>
                              <td className={`px-3 py-2 ${errorFields.has("마감일") ? "text-red-600 font-medium" : ""}`}>
                                {row.data.dueDate ? row.data.dueDate.replace("T00:00:00", "") : "-"}
                              </td>
                              <td className="px-3 py-2">
                                {row.data.priority === "LOW" ? "낮음" : row.data.priority === "MEDIUM" ? "보통" : row.data.priority === "HIGH" ? "높음" : row.data.priority === "URGENT" ? "긴급" : row.data.priority || "보통"}
                              </td>
                            </tr>
                            {hasError && (
                              <tr className="bg-red-50">
                                <td colSpan={8} className="px-3 py-1 pb-2">
                                  <div className="flex flex-wrap gap-2">
                                    {row.errors.map((err, j) => (
                                      <span key={j} className="text-xs text-red-600">
                                        [{err.field}] {err.message}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Step 3: 결과 */}
          {step === "result" && result && (
            <div className="space-y-4">
              <div className="p-6 text-center bg-gray-50 rounded-lg">
                {result.failureCount === 0 ? (
                  <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
                ) : result.successCount === 0 ? (
                  <XCircle className="h-12 w-12 mx-auto text-red-500 mb-3" />
                ) : (
                  <AlertCircle className="h-12 w-12 mx-auto text-yellow-500 mb-3" />
                )}
                <p className="text-lg font-medium">
                  {result.totalCount}건 중 {result.successCount}건 성공
                  {result.failureCount > 0 && `, ${result.failureCount}건 실패`}
                </p>
              </div>

              {result.failureCount > 0 && (
                <div className="border rounded-lg overflow-auto max-h-[300px]">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">행</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">상태</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">상세</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {result.results
                        .filter((r) => !r.success)
                        .map((r) => (
                          <tr key={r.row} className="bg-red-50">
                            <td className="px-3 py-2 text-gray-500">{r.row}</td>
                            <td className="px-3 py-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                            </td>
                            <td className="px-3 py-2 text-red-600 text-xs">{r.error}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          {step === "upload" && (
            <Button variant="outline" onClick={handleClose}>
              취소
            </Button>
          )}

          {step === "preview" && (
            <>
              <Button variant="outline" onClick={handleClose}>
                취소
              </Button>
              <Button
                onClick={handleUpload}
                disabled={validRows === 0 || bulkCreate.isPending}
              >
                {bulkCreate.isPending ? "업로드 중..." : `${validRows}건 업로드`}
              </Button>
            </>
          )}

          {step === "result" && (
            <Button onClick={handleClose}>
              닫기
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
