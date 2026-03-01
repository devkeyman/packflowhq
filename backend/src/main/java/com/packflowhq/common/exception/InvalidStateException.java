package com.packflowhq.common.exception;

/**
 * 잘못된 상태 전이 예외
 */
public class InvalidStateException extends BusinessException {

    public InvalidStateException(ErrorCode errorCode) {
        super(errorCode);
    }

    public InvalidStateException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }
}
