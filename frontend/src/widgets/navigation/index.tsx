import React from "react";
import { NavLink } from "react-router-dom";
import { useLogout } from "@/features/auth/hooks/use-auth";
import { useAuthStore } from "@/shared/stores";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import {
  LayoutDashboard,
  Factory,
  LogOut,
  ChevronRight,
  User,
} from "lucide-react";

const Navigation: React.FC = () => {
  const { user } = useAuthStore();
  const logout = useLogout();
  const handleLogout = async () => {
    try {
      await logout.mutateAsync({ email: user?.email || "" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { to: "/", label: "대시보드", icon: LayoutDashboard },
    { to: "/production", label: "생산 관리", icon: Factory },
  ];

  return (
    <nav className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white lg:w-64">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
            <Factory className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Packflow</h1>
            <p className="text-xs text-gray-500">Smart Factory MES</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )
                }
                end={item.to === "/"}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive
                          ? "text-blue-700"
                          : "text-gray-400 group-hover:text-gray-600"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 text-blue-600" />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* User Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.name || "사용자"}
            </p>
            <p className="truncate text-xs text-gray-500">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
          onClick={handleLogout}
          disabled={logout.isPending}
        >
          <LogOut className="h-4 w-4" />
          {logout.isPending ? "로그아웃 중..." : "로그아웃"}
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
