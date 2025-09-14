import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout";
import DashboardPage from "@/pages/dashboard";
import ProductionPage from "@/pages/production";
import IssuesPage from "@/pages/issues";
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
        element: <ProductionPage />,
      },
      {
        path: "issues",
        element: <IssuesPage />,
      },
    ],
  },
]);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
