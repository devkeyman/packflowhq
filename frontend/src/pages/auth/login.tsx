import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogin } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/shared/stores";
import { LoginRequest } from "@/entities/user";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const login = useLogin();

  const [formData, setFormData] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 이미 인증된 사용자는 메인 페이지로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 입력 시 해당 필드 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 6) {
      newErrors.password = "비밀번호는 6자 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await login.mutateAsync(formData);
    } catch (error: any) {
      // 에러는 useLogin 훅에서 처리됨
      console.error("Login error:", error);
    }
  };

  const fillCredentials = (email: string, pass: string) => {
    setFormData({ email, password: pass });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PackFlow</h1>
          <p className="text-gray-600">Manufacturing Execution System</p>
        </div>

        <Card className="p-6 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">로그인</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={errors.email ? "border-red-500" : ""}
                placeholder="이메일을 입력하세요"
                disabled={login.isPending}
              />
              {errors.email && (
                <span className="text-sm text-red-600">{errors.email}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? "border-red-500" : ""}
                placeholder="비밀번호를 입력하세요"
                disabled={login.isPending}
              />
              {errors.password && (
                <span className="text-sm text-red-600">{errors.password}</span>
              )}
            </div>

            {login.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">
                  {(() => {
                    const error = login.error as any;
                    // 네트워크 에러 체크 (서버 연결 실패)
                    if (
                      error?.code === "ERR_NETWORK" ||
                      error?.message?.includes("Network Error")
                    ) {
                      return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
                    }
                    // 401, 403 등 인증 에러
                    if (
                      error?.response?.status === 401 ||
                      error?.response?.status === 403
                    ) {
                      return "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
                    }
                    // 400 Bad Request
                    if (error?.response?.status === 400) {
                      return "잘못된 요청입니다. 입력 정보를 확인해주세요.";
                    }
                    // 500 서버 에러
                    if (error?.response?.status >= 500) {
                      return "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                    }
                    // 기본 메시지
                    return "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
                  })()}
                </p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              테스트 계정 (클릭하여 자동 입력)
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <button
                type="button"
                onClick={() => fillCredentials("admin@mes.com", "admin123")}
                className="w-full flex justify-between items-center p-2 hover:bg-gray-100 rounded transition-colors text-left"
              >
                <span className="font-medium">관리자 (Admin)</span>
                <span>admin@mes.com / admin123</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("manager@mes.com", "manager123")}
                className="w-full flex justify-between items-center p-2 hover:bg-gray-100 rounded transition-colors text-left"
              >
                <span className="font-medium">매니저 (Manager)</span>
                <span>manager@mes.com / manager123</span>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("worker@mes.com", "worker123")}
                className="w-full flex justify-between items-center p-2 hover:bg-gray-100 rounded transition-colors text-left"
              >
                <span className="font-medium">작업자 (Worker)</span>
                <span>worker@mes.com / worker123</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
