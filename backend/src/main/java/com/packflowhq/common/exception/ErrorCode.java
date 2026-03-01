package com.packflowhq.common.exception;

import org.springframework.http.HttpStatus;

/**
 * 에러 코드 정의
 */
public enum ErrorCode {

    // Common (C)
    INVALID_INPUT("C001", "잘못된 입력값입니다", HttpStatus.BAD_REQUEST),
    INTERNAL_ERROR("C002", "서버 내부 오류가 발생했습니다", HttpStatus.INTERNAL_SERVER_ERROR),

    // Authentication (A)
    UNAUTHORIZED("A001", "인증이 필요합니다", HttpStatus.UNAUTHORIZED),
    INVALID_CREDENTIALS("A002", "이메일 또는 비밀번호가 올바르지 않습니다", HttpStatus.UNAUTHORIZED),
    ACCESS_DENIED("A003", "접근 권한이 없습니다", HttpStatus.FORBIDDEN),
    TOKEN_EXPIRED("A004", "토큰이 만료되었습니다", HttpStatus.UNAUTHORIZED),

    // User (U)
    USER_NOT_FOUND("U001", "사용자를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("U002", "이미 존재하는 사용자입니다", HttpStatus.CONFLICT),

    // WorkOrder (W)
    WORK_ORDER_NOT_FOUND("W001", "작업지시서를 찾을 수 없습니다", HttpStatus.NOT_FOUND),
    WORK_ORDER_DUPLICATE("W002", "이미 존재하는 발주번호입니다", HttpStatus.CONFLICT),
    WORK_ORDER_INVALID_STATUS("W003", "작업 상태를 변경할 수 없습니다", HttpStatus.BAD_REQUEST),
    WORK_ORDER_ALREADY_STARTED("W004", "이미 시작된 작업입니다", HttpStatus.BAD_REQUEST),
    WORK_ORDER_ALREADY_COMPLETED("W005", "이미 완료된 작업입니다", HttpStatus.BAD_REQUEST),
    WORK_ORDER_NO_GENERATION_FAILED("W006", "발주번호 생성에 실패했습니다", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String getCode() { return code; }
    public String getMessage() { return message; }
    public HttpStatus getHttpStatus() { return httpStatus; }
}
