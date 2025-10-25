"use client";

import React from "react";
import { Home, Users, Settings, Hospital } from "lucide-react";
import { Header } from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { NavItem } from "@/types/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: Home },
    {
      label: "Health Care Facilities",
      href: "/health-care-facilities",
      icon: Hospital,
    },
    { label: "User Managements", href: "/user-managements", icon: Users },
  ];
  const mainPath = "/admin/dashboard"

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
