"use client"
// app/admin/layout.tsx
import React from "react";
import { DiameterIcon, DatabaseIcon ,HistoryIcon, Home, Hospital, HospitalIcon, MagnetIcon, Settings, UserCircle2Icon, Users } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Header } from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DoctorHeader } from "@/components/DoctorHeader";

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
      label: "Appointments Management",
      href: "/appointments",
      icon:DatabaseIcon ,
    },
    {
      label: "Schedules Management",
      href: "/schedules",
      icon: DiameterIcon,
    },
    {
      label: "Schedule Exceptions Management",
      href: "/schedule-exceptions",
      icon: HistoryIcon,
    },
    {
      label: "Review Management",
      href: "/review-management",
      icon: MagnetIcon,
    },
  ];

  const mainPath = "/doctor/dashboard";

  return (
    <ProtectedRoute requiredRoles={["Doctor"]}>
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar navItems={navItems} mainPath={mainPath} />
        <div className="flex-1 flex flex-col">
          <DoctorHeader appName="Doctor Dashboard" logoSrc="/logo.png" />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
