"use client"
import React from "react";
import { Home, Hospital, MagnetIcon, HospitalIcon,Users, UserCircle2Icon,DiameterIcon,HistoryIcon } from "lucide-react";
import { NavItem } from "@/types/navigation";
import { Header } from "@/components/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Layout({
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
      icon: Users,
    },
    {
      label: "Departments Management",
      href: "/departments",
      icon: HospitalIcon,
    },
    {
      label: "Doctor Departments Management",
      href: "/doctor-departments",
      icon: UserCircle2Icon,
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

  const mainPath = "/health-care-facility/dashboard";

  return (
    <ProtectedRoute requiredRoles={["HealthCareFacility"]}>
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
