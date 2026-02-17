package com.mes.common.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;

/**
 * API 표준 응답 포맷
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private T data;
    private ValidationInfo validation;
    private LocalDateTime timestamp;

    private ApiResponse(boolean success, T data, ValidationInfo validation) {
        this.success = success;
        this.data = data;
        this.validation = validation;
        this.timestamp = LocalDateTime.now();
    }

    // 성공 응답 (데이터 있음)
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, data, null);
    }

    // 성공 응답 (데이터 없음)
    public static <T> ApiResponse<T> success() {
        return new ApiResponse<>(true, null, null);
    }

    // 실패 응답 (HTTP 에러용 - 4xx, 5xx)
    public static <T> ApiResponse<T> error(String code, String message) {
        return new ApiResponse<>(false, null, new ValidationInfo(code, message));
    }

    // 검증 실패 응답
    public static <T> ApiResponse<T> validationFailed(String code, String message) {
        return new ApiResponse<>(false, null, new ValidationInfo(code, message));
    }

    // 검증 실패 응답 (상세 정보 포함)
    public static <T> ApiResponse<T> validationFailed(String code, String message, Object details) {
        return new ApiResponse<>(false, null, new ValidationInfo(code, message, details));
    }

    // Getters
    public boolean isSuccess() { return success; }
    public T getData() { return data; }
    public ValidationInfo getValidation() { return validation; }
    public LocalDateTime getTimestamp() { return timestamp; }

    /**
     * 검증 실패 정보
     */
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ValidationInfo {
        private String code;
        private String message;
        private Object details;

        public ValidationInfo(String code, String message) {
            this.code = code;
            this.message = message;
        }

        public ValidationInfo(String code, String message, Object details) {
            this.code = code;
            this.message = message;
            this.details = details;
        }

        public String getCode() { return code; }
        public String getMessage() { return message; }
        public Object getDetails() { return details; }
    }
}
