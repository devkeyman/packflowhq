import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import DashboardPage from "@/pages/dashboard";
import ProductionListPage from "@/pages/production/list";
import ProductionCreatePage from "@/pages/production/create";
import ProductionDetailPage from "@/pages/production/detail";
import ProductionEditPage from "@/pages/production/edit";
import { LoginPage } from "@/pages/auth/login";
import { ProtectedRoute } from "@/features/auth/components/protected-route";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "production",
        children: [
          {
            index: true,
            element: <ProductionListPage />,
          },
          {
            path: "new",
            element: <ProductionCreatePage />,
          },
          {
            path: ":id",
            element: <ProductionDetailPage />,
          },
          {
            path: ":id/edit",
            element: <ProductionEditPage />,
          },
        ],
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
