package com.packflowhq.application.port.in;

import com.packflowhq.common.dto.auth.LoginRequestDto;
import com.packflowhq.common.dto.auth.LoginResponseDto;

public interface AuthUseCase {
    LoginResponseDto login(LoginRequestDto loginRequest);
    LoginResponseDto refreshToken(String refreshToken);
    void logout(String email);
}