// app/admin/layout.tsx
import React from "react";
import { Home, Hospital, Settings } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Header } from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Doctors",
      href: "/doctors",
      icon: Hospital,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];

  const mainPath = "/dashboard";

  return (
    <ProtectedRoute requiredRoles={["Admin"]}>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar navItems={navItems} mainPath={mainPath} />
        <div className="flex-1 flex flex-col">
          <Header appName="Admin Dashboard" logoSrc="/logo.png" />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
