import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigation from "@/widgets/navigation";
import { Button } from "@/shared/components/ui/button";
import { Menu, X } from "lucide-react";
import { Sheet } from "@/shared/components/ui/sheet";

const Layout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden lg:block">
        <Navigation />
      </div>

      {/* Mobile Navigation Sheet */}
      <Sheet open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
        <Navigation />
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
            <h1 className="text-lg font-semibold">
              Manufacturing Execution System
            </h1>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
