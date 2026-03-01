package com.packflowhq.adapter.in.web.dto.workorder.response;

import java.util.List;

/**
 * 작업지시서 일괄 등록 응답 DTO
 */
public class BulkCreateResponse {

    private int totalCount;
    private int successCount;
    private int failureCount;
    private List<BulkCreateResultItem> results;

    public BulkCreateResponse(int totalCount, int successCount, int failureCount, List<BulkCreateResultItem> results) {
        this.totalCount = totalCount;
        this.successCount = successCount;
        this.failureCount = failureCount;
        this.results = results;
    }

    public int getTotalCount() { return totalCount; }
    public int getSuccessCount() { return successCount; }
    public int getFailureCount() { return failureCount; }
    public List<BulkCreateResultItem> getResults() { return results; }

    /**
     * 개별 등록 결과
     */
    public static class BulkCreateResultItem {
        private int row;
        private boolean success;
        private String workOrderNo;
        private String error;

        private BulkCreateResultItem(int row, boolean success, String workOrderNo, String error) {
            this.row = row;
            this.success = success;
            this.workOrderNo = workOrderNo;
            this.error = error;
        }

        public static BulkCreateResultItem success(int row, String workOrderNo) {
            return new BulkCreateResultItem(row, true, workOrderNo, null);
        }

        public static BulkCreateResultItem failure(int row, String error) {
            return new BulkCreateResultItem(row, false, null, error);
        }

        public int getRow() { return row; }
        public boolean isSuccess() { return success; }
        public String getWorkOrderNo() { return workOrderNo; }
        public String getError() { return error; }
    }
}
