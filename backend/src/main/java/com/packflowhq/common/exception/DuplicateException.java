package com.packflowhq.common.exception;

/**
 * 중복 데이터 예외
 */
public class DuplicateException extends BusinessException {

    public DuplicateException(ErrorCode errorCode) {
        super(errorCode);
    }

    public DuplicateException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
