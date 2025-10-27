import React from "react";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";
import { NavItem } from "@/types/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from 'next/navigation'
interface SidebarProps {
  navItems: NavItem[];
  mainPath:string
}

export default function Sidebar({ navItems,mainPath }: SidebarProps) {
  const { logout, user } = useAuthContext();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/login")
  };

  return (
    <aside className="flex flex-col w-94 h-screen border-r bg-background">
      <SidebarHeader
        firstName={user?.firstName || "Guest"}
        lastName={user?.lastName || ""}
        onLogout={handleLogout}
      />

      <div className="flex-1 overflow-y-auto p-2">
        <SidebarNav items={navItems} mainPath={mainPath} />
      </div>
    </aside>
  );
}
