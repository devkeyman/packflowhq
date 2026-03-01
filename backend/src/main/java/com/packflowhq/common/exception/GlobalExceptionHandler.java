package com.packflowhq.common.exception;

import com.packflowhq.common.response.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * 전역 예외 처리
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * 비즈니스 예외 처리
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException ex) {
        log.warn("Business exception: {} - {}", ex.getErrorCode().getCode(), ex.getMessage());

        ErrorCode errorCode = ex.getErrorCode();
        ApiResponse<Void> response = ApiResponse.error(
            errorCode.getCode(),
            ex.getMessage()
        );

        return new ResponseEntity<>(response, errorCode.getHttpStatus());
    }

    /**
     * Validation 예외 처리
     * - HTTP 200으로 응답하고 success: false로 처리
     * - 프론트엔드에서 통일된 응답 처리 가능
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.warn("Validation exception: {}", errors);

        ApiResponse<Void> response = ApiResponse.validationFailed(
            ErrorCode.INVALID_INPUT.getCode(),
            "입력값 검증에 실패했습니다",
            errors
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 인증 실패 예외 처리
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(BadCredentialsException ex) {
        log.warn("Bad credentials exception: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
            ErrorCode.INVALID_CREDENTIALS.getCode(),
            ErrorCode.INVALID_CREDENTIALS.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * 인증 예외 처리
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<Void>> handleAuthenticationException(AuthenticationException ex) {
        log.warn("Authentication exception: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
            ErrorCode.UNAUTHORIZED.getCode(),
            ErrorCode.UNAUTHORIZED.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    /**
     * 권한 없음 예외 처리 (기존 호환)
     */
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorizedException(UnauthorizedException ex) {
        log.warn("Unauthorized exception: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
            ErrorCode.ACCESS_DENIED.getCode(),
            ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    /**
     * 리소스 없음 예외 처리 (기존 호환)
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
            "NOT_FOUND",
            ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    /**
     * 중복 리소스 예외 처리 (기존 호환)
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<Void>> handleDuplicateResourceException(DuplicateResourceException ex) {
        log.warn("Duplicate resource: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
            "DUPLICATE",
            ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    /**
     * IllegalArgumentException 처리
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Illegal argument: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
            ErrorCode.INVALID_INPUT.getCode(),
            ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * IllegalStateException 처리
     */
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalStateException(IllegalStateException ex) {
        log.warn("Illegal state: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.error(
            ErrorCode.INVALID_INPUT.getCode(),
            ex.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    /**
     * 기타 모든 예외 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception ex) {
        log.error("Unexpected error occurred", ex);

        ApiResponse<Void> response = ApiResponse.error(
            ErrorCode.INTERNAL_ERROR.getCode(),
            ErrorCode.INTERNAL_ERROR.getMessage()
        );

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
